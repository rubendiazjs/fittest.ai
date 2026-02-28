---
name: supabase-patterns
description: Supabase client setup, database queries, auth, and RLS patterns. Use when setting up Supabase, creating queries/mutations, or working with auth.
---

# Supabase Patterns - Fittest.ai Stack

## Tech Stack Context

- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Client**: @supabase/supabase-js v2
- **Types**: Generated from `src/lib/database.types.ts`
- **Data Fetching**: TanStack Query wrapping Supabase calls
- **Auth**: Supabase Auth (email/password, OAuth)

## Project Configuration

```
Project URL: https://qhtkechgkkkigxxweahc.supabase.co
Anon Key: Use environment variable VITE_SUPABASE_ANON_KEY
```

---

## Core Rules

1. **ALWAYS use typed client** - Import `Database` type for full type safety
2. **ALWAYS handle errors** - Supabase returns `{ data, error }`, check both
3. **ALWAYS use RLS** - Never disable RLS, design queries that work with it
4. **Use environment variables** - Never hardcode keys in source
5. **Wrap in TanStack Query** - Use queries/mutations for caching and state

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   └── database.types.ts    # Generated types (npx supabase gen types)
├── features/
│   └── [feature]/
│       ├── api/
│       │   ├── queries.ts   # Supabase query functions
│       │   ├── mutations.ts # Supabase mutation functions
│       │   └── keys.ts      # Query key factory
│       └── hooks/
│           └── use[Feature].ts  # TanStack Query hooks
```

---

## Client Setup

### Supabase Client Singleton

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Environment Variables

```bash
# .env.local (never commit this file)
VITE_SUPABASE_URL=https://qhtkechgkkkigxxweahc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Typed Client Usage

```typescript
// The client is fully typed based on your database schema
const { data, error } = await supabase
  .from('player_profiles')  // Autocomplete for table names
  .select('*')
  .eq('user_id', userId);   // Type-safe column names

// data is typed as PlayerProfile[] | null
```

---

## Query Patterns

### Basic Select

```typescript
// src/features/player-onboarding/api/queries.ts
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/database.types';

type PlayerProfile = Tables<'player_profiles'>;

export const fetchPlayerProfile = async (
  userId: string
): Promise<PlayerProfile | null> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // PGRST116 = no rows found (not an error for optional data)
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};
```

### Select with Relations

```typescript
// Fetch with related data (if you have foreign keys)
export const fetchProfileWithSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('player_profiles')
    .select(`
      *,
      training_sessions (
        id,
        created_at,
        duration
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};
```

### Select with Filters

```typescript
export const fetchSessionsByLevel = async (level: string) => {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('game_experience_level', level)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
};
```

---

## Mutation Patterns

### Insert

```typescript
// src/features/player-onboarding/api/mutations.ts
import { supabase } from '@/lib/supabase';
import type { TablesInsert } from '@/lib/database.types';

type PlayerProfileInsert = TablesInsert<'player_profiles'>;

export const createPlayerProfile = async (
  profile: PlayerProfileInsert
): Promise<Tables<'player_profiles'>> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Update

