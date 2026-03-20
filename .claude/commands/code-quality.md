---
description: Run code quality checks on a directory for our Vite + React + TypeScript stack
allowed-tools: Read, Glob, Grep, Bash(npm:*), Bash(npx:*)
---

# Code Quality Review

Review code quality in: $ARGUMENTS

## Instructions

1. **Identify files to review**:

   - Find all `.ts` and `.tsx` files in the directory
   - Exclude `node_modules`, `dist`, `.vite`, and test files

2. **Run automated checks**:

   ```bash
   # Build + TypeScript compilation check
   npm run build

   # Linting
   npm run lint -- $ARGUMENTS
   ```

3. **Manual review checklist** (from react-ui-patterns):

   **TypeScript:**
   - [ ] No `any` types (use `unknown` if truly unknown)
   - [ ] Interfaces defined for all props
   - [ ] Proper type exports from feature types/
   
   **React Patterns:**
   - [ ] Loading states only shown when no data exists
   - [ ] Error states always surfaced to user (Toast or Alert)
   - [ ] Empty states for all collections/lists
   - [ ] Buttons disabled during async operations
   - [ ] Loading indicators shown during mutations
   
   **TanStack Query:**
   - [ ] Query keys use key factory pattern
   - [ ] All mutations have onError handler
   - [ ] Cache invalidation after mutations
   - [ ] Custom hooks wrap queries/mutations
   
   **Forms (if applicable):**
   - [ ] Zod schema for validation
   - [ ] React Hook Form integrated
   - [ ] Inline validation errors
   - [ ] Submit button disabled when invalid
   
   **shadcn/ui:**
   - [ ] Using shadcn components where appropriate
   - [ ] Tailwind classes for styling (no custom CSS)
   - [ ] Lucide React icons used
   - [ ] Proper component composition

4. **Report findings** organized by severity:

   **Critical (must fix before merge):**
   - Missing error handlers on mutations
   - `any` types in public APIs
   - Buttons not disabled during async ops
   - TypeScript errors
   
   **Warning (should fix):**
   - Missing loading states
   - No empty states for lists
   - Complex components (>200 lines)
   - Unclear query keys
   
   **Suggestion (could improve):**
   - Could extract custom hooks
   - Could use shadcn component
   - Could improve naming
   - Could add comments for complex logic

5. **Check common anti-patterns**:

   ```typescript
   // Anti-pattern: Loading check without data check
   if (isLoading) return <Spinner />
   
   // Anti-pattern: No error handling
   const mutation = useMutation({ mutationFn: save })
   
   // Anti-pattern: Inline query without custom hook
   const { data } = useQuery({ queryKey: ['items'], ... })
   
   // Anti-pattern: No query key factory
   queryKey: ['sessions', id]
   ```

6. **Output summary**:

   ```markdown
   # Code Quality Report: [Directory]
   
   ## Summary
   - Files reviewed: X
   - Critical issues: X
   - Warnings: X
   - Suggestions: X
   
   ## TypeScript Check
   [✓ | ✗] Passes build
   
   ## Linting
   [✓ | ✗] Passes lint
   
   ## Critical Issues
   [List or "None found"]
   
   ## Warnings
   [List or "None found"]
   
   ## Suggestions
   [List or "None found"]
   
   ## Next Steps
   [If issues found, list what needs to be fixed]
   [If clean, congratulate and approve]
   ```

---

## Quick Checks

For faster review, focus on these files first:
- Components with mutations (highest risk)
- New features (most likely to have issues)
- Forms (complex validation logic)
