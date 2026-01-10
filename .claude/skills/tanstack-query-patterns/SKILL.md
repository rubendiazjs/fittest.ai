---
name: tanstack-query-patterns
description: TanStack Query (React Query) patterns for data fetching, caching, and mutations. Use when creating queries, mutations, or managing server state. Replaces GraphQL patterns for our REST/Supabase API approach.
---

# TanStack Query Patterns - Fittest.ai Stack

## Tech Stack Context

- **Data Library**: TanStack Query v5 (React Query)
- **Backend**: Direct API calls (Claude API), Future: Supabase
- **Client State**: Zustand (for UI state)
- **Server State**: TanStack Query (for API data)

---

## Core Rules

1. **ALWAYS use query keys** - Unique, hierarchical keys
2. **ALWAYS add `onError` handler** to mutations  
3. **Use custom hooks** - Wrap queries/mutations in hooks
4. **Handle all states** - Loading, error, empty, success
5. **Invalidate on mutations** - Keep cache fresh

---

## File Structure

```
src/
├── features/
│   └── session-generator/
│       ├── api/
│       │   ├── queries.ts       # Query functions
│       │   ├── mutations.ts     # Mutation functions
│       │   └── keys.ts          # Query key factory
│       ├── hooks/
│       │   ├── useGenerateSession.ts  # Custom hook
│       │   └── useSessionHistory.ts   # Custom hook
│       └── types/
│           └── session.types.ts
```

---

## Query Key Patterns

### Query Key Factory

Always create a factory for feature query keys:

```typescript
// src/features/session-generator/api/keys.ts
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  generation: () => [...sessionKeys.all, 'generation'] as const,
};

// Usage:
// sessionKeys.all           → ['sessions']
// sessionKeys.lists()       → ['sessions', 'list']
// sessionKeys.list('beginner') → ['sessions', 'list', { filters: 'beginner' }]
// sessionKeys.detail('123') → ['sessions', 'detail', '123']
```

**Why hierarchical keys?**
- Easy to invalidate all sessions: `invalidateQueries({ queryKey: sessionKeys.all })`
- Easy to invalidate lists: `invalidateQueries({ queryKey: sessionKeys.lists() })`
- Easy to invalidate specific: `invalidateQueries({ queryKey: sessionKeys.detail(id) })`

---

## Creating a Query

### Step 1: Create query function

```typescript
// src/features/session-generator/api/queries.ts
import type { SessionData } from '../types/session.types';

export const fetchSessionHistory = async (): Promise<SessionData[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchSession = async (id: string): Promise<SessionData> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
```

### Step 2: Create custom hook

```typescript
// src/features/session-generator/hooks/useSessionHistory.ts
import { useQuery } from '@tanstack/react-query';
import { sessionKeys } from '../api/keys';
import { fetchSessionHistory } from '../api/queries';

export const useSessionHistory = () => {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: fetchSessionHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

### Step 3: Use in component

```typescript
import { useSessionHistory } from './hooks/useSessionHistory';
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";

const SessionHistory = () => {
  const { data, isLoading, error, refetch } = useSessionHistory();

  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (isLoading && !data) return <Skeleton className="h-48 w-full" />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="grid gap-4">
      {data.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};
```

---

## Creating a Mutation

### Step 1: Create mutation function

```typescript
// src/features/session-generator/api/mutations.ts
import type { SessionFormData, SessionData } from '../types/session.types';

export const generateSession = async (
  input: SessionFormData
): Promise<SessionData> => {
  // Call Claude API
  const response = await fetch('/api/generate-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to generate session');
  }

  return response.json();
};

