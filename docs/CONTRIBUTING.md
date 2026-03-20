# Contributing to Fittest.ai

This repo is developed as a real product and a learning project. Keep contributions small, concrete, and aligned with the code that exists today.

## Before You Start

- Read [SETUP.md](./SETUP.md) for local setup.
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for the current app flow.
- Read [TESTING.md](./TESTING.md) if your change affects verification or E2E tests.
- Treat `docs/planning/` as planning material, not implementation truth.

## Development Workflow

1. Create a short, descriptive branch name.
2. Keep the change focused on one problem.
3. Update docs in the same change when behavior, setup, or architecture changes.
4. Prefer documenting what is implemented, not aspirational designs.

## Quality Checks

Run the checks that fit your change:

```bash
npm run lint
npm run build
npm run test:e2e
```

If you do not run one of these, say so in your summary.

## Coding Expectations

- Use TypeScript for new code.
- Avoid `any` unless there is a real boundary that cannot be typed yet.
- Keep feature logic inside the relevant `src/features/*` module when possible.
- Use the existing UI primitives and Tailwind conventions before adding new patterns.
- Surface async loading and error states in the UI.

## Documentation Expectations

Update docs when you change:

- local setup or environment requirements
- runtime architecture or data flow
- Supabase integration details
- test commands or test setup

Relevant docs:

- [SETUP.md](./SETUP.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SUPABASE.md](./SUPABASE.md)
- [TESTING.md](./TESTING.md)

## Planning And Templates

- Feature workflow guidance lives in [process/FEATURE-WORKFLOW.md](./process/FEATURE-WORKFLOW.md).
- Feature templates live in [templates/FEATURE_TEMPLATE.md](./templates/FEATURE_TEMPLATE.md).
- Product and documentation planning lives in `docs/planning/`.

## Pull Requests

In the PR summary, include:

- what changed
- how you verified it
- which checks you did not run
- any doc updates made alongside the code
