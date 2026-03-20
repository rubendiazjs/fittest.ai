# Feature Development Workflow

This file defines the process for feature planning and delivery. It is a process guide, not implementation truth.

## Files And Locations

- Feature specs live in `docs/features/[feature-name]/FEATURE.md`
- Optional task breakdowns live in `docs/features/[feature-name]/TASKS.md`
- The reusable feature template lives in `docs/templates/FEATURE_TEMPLATE.md`
- Architecture decisions live in `docs/decisions/`

## Workflow

1. Define the feature in `docs/features/[feature-name]/FEATURE.md`
2. Break it into tasks if the work is larger than a small change
3. Implement in `src/features/[feature-name]/` when that structure fits
4. Update implementation-facing docs when setup, runtime flow, testing, or Supabase behavior changes
5. Review the feature against its acceptance criteria before merging

## Planning Guidance

- Write the user problem before writing the solution.
- Keep acceptance criteria concrete and testable.
- Use ADRs for architectural decisions that will affect later work.
- Keep planning docs honest about what is implemented vs proposed.

## Implementation Guidance

- Follow [../CONTRIBUTING.md](../CONTRIBUTING.md).
- Use [../ARCHITECTURE.md](../ARCHITECTURE.md) for the current app shape.
- Use [../SUPABASE.md](../SUPABASE.md) and [../TESTING.md](../TESTING.md) when a feature changes those areas.
- Update `FEATURE.md` status as the work moves from planning to implementation to review.

## Verification Guidance

Use the checks that match the change:

```bash
npm run lint
npm run build
npm run test:e2e
```

If you skip a check, note that in the feature log or PR summary.

## Quick Start

```bash
mkdir -p docs/features/[feature-name]
cp docs/templates/FEATURE_TEMPLATE.md docs/features/[feature-name]/FEATURE.md
mkdir -p src/features/[feature-name]/{components,hooks,api,types}
```