export const saveSession = async (
  session: SessionData
): Promise<SessionData> => {
  const { data, error } = await supabase
    .from('sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Step 2: Create custom hook with REQUIRED error handling

```typescript
// src/features/session-generator/hooks/useGenerateSession.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { generateSession, saveSession } from '../api/mutations';
import { sessionKeys } from '../api/keys';

export const useGenerateSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: SessionFormData) => {
      // Generate session
      const generated = await generateSession(input);
      // Save to database (future)
      // const saved = await saveSession(generated);
      return generated;
    },
    
    // SUCCESS handling
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: sessionKeys.lists() 
      });
      
      toast({
        title: "Success",
        description: "Session generated successfully",
      });
    },
    
    // ERROR HANDLING IS REQUIRED
    onError: (error) => {
      console.error("generateSession failed:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Please try again",
      });
    },
  });
};
```

### Step 3: Use in component

```typescript
import { useGenerateSession } from './hooks/useGenerateSession';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SessionGenerator = () => {
  const generateMutation = useGenerateSession();

  const handleGenerate = (formData: SessionFormData) => {
    generateMutation.mutate(formData);
  };

  return (
    <Button
      onClick={() => handleGenerate(formData)}
      disabled={!isValid || generateMutation.isPending}
    >
      {generateMutation.isPending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Generate Session
    </Button>
  );
};
```

---

## Mutation UI Requirements

**CRITICAL: Every mutation trigger must:**

1. **Be disabled during mutation** - Prevent double-clicks
2. **Show loading state** - Visual feedback
3. **Have onError handler** - User knows it failed
4. **Show success feedback** - User knows it worked
5. **Invalidate queries** - Keep data fresh

```typescript
// CORRECT - Complete mutation pattern
const mutation = useMutation({
  mutationFn: saveData,
  onError: (error) => {
    console.error("save failed:", error);
    toast({
      variant: "destructive",
      title: "Save failed",
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: dataKeys.all });
    toast({ title: "Saved successfully" });
  },
});

<Button
  onClick={handleSubmit}
  disabled={!isValid || mutation.isPending}
>
  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

---

## Query Options

### Fetch Policies (staleTime)

| staleTime        | Use When                          |
| ---------------- | --------------------------------- |
| `0` (default)    | Always fetch fresh data           |
| `1000 * 60`      | Data changes every minute         |
| `1000 * 60 * 5`  | Data rarely changes (5 min)       |
| `Infinity`       | Static data, never refetch        |

### Common Options

```typescript
useQuery({
  queryKey: ['items', id],
  queryFn: () => fetchItem(id),

  // How long data is considered fresh
  staleTime: 1000 * 60 * 5, // 5 minutes

  // How long inactive data stays in cache
  gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)

  // Refetch on window focus
  refetchOnWindowFocus: true,

  // Refetch on reconnect
  refetchOnReconnect: true,

  // Skip query if condition not met
  enabled: !!id,

  // Retry failed requests
  retry: 3,

  // Retry delay
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

---

## Optimistic Updates

For instant UI feedback:

```typescript
const mutation = useMutation({
  mutationFn: toggleFavorite,
  
  // Optimistic update
  onMutate: async (sessionId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: sessionKeys.all });

    // Snapshot previous value
    const previousSessions = queryClient.getQueryData(sessionKeys.lists());

    // Optimistically update
    queryClient.setQueryData(sessionKeys.lists(), (old: SessionData[]) =>
      old?.map(session =>
        session.id === sessionId
          ? { ...session, isFavorite: !session.isFavorite }
          : session
      )
    );

    // Return context with snapshot
    return { previousSessions };
  },

  // On error, rollback
  onError: (err, variables, context) => {
    queryClient.setQueryData(
      sessionKeys.lists(),
      context?.previousSessions
    );
    toast({
      variant: "destructive",
      title: "Update failed",
    });
  },

  // Always refetch after error or success
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: sessionKeys.all });
  },
});
```

### When NOT to Use Optimistic Updates

- Operations that can fail validation
- Operations with server-generated values
- Destructive operations (delete) - use confirmation first
- Complex data transformations

---

## Infinite Queries (Pagination)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const useInfiniteSessions = () => {
  return useInfiniteQuery({
    queryKey: sessionKeys.lists(),
    queryFn: ({ pageParam = 0 }) => 
      fetchSessions({ offset: pageParam, limit: 20 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 20) return undefined;
      return pages.length * 20;
    },
  });
};

// In component
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSessions();

<Button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetchingNextPage}
>
  {isFetchingNextPage ? 'Loading...' : 'Load More'}
</Button>
```

---

## Anti-Patterns

```typescript
// WRONG - No query key factory
const { data } = useQuery({ queryKey: ['sessions'], ... });

// CORRECT - Use key factory
const { data } = useQuery({ queryKey: sessionKeys.lists(), ... });


// WRONG - No error handler
const mutation = useMutation({ mutationFn: saveData });

// CORRECT - Always handle errors
const mutation = useMutation({
  mutationFn: saveData,
  onError: (error) => {
    console.error('save failed:', error);
    toast({ variant: "destructive", title: "Save failed" });
  },
});


// WRONG - Button not disabled during mutation
<Button onClick={() => mutation.mutate(data)}>Submit</Button>

// CORRECT - Disabled and loading
<Button disabled={mutation.isPending} onClick={() => mutation.mutate(data)}>
  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>


// WRONG - Not invalidating cache after mutation
onSuccess: () => {
  toast({ title: "Saved" });
}

// CORRECT - Invalidate to refetch
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: sessionKeys.all });
  toast({ title: "Saved" });
}
```

---

## DevTools

Install React Query DevTools for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

---

## Integration with Other Skills

- **react-ui-patterns**: Loading/error/empty states for queries
- **systematic-debugging**: Use DevTools to debug cache issues
- **testing-patterns**: Mock queries and mutations in tests
