# ADR 002: Trainer-Athlete Database Schema

## Status
Accepted

## Context
Fittest.ai is evolving from a single-user athlete app to a professional platform where coaches manage multiple athletes. We need a robust schema to handle:
1.  User roles (Athlete vs. Coach).
2.  Professional credentials for coaches.
3.  Secure "Roster" links between coaches and athletes.
4.  Data privacy (Athletes should only share data with linked coaches).

## Decision
We will implement a centralized `profiles` table that extends Supabase `auth.users`, and specialized tables for coach-specific data and roster management.

### SQL Schema

```sql
-- 1. Enums
CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'admin');
CREATE TYPE roster_status AS ENUM ('pending', 'active', 'terminated');

-- 2. Base Profiles (Extends auth.users)
-- This table holds common data and the primary role.
-- role is nullable: NULL means the user hasn't selected a role yet (triggers Role Selection screen).
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role user_role,  -- NULL until user selects role after first login
  role_selected_at TIMESTAMP WITH TIME ZONE,  -- Set when role is chosen; NULL = pending selection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Coach Specific Profiles
-- Holds credentials and professional info.
CREATE TABLE public.coach_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}', -- e.g., ['padel', 'strength', 'rehab']
  organization_name TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Roster Links (The Coach-Athlete "Bridge")
-- Manages the many-to-many relationship and permissions.
CREATE TABLE public.roster_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coach_profiles(id) ON DELETE CASCADE NOT NULL,
  athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status roster_status DEFAULT 'pending'::roster_status NOT NULL,
  shared_data_access BOOLEAN DEFAULT true, -- Allows athlete to toggle visibility (MVP: single toggle; future: granular per-table controls)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Prevent duplicate links
  UNIQUE(coach_id, athlete_id)
);

-- Index for reverse lookup: "which coaches does this athlete have?"
CREATE INDEX idx_roster_links_athlete_id ON public.roster_links(athlete_id);

-- 5. Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    NULL  -- Role selected after first login
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Row Level Security (RLS) Policies

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can discover profiles

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- coach_profiles
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coach_profiles_select_authenticated"
  ON public.coach_profiles FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can discover coaches

CREATE POLICY "coach_profiles_update_own"
  ON public.coach_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "coach_profiles_insert_own"
  ON public.coach_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- roster_links
ALTER TABLE public.roster_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roster_links_select_involved"
  ON public.roster_links FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid());

CREATE POLICY "roster_links_insert_coach"
  ON public.roster_links FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid()); -- Only coaches can create invitations

CREATE POLICY "roster_links_update_involved"
  ON public.roster_links FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid()); -- Either party can update (accept, terminate, toggle sharing)

-- player_profiles: coach access through active roster link
CREATE POLICY "player_profiles_select_linked_coach"
  ON public.player_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.roster_links rl
      WHERE rl.athlete_id = player_profiles.user_id
        AND rl.coach_id = auth.uid()
        AND rl.status = 'active'
        AND rl.shared_data_access = true
    )
  );

-- checkin_responses: coach access through active roster link
CREATE POLICY "checkin_responses_select_linked_coach"
  ON public.checkin_responses FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.roster_links rl
      WHERE rl.athlete_id = checkin_responses.user_id
        AND rl.coach_id = auth.uid()
        AND rl.status = 'active'
        AND rl.shared_data_access = true
    )
  );
```

### Invitation Flow

A coach adds an athlete by creating a `roster_links` row with `status = 'pending'`. The athlete sees the pending invitation and can accept (`status = 'active'`) or decline (delete the row). Either party can terminate the link (`status = 'terminated'`).

## Migration Path

Existing `player_profiles` rows reference `auth.users` via `user_id`. The migration:

1. Create the `profiles` table, enums, and `handle_new_user` trigger.
2. Backfill `profiles` from existing `auth.users`. Existing users with a `player_profiles` row get `role = 'athlete'` and `role_selected_at = now()`. Users without a profile row get `role = NULL` (will see role selection on next login).
3. `player_profiles.user_id` already stores the same UUID as `profiles.id`, so existing joins work without changing the FK target.
4. `coach_profiles`, `roster_links`, and cross-table RLS policies can be applied in a later migration (see [AUTH_INTEGRATION Phase 3](../AUTH_INTEGRATION.md#phase-3-coach-system)).

No changes to `player_profiles` schema are required — only new RLS policies are layered on.

## Consequences

### Positive
- **Scalability:** Easy to add new roles (e.g., `'club_manager'`) via the enum.
- **Privacy:** RLS strictly tied to `roster_links` — coaches can only see data for athletes who have accepted their invite and have `shared_data_access = true`.
- **Data Integrity:** Centralized profiles prevent desynchronization between different user types.

### Negative
- **Migration Effort:** Need to backfill `profiles` from existing `auth.users`.
- **Query Complexity:** Trainer Dashboard requires more joins (Coach -> Roster -> Athlete -> PlayerProfile).
- **Granularity Limitation:** `shared_data_access` is a single boolean. Future needs (share check-ins but not injury data) will require a more granular permissions model.

## Data Access Pattern (Trainer Dashboard)
To get a coach's roster with athlete readiness:
```sql
SELECT
  p.full_name,
  pp.fitness_level,
  pp.injury_status,
  cs.current_streak
FROM roster_links rl
JOIN profiles p ON rl.athlete_id = p.id
JOIN player_profiles pp ON pp.user_id = p.id
LEFT JOIN checkin_streaks cs ON cs.user_id = p.id
WHERE rl.coach_id = auth.uid()
  AND rl.status = 'active'
  AND rl.shared_data_access = true;
```
