---
name: react-ui-patterns
description: Modern React UI patterns for loading states, error handling, and data fetching with TanStack Query and shadcn/ui. Use when building UI components, handling async data, or managing UI states.
---

# React UI Patterns - Fittest.ai Stack

## Tech Stack Context

- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: shadcn/ui (Radix + Tailwind CSS)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **State**: Zustand (client state), TanStack Query (server state)

## Core Principles

1. **Never show stale UI** - Loading spinners only when actually loading
2. **Always surface errors** - Users must know when something fails
3. **Optimistic updates** - Make the UI feel instant
4. **Progressive disclosure** - Show content as it becomes available
5. **Graceful degradation** - Partial data is better than no data

---

## Loading State Patterns

### The Golden Rule

**Show loading indicator ONLY when there's no data to display.**

```typescript
// CORRECT - Only show loading when no data exists (TanStack Query)
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
});

if (error) return <ErrorState error={error} onRetry={refetch} />;
if (isLoading && !data) return <LoadingState />;
if (!data?.length) return <EmptyState />;

return <ItemList items={data} />;
```

```typescript
// WRONG - Shows spinner even when we have cached data
if (isLoading) return <LoadingState />; // Flashes on refetch!
```

### Loading State Decision Tree

```
Is there an error?
  → Yes: Show error state with retry option
  → No: Continue

Is it loading AND we have no data?
  → Yes: Show loading indicator (spinner/skeleton)
  → No: Continue

Do we have data?
  → Yes, with items: Show the data
  → Yes, but empty: Show empty state
  → No: Show loading (fallback)
```

### Skeleton vs Spinner (shadcn/ui)

| Use Skeleton When    | Use Spinner When      | shadcn Component |
| -------------------- | --------------------- | ---------------- |
| Known content shape  | Unknown content shape | `<Skeleton />`   |
| List/card layouts    | Modal actions         | `<Skeleton />`   |
| Initial page load    | Button submissions    | `<Skeleton />`   |
| Content placeholders | Inline operations     | Spinner (custom) |

**Skeleton Example:**
```tsx
import { Skeleton } from "@/components/ui/skeleton"

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
)
```

---

## Error Handling Patterns

### The Error Handling Hierarchy

```
1. Inline error (field-level) → Form validation errors (Zod + React Hook Form)
2. Toast notification → Recoverable errors, user can retry (shadcn Toast)
3. Error banner → Page-level errors, data still partially usable (shadcn Alert)
4. Full error screen → Unrecoverable, needs user action (Custom component)
```

### Always Show Errors

**CRITICAL: Never swallow errors silently.**

```typescript
// CORRECT - Error always surfaced to user (TanStack Query mutation)
import { useMutation } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

const createItemMutation = useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    toast({
      title: "Success",
      description: "Item created successfully",
    });
  },
  onError: (error) => {
    console.error("createItem failed:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create item. Please try again.",
    });
  },
});

// WRONG - Error silently caught, user has no idea
const createItemMutation = useMutation({
  mutationFn: createItem,
  onError: (error) => {
    console.error(error); // User sees nothing!
  },
});
```

### Error State Component Pattern (shadcn/ui)

```tsx
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
}

const ErrorState = ({ error, onRetry, title }: ErrorStateProps) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
    <AlertDescription className="space-y-2">
      <p>{error.message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </AlertDescription>
  </Alert>
);
```

---

## Button State Patterns (shadcn/ui Button)

### Button Loading State

```tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

<Button
  onClick={handleSubmit}
  disabled={isSubmitting || !isValid}
>
  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

### Disable During Operations

**CRITICAL: Always disable triggers during async operations.**

```tsx
// CORRECT - Button disabled while loading
import { Button } from "@/components/ui/button";

<Button
  disabled={mutation.isPending}
  onClick={() => mutation.mutate(data)}
>
  {mutation.isPending ? "Submitting..." : "Submit"}
</Button>

// WRONG - User can click multiple times
<Button onClick={() => mutation.mutate(data)}>
  Submit
</Button>
```

---

## Empty States

### Empty State Requirements

Every list/collection MUST have an empty state:

```tsx
// WRONG - No empty state
return data.map(item => <ItemCard key={item.id} item={item} />);

// CORRECT - Explicit empty state
return data.length > 0 ? (
  data.map(item => <ItemCard key={item.id} item={item} />)
) : (
  <EmptyState />
);
```

### Contextual Empty States (shadcn/ui)

```tsx
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Search with no results
const SearchEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <Search className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold">No results found</h3>
    <p className="text-sm text-muted-foreground">
      Try different search terms
    </p>
  </div>
);

// List with no items yet
const ListEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold">No items yet</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Create your first item to get started
    </p>
    <Button onClick={onCreate}>Create Item</Button>
  </div>
);
```

---

## Form Submission Pattern (React Hook Form + Zod)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const MyForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
      toast({ title: "Success!" });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.formState.isValid || mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};
```

---

## TanStack Query Patterns

### Query with All States

```tsx
import { useQuery } from '@tanstack/react-query';

const ItemList = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (isLoading && !data) return <Skeleton />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="grid gap-4">
      {data.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### Mutation with Toast Feedback

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";

const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "Success",
        description: "Item created successfully",
      });
    },
    onError: (error) => {
      console.error("createItem failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create item",
      });
    },
  });
};
```

---

## Anti-Patterns

### Loading States

```typescript
// WRONG - Spinner when data exists (causes flash)
if (isLoading) return <Spinner />;

// CORRECT - Only show loading without data
if (isLoading && !data) return <Spinner />;
```

### Error Handling

```typescript
// WRONG - Error swallowed
try {
  await mutation.mutateAsync();
} catch (e) {
  console.log(e); // User has no idea!
}

// CORRECT - Error surfaced
mutation.mutate(data, {
  onError: (error) => {
    console.error("operation failed:", error);
    toast({
      variant: "destructive",
      title: "Operation failed",
    });
  },
});
```

### Button States

```tsx
// WRONG - Button not disabled during submission
<Button onClick={submit}>Submit</Button>

// CORRECT - Disabled and shows loading
<Button disabled={isPending} onClick={submit}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

---

## Checklist

Before completing any UI component:

**UI States:**
- [ ] Error state handled and shown to user (shadcn Alert or Toast)
- [ ] Loading state shown only when no data exists (Skeleton or Spinner)
- [ ] Empty state provided for collections (custom with lucide icons)
- [ ] Buttons disabled during async operations
- [ ] Buttons show loading indicator when appropriate (Loader2 icon)

**Data & Mutations:**
- [ ] Mutations have onError handler
- [ ] All user actions have feedback (shadcn Toast)
- [ ] Query keys defined properly
- [ ] Cache invalidation on mutations

**Forms:**
- [ ] Zod schema defined for validation
- [ ] React Hook Form integrated
- [ ] Inline validation errors shown
- [ ] Submit button disabled when invalid

---

## Integration with Other Skills

- **testing-patterns**: Test all UI states (loading, error, empty, success)
- **systematic-debugging**: Use React Query DevTools for debugging
