DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'roster_status'
  ) THEN
    CREATE TYPE public.roster_status AS ENUM ('pending', 'active', 'terminated');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.coach_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  organization_name TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roster_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coach_profiles(id) ON DELETE CASCADE NOT NULL,
  athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status public.roster_status DEFAULT 'pending'::public.roster_status NOT NULL,
  shared_data_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (coach_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_roster_links_athlete_id ON public.roster_links (athlete_id);
CREATE INDEX IF NOT EXISTS idx_roster_links_coach_id ON public.roster_links (coach_id);

ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roster_links ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'coach_profiles'
      AND policyname = 'coach_profiles_select_authenticated'
  ) THEN
    CREATE POLICY "coach_profiles_select_authenticated"
      ON public.coach_profiles FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'coach_profiles'
      AND policyname = 'coach_profiles_update_own'
  ) THEN
    CREATE POLICY "coach_profiles_update_own"
      ON public.coach_profiles FOR UPDATE
      TO authenticated
      USING (id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'coach_profiles'
      AND policyname = 'coach_profiles_insert_own'
  ) THEN
    CREATE POLICY "coach_profiles_insert_own"
      ON public.coach_profiles FOR INSERT
      TO authenticated
      WITH CHECK (id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'roster_links'
      AND policyname = 'roster_links_select_involved'
  ) THEN
    CREATE POLICY "roster_links_select_involved"
      ON public.roster_links FOR SELECT
      TO authenticated
      USING (coach_id = auth.uid() OR athlete_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'roster_links'
      AND policyname = 'roster_links_insert_coach'
  ) THEN
    CREATE POLICY "roster_links_insert_coach"
      ON public.roster_links FOR INSERT
      TO authenticated
      WITH CHECK (coach_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'roster_links'
      AND policyname = 'roster_links_update_involved'
  ) THEN
    CREATE POLICY "roster_links_update_involved"
      ON public.roster_links FOR UPDATE
      TO authenticated
      USING (coach_id = auth.uid() OR athlete_id = auth.uid());
  END IF;
END $$;