```typescript
import type { TablesUpdate } from '@/lib/database.types';

type PlayerProfileUpdate = TablesUpdate<'player_profiles'>;

export const updatePlayerProfile = async (
  userId: string,
  updates: PlayerProfileUpdate
): Promise<Tables<'player_profiles'>> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Upsert (Insert or Update)

```typescript
export const upsertPlayerProfile = async (
  profile: PlayerProfileInsert
): Promise<Tables<'player_profiles'>> => {
  const { data, error } = await supabase
    .from('player_profiles')
    .upsert(profile, {
      onConflict: 'user_id',  // Unique constraint column
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Delete

```typescript
export const deletePlayerProfile = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('player_profiles')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};
```

---

## TanStack Query Integration

### Query Hook

```typescript
// src/features/player-onboarding/hooks/usePlayerProfile.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPlayerProfile } from '../api/queries';
import { profileKeys } from '../api/keys';

export const usePlayerProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: profileKeys.detail(userId!),
    queryFn: () => fetchPlayerProfile(userId!),
    enabled: !!userId,  // Only run if userId exists
    staleTime: 1000 * 60 * 5,  // 5 minutes
  });
};
```

### Mutation Hook

```typescript
// src/features/player-onboarding/hooks/useCreatePlayerProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { createPlayerProfile } from '../api/mutations';
import { profileKeys } from '../api/keys';

export const useCreatePlayerProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createPlayerProfile,

    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      });

      toast({
        title: 'Profile created',
        description: 'Your player profile has been saved.',
      });
    },

    onError: (error) => {
      console.error('createPlayerProfile failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
      });
    },
  });
};
```

### Query Key Factory

```typescript
// src/features/player-onboarding/api/keys.ts
export const profileKeys = {
  all: ['player-profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
};
```

---

## Auth Patterns

### Get Current User

```typescript
import { supabase } from '@/lib/supabase';

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// For sync access (cached, might be stale)
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};
```

### Auth State Hook

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

### Sign In / Sign Up

```typescript
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
```

### Protected Query Pattern

```typescript
// Queries that require auth should get user_id from auth
export const fetchMyProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
};
```

---

## RLS-Aware Patterns

### Understanding RLS

Row Level Security (RLS) filters data at the database level. Your queries should be written assuming RLS is active.

```sql
-- Example RLS policy (already applied to player_profiles)
CREATE POLICY "Users can view their own profile"
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);
```

### RLS-Friendly Query Patterns

```typescript
// CORRECT - RLS will filter automatically
const { data } = await supabase
  .from('player_profiles')
  .select('*');
// Returns only current user's profile(s)

// CORRECT - Explicit filter (redundant but clear)
const { data } = await supabase
  .from('player_profiles')
  .select('*')
  .eq('user_id', userId);

// WRONG - Trying to access other users' data
// This will return empty due to RLS (not an error)
const { data } = await supabase
  .from('player_profiles')
  .select('*')
  .eq('user_id', 'some-other-user-id');  // Returns null/empty
```

### Handling "No Rows" with RLS

```typescript
// RLS might cause "no rows" - handle gracefully
export const fetchPlayerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // PGRST116 = "JSON object requested, multiple (or no) rows returned"
    // This happens when no profile exists OR RLS blocks access
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};
```

---

## Error Handling

### Supabase Error Structure

```typescript
interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;  // PostgreSQL error code
}
```

### Common Error Codes

| Code | Meaning | How to Handle |
|------|---------|---------------|
| `PGRST116` | No rows / multiple rows for `.single()` | Return null or handle as "not found" |
| `23505` | Unique constraint violation | Show "already exists" message |
| `23503` | Foreign key violation | Related record doesn't exist |
| `42501` | RLS policy violation | User not authorized |
| `PGRST301` | Row-level security violation | User not authorized |

### Error Handling Pattern

```typescript
export const createProfile = async (profile: ProfileInsert) => {
  const { data, error } = await supabase
    .from('player_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    // Handle specific errors
    if (error.code === '23505') {
      throw new Error('Profile already exists');
    }
    if (error.code === '42501' || error.code === 'PGRST301') {
      throw new Error('Not authorized to create profile');
    }
    // Re-throw unknown errors
    throw error;
  }

  return data;
};
```

---

## Regenerating Types

When you modify the database schema, regenerate types:

```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id qhtkechgkkkigxxweahc > src/lib/database.types.ts

# Or if using MCP, use the generate_typescript_types tool
```

---

## Anti-Patterns

```typescript
// WRONG - Not checking error
const { data } = await supabase.from('profiles').select('*');
return data;  // Could be null if error occurred!

// CORRECT - Always check error
const { data, error } = await supabase.from('profiles').select('*');
if (error) throw error;
return data ?? [];


// WRONG - Hardcoded credentials
const supabase = createClient(
  'https://xxx.supabase.co',
  'eyJhbGci...'  // Never do this!
);

// CORRECT - Environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


// WRONG - Not using typed client
const supabase = createClient(url, key);

// CORRECT - Pass Database type
const supabase = createClient<Database>(url, key);


// WRONG - Calling Supabase directly in components
const MyComponent = () => {
  useEffect(() => {
    supabase.from('profiles').select('*').then(...)  // No caching!
  }, []);
};

// CORRECT - Use TanStack Query hooks
const MyComponent = () => {
  const { data, isLoading } = usePlayerProfile(userId);
};
```

---

## Checklist

Before completing Supabase integration:

**Setup:**
- [ ] Supabase client created with typed `Database` generic
- [ ] Environment variables configured (not hardcoded)
- [ ] Types generated from database schema

**Queries:**
- [ ] All queries check for `error` before using `data`
- [ ] Queries wrapped in TanStack Query hooks
- [ ] Query key factory created for feature
- [ ] PGRST116 handled for `.single()` calls

**Mutations:**
- [ ] Mutations have `onError` handler with toast
- [ ] Mutations have `onSuccess` with cache invalidation
- [ ] Insert/Update use proper typed input (`TablesInsert`/`TablesUpdate`)

**Auth:**
- [ ] Auth state listener set up if needed
- [ ] Protected routes check for user
- [ ] Queries use `auth.uid()` compatible filters

**RLS:**
- [ ] RLS enabled on all tables
- [ ] Policies tested for each operation (SELECT/INSERT/UPDATE/DELETE)
- [ ] No sensitive data exposed via missing policies

---

## Integration with Other Skills

- **tanstack-query-patterns**: Wrap all Supabase calls in TanStack Query
- **react-ui-patterns**: Handle loading/error/empty states from queries
- **testing-patterns**: Mock Supabase client in tests
