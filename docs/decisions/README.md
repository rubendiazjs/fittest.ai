# Architecture Decision Records (ADRs)

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Why Use ADRs?

- **Preserve context**: Future developers understand *why* decisions were made
- **Avoid rehashing**: Prevent revisiting settled decisions
- **Knowledge sharing**: Onboarding is faster with documented rationale
- **Learning**: Review past decisions to improve future ones

## When to Create an ADR

Create an ADR when:
- Choosing between competing alternatives (e.g., Supabase vs Firebase)
- Making a decision that impacts multiple features or the whole system
- Adopting a new tool, library, or pattern
- Changing a significant part of the architecture
- Making a decision that's hard to reverse

**Don't create ADRs for**:
- Minor implementation details
- Obvious choices with no alternatives
- Temporary experiments
- Decisions local to a single component

## ADR Naming Convention

```
NNN-title-with-dashes.md
```

- `NNN`: Three-digit number (001, 002, 003, ...)
- `title-with-dashes`: Short, descriptive title
- Always use lowercase

**Examples**:
- `001-use-supabase-for-backend.md`
- `002-choose-tanstack-query-over-rtk-query.md`
- `003-implement-ai-session-generation.md`

## ADR Template

Use this template for all ADRs:

````markdown
# [NUMBER]. [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Deciders:** [Names of people involved in decision]
**Tags:** [Optional tags like: backend, frontend, ai, infrastructure]

## Context

What is the issue we're solving? What is the background?

- Include relevant facts and constraints
- Link to related issues or discussions
- Explain why this decision is needed now

## Decision

What are we going to do?

- Be specific and actionable
- State the chosen solution clearly
- Explain the key aspects of the implementation

## Consequences

### Positive
- What becomes easier or better?
- What problems does this solve?
- What opportunities does this create?

### Negative
- What becomes harder or more complex?
- What trade-offs are we making?
- What risks are we accepting?

### Neutral
- What changes but is neither clearly positive nor negative?

## Alternatives Considered

What other options did we evaluate?

### Alternative 1: [Name]
- **Pros**: 
- **Cons**: 
- **Why not chosen**: 

### Alternative 2: [Name]
- **Pros**: 
- **Cons**: 
- **Why not chosen**: 

## Implementation Notes

- Any specific implementation details
- Related PRs or commits
- Migration path if applicable
- Rollback strategy if needed

## References

- Links to discussions
- Relevant documentation
- Research or articles that informed the decision
````

## ADR Statuses

- **Proposed**: Decision is under consideration
- **Accepted**: Decision has been made and implemented
- **Deprecated**: Decision is no longer recommended but not actively harmful
- **Superseded**: Decision has been replaced (link to new ADR)

## ADR Workflow

### Creating a New ADR

1. **Create file**: Copy template to `docs/decisions/NNN-title.md`
2. **Write draft**: Fill out the template
3. **Get feedback**: Share with team (GitHub Discussion or PR)
4. **Update status**: Change from "Proposed" to "Accepted"
5. **Commit**: Add to repository with implementation

### Updating an ADR

ADRs are **immutable** once accepted. If a decision changes:
1. Create a **new ADR** with the updated decision
2. Mark old ADR as "Superseded by ADR-XXX"
3. Link new ADR to old one in "References" section

### Reviewing ADRs

- Review ADRs quarterly
- Mark outdated ones as "Deprecated"
- Create superseding ADRs when needed

## Example ADR

See `001-use-react-typescript-vite.md` for a complete example.

## Tips for Writing Good ADRs

### Do
✅ Be concise but complete
✅ Include enough context for future readers
✅ List real alternatives you considered
✅ Be honest about trade-offs
✅ Use simple, clear language
✅ Link to supporting resources

### Don't
❌ Write a novel (aim for < 500 words)
❌ Skip the "why" - it's the most important part
❌ List only one alternative (always consider at least 2-3)
❌ Hide negative consequences
❌ Use jargon without explanation
❌ Leave out the decision date

## Quick Decision Guide

Not sure if something needs an ADR? Use this flowchart:

```
Is this decision significant? → No → No ADR needed
         ↓ Yes
Does it affect multiple features? → No → Maybe use code comments
         ↓ Yes
Is it hard to reverse? → No → Consider ADR for documentation
         ↓ Yes
Are there alternatives? → No → Probably no real decision
         ↓ Yes
         → CREATE ADR
```

## Index of ADRs

| Number | Title | Status | Date |
|--------|-------|--------|------|
| 001 | [Use React, TypeScript, and Vite](./001-use-react-typescript-vite.md) | Accepted | 2026-01-10 |
| ... | ... | ... | ... |

*This index should be updated when new ADRs are added*

---

**Note**: This README itself is not an ADR, it's documentation about how to write ADRs.
