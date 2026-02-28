# Auth & Role Management Integration Plan

## 1. Overview
Fittest.ai is transitioning from a single-user mock authentication system to a professional, multi-tenant platform. This plan outlines the technical and architectural changes required to support **Athletes** and **Coaches** as distinct user roles with unique permissions and workflows.

Database schema is defined in [ADR 002](./decisions/002-trainer-database-schema.md).

---

## 2. User Personas & Roles

| Role | Primary Goal | Access Level |
| :--- | :--- | :--- |
| **Athlete** | Get personalized training and track progress. | Own profile, check-ins, and shared coach sessions. |
| **Coach** | Manage multiple athletes and generate programs. | Own coach profile + read-only access to linked athletes. |
| **Admin** | Manage platform configuration and verification. | System-wide configuration. |

---

## 3. The New Auth Flow

### Step 1: Authentication (Supabase Auth)
- User signs up via Email/Password or Social Login.
- A Supabase trigger (`handle_new_user`) automatically creates a row in `public.profiles` with `role = NULL`.

### Step 2: Role Selection
- On login, check `profiles.role`. If `NULL`, show the **Role Selection Screen**.
- Selecting a role sets `profiles.role` and `profiles.role_selected_at`.

### Step 3: Role-Specific Onboarding
- **Athletes:** Redirected to `OnboardingWizard` (existing implementation).
- **Coaches:** Redirected to a new `CoachOnboarding` flow to define specialties and credentials.

### Routing Tree

```
No session           → LoginPage
Session + no role    → RoleSelectionPage
Athlete + no profile → OnboardingWizard
Athlete + profile    → AthleteDashboard (current AppContent)
Coach + no coach_profile → CoachOnboarding
Coach + coach_profile    → CoachDashboard (Trainer Dashboard)
```

---

## 4. Technical Architecture

### 4.1 Frontend Auth Layer

**New files:**
- `src/lib/AuthProvider.tsx` — React Context wrapping `supabase.auth.onAuthStateChange()`
- `src/lib/useAuth.ts` — Hook returning `{ user, session, profile, role, isLoading }`
- `src/components/ProtectedRoute.tsx` — Wrapper restricting access by role

**`useAuth()` contract:**
```typescript
interface AuthContext {
  user: User | null         // Supabase auth.users row
  session: Session | null   // Supabase session (JWT)
  profile: Profile | null   // public.profiles row
  role: 'athlete' | 'coach' | 'admin' | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

### 4.2 MOCK_USER_ID Elimination

Currently `MOCK_USER_ID` is hardcoded in 4 files:
- `src/features/player-onboarding/hooks/usePlayerProfile.ts`
- `src/features/player-onboarding/components/ResultStep.tsx`
- `src/features/daily-checkin/hooks/useDailyCheckin.ts`
- `src/features/daily-checkin/hooks/useCheckinHistory.ts`

**Strategy:** All hooks will call `useAuth()` to get `user.id`. No env var toggle — the hooks get a real user ID from auth or nothing.

For local development without auth during the transition, `AuthProvider` can optionally return the mock ID when `VITE_USE_MOCK_AUTH=true`, keeping the fallback in one place instead of scattered across hooks.

### 4.3 Database Layer

Defined in [ADR 002](./decisions/002-trainer-database-schema.md). Key tables:
- `profiles` — extends `auth.users`, holds `role`
- `coach_profiles` — coach-specific credentials
- `roster_links` — coach-athlete bridge with invitation lifecycle

### 4.4 Supabase Trigger: `handle_new_user`

Required to auto-create a `profiles` row on sign-up:

```sql
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
```

> **Note:** This requires changing ADR 002's `profiles.role` from `NOT NULL DEFAULT 'athlete'` to `NULL` (nullable, no default). The role is set explicitly during role selection, not assumed at sign-up.

### 4.5 Row Level Security

Full RLS policies are defined in [ADR 002](./decisions/002-trainer-database-schema.md#sql-schema). Key principles:
- Athletes can only read/write their own data.
- Coaches can read athlete data only through an `active` roster link with `shared_data_access = true`.
- Only coaches can create roster invitations.
- Either party can update roster link status (accept, terminate, toggle sharing).

---

## 5. Implementation Phases

### Phase 1: Core Auth & Profiles Table
**Prerequisite:** Partial ADR 002 migration — `profiles` table + `handle_new_user` trigger only. No `coach_profiles` or `roster_links` yet.

- [ ] Apply migration: `profiles` table (with `role` as nullable) + trigger
- [ ] Backfill `profiles` from existing `auth.users`
- [ ] Build `AuthProvider.tsx` + `useAuth()` hook
- [ ] Build `LoginPage` component (email/password sign-up/sign-in)
- [ ] Build `RoleSelectionPage` component
- [ ] Update `App.tsx` routing tree (see Section 3)

### Phase 2: Athlete Auth Integration
**Prerequisite:** Phase 1 complete.

- [ ] Replace `MOCK_USER_ID` in `usePlayerProfile.ts` with `useAuth().user.id`
- [ ] Replace `MOCK_USER_ID` in `ResultStep.tsx` with `useAuth().user.id`
- [ ] Replace `MOCK_USER_ID` in `useDailyCheckin.ts` with `useAuth().user.id`
- [ ] Replace `MOCK_USER_ID` in `useCheckinHistory.ts` with `useAuth().user.id`
- [ ] Update `generate-warmup` Edge Function to get user from JWT (already receives auth header)
- [ ] Add `ProtectedRoute` wrapper for athlete-only routes
- [ ] Test full athlete flow: sign-up → role select → onboard → dashboard → check-in → warm-up

### Phase 3: Coach System
**Prerequisite:** Phase 2 complete. Apply remaining ADR 002 migration (`coach_profiles`, `roster_links`, indexes, RLS policies).

- [ ] Apply migration: `coach_profiles` + `roster_links` + RLS policies
- [ ] Build `CoachOnboarding` component
- [ ] Build "Invite Athlete" feature (coach creates pending roster link)
- [ ] Build "Accept Invite" flow for athletes
- [ ] Build Trainer Dashboard with roster view
- [ ] Add `ProtectedRoute` wrapper for coach-only routes

---

## 6. Security Considerations
- **Data Leakage:** Strict RLS is mandatory — coaches cannot see data of athletes not in their roster.
- **Role Locking:** Users cannot change their role once selected without Admin intervention.
- **Session Persistence:** Supabase handles session refresh via `onAuthStateChange`. Store session in memory (not localStorage) for better security.
- **Edge Functions:** Already receive the auth JWT in the `Authorization` header. Use `supabase.auth.getUser()` server-side to validate.
