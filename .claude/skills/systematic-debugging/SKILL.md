---
name: systematic-debugging
description: Four-phase debugging methodology with root cause analysis for Vite + React apps. Use when investigating bugs, fixing test failures, or troubleshooting unexpected behavior. Emphasizes NO FIXES WITHOUT ROOT CAUSE FIRST.
---

# Systematic Debugging - Fittest.ai Stack

## Tech Stack Context

- **Build Tool**: Vite (fast HMR, ESM-based)
- **Framework**: React 18 with TypeScript
- **Data**: TanStack Query (React Query)
- **Backend**: Supabase (future)
- **State**: Zustand + TanStack Query

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

Never apply symptom-focused patches that mask underlying problems. Understand WHY something fails before attempting to fix it.

---

## The Four-Phase Framework

### Phase 1: Root Cause Investigation

Before touching any code:

1. **Read error messages thoroughly** - Every word matters
2. **Check browser console** - Look for React warnings, network errors, TypeScript errors
3. **Check Vite dev server output** - Build errors, HMR issues
4. **Reproduce the issue consistently** - If you can't reproduce it, you can't verify a fix
5. **Examine recent changes** - `git log` and `git diff` are your friends
6. **Gather diagnostic evidence** - Network tab, React DevTools, TanStack Query DevTools
7. **Trace data flow** - Follow the call chain to find where bad values originate

**Root Cause Tracing Technique:**

```
1. Observe the symptom - Where does the error manifest?
2. Find immediate cause - Which code directly produces the error?
3. Ask "What called this?" - Map the call chain upward
4. Keep tracing up - Follow invalid data backward through the stack
5. Find original trigger - Where did the problem actually start?
```

**Key principle:** Never fix problems solely where errors appear—always trace to the original trigger.

---

### Phase 2: Pattern Analysis

1. **Locate working examples** - Find similar code that works correctly
2. **Compare implementations completely** - Don't just skim
3. **Identify differences** - What's different between working and broken?
4. **Understand dependencies** - What does this code depend on?

**Common Vite/React debugging spots:**
- Check `vite.config.ts` for path aliases, plugins
- Verify `tsconfig.json` paths match Vite config
- Check TanStack Query cache in DevTools
- Verify component re-render behavior in React DevTools
- Check Network tab for failed API calls

---

### Phase 3: Hypothesis and Testing

Apply the scientific method:

1. **Formulate ONE clear hypothesis** - "The error occurs because X"
2. **Design minimal test** - Change ONE variable at a time
3. **Predict the outcome** - What should happen if hypothesis is correct?
4. **Run the test** - Execute and observe
5. **Verify results** - Did it behave as predicted?
6. **Iterate or proceed** - Refine hypothesis if wrong, implement if right

**Vite-specific testing:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev

# Build + type check
npm run build

# Build to catch build-only errors
npm run build
```

---

### Phase 4: Implementation

1. **Create failing test case** - Captures the bug behavior (when we add tests)
2. **Implement single fix** - Address root cause, not symptoms
3. **Verify fix works** - Confirms fix works
4. **Run build** - `npm run build` - Ensure TypeScript and production build pass
5. **Run linting** - `npm run lint` - Ensure code quality
6. **If fix fails, STOP** - Re-evaluate hypothesis

**Critical rule:** If THREE or more fixes fail consecutively, STOP. This signals architectural problems requiring discussion, not more patches.

---

## Red Flags - Process Violations

Stop immediately if you catch yourself thinking:

- "Quick fix for now, investigate later"
- "One more fix attempt" (after multiple failures)
- "This should work" (without understanding why)
- "Let me just try..." (without hypothesis)
- "It works on my machine" (without investigating difference)
- "I'll just add `any`" (TypeScript escape hatch)
- "I'll disable this lint rule" (code quality escape hatch)

---

## Warning Signs of Deeper Problems

**Consecutive fixes revealing new problems in different areas** indicates architectural issues:

- Stop patching
- Document what you've found
- Discuss with team before proceeding
- Consider if the design needs rethinking
- Create ADR if architectural change needed

---

## Common Debugging Scenarios

### TypeScript Errors

```
1. Read the FULL error message - TypeScript is usually right
2. Check if types are properly imported
3. Verify path aliases in tsconfig.json match vite.config.ts
4. Check for circular dependencies
5. Use TypeScript server restart in IDE if types seem stale
```

**Common issues:**
- `Cannot find module '@/...'` → Check tsconfig paths
- `Property 'X' does not exist` → Check type definitions
- `Type 'X' is not assignable to type 'Y'` → Understand the difference

### Runtime Errors

```
1. Check browser console for full stack trace
2. Identify the line that throws
3. Check React DevTools for component state
4. Check TanStack Query DevTools for data state
5. Trace backward to find where bad value originated
6. Add validation at the source
```

**Common issues:**
- `Cannot read property 'X' of undefined` → Add null checks
- `Maximum update depth exceeded` → Check useEffect dependencies
- `Objects are not valid as a React child` → Check JSX render

### TanStack Query Issues

```
1. Open TanStack Query DevTools
2. Check query state (loading, error, data)
3. Verify query key is unique and correct
4. Check staleTime and cacheTime settings
5. Verify mutate/invalidate calls
```

**Common issues:**
- Query not refetching → Check staleTime
- Stale data shown → Check cache invalidation
- Multiple requests → Check query key stability

### Vite/HMR Issues

```
1. Check Vite dev server output for errors
2. Clear Vite cache: rm -rf node_modules/.vite
3. Restart dev server
4. Check vite.config.ts for plugin conflicts
5. Verify imports use correct extensions
```

**Common issues:**
- HMR not working → Full page refresh needed
- Module not found → Check import paths
- Build works but dev fails → Check dev-specific config

### "It worked before"

```
1. Use git bisect to find the breaking commit
   git bisect start
   git bisect bad HEAD
   git bisect good <last-known-good-commit>
2. Compare the change with previous working version
3. Identify what assumption changed
4. Fix at the source of the assumption violation
```

### Intermittent Failures

```
1. Look for race conditions in useEffect
2. Check for shared mutable state
3. Examine async operation ordering
4. Look for timing dependencies in TanStack Query
5. Add deterministic waits or proper synchronization
```

---

## Debugging Tools

### Browser DevTools
- **Console**: Errors, warnings, logs
- **Network**: Failed requests, slow requests
- **React DevTools**: Component tree, props, state
- **TanStack Query DevTools**: Query state, mutations, cache

### Command Line
```bash
# Build + type checking
npm run build

# Linting
npm run lint

# Build (catches build-only issues)
npm run build

# Clear caches
rm -rf node_modules/.vite
rm -rf dist
```

### IDE Features
- TypeScript server restart
- Go to definition
- Find all references
- Inline error messages

---

## Debugging Checklist

Before claiming a bug is fixed:

- [ ] Root cause identified and documented
- [ ] Hypothesis formed and tested
- [ ] Fix addresses root cause, not symptoms
- [ ] Build passes: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors in browser
- [ ] No "quick fix" rationalization used
- [ ] Fix is minimal and focused
- [ ] Consider if ADR needed for architectural change

---

## Success Metrics

Systematic debugging achieves ~95% first-time fix rate vs ~40% with ad-hoc approaches.

Signs you're doing it right:

- Fixes don't create new bugs
- You can explain WHY the bug occurred
- Similar bugs don't recur
- Code is better after the fix, not just "working"
- TypeScript catches the class of bugs at compile time

---

## Integration with Other Skills

- **react-ui-patterns**: Debug loading/error state issues
- **testing-patterns**: Create test that reproduces the bug before fixing (when we add tests)
