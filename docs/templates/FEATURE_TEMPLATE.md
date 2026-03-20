# Feature: [Feature Name]

> Status meanings: Planning, In Progress, Review, Complete, or Archived.

**Status:** Planning
**Priority:** [Critical | High | Medium | Low]
**Estimated Effort:** [XS | S | M | L | XL]
**Assignee:** [Name]
**Started:** YYYY-MM-DD
**Target Completion:** YYYY-MM-DD

---

## Problem Statement

What problem are we solving? Why is it important?

[Describe the problem clearly]

---

## User Stories

### Story 1
**As a** [type of user]  
**I want** [goal]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Story 2 (if applicable)
...

---

## Technical Approach

### High-Level Design

How will this work architecturally?

[Describe the solution approach]

### Components Needed

- **Component 1**: Description and purpose
- **Component 2**: Description and purpose
- **Component 3**: Description and purpose

### API Integration

**Endpoints needed:**
- `POST /api/endpoint` - Purpose
- `GET /api/endpoint/:id` - Purpose

**Or direct AI API calls:**
- Claude API call for [purpose]

### State Management

**State needed:**
- Server state: [TanStack Query for ...]
- Client state: [Zustand for ...]
- Local state: [useState for ...]

**Queries:**
```typescript
useGetDataQuery()
```

**Mutations:**
```typescript
useCreateDataMutation()
```

### Data Model

```typescript
interface FeatureData {
  id: string;
  // Add fields
}

interface FeatureFormData {
  // Form fields
}
```

---

## UI/UX Design

### Mockup
[Link to Figma / v0.dev / Screenshot]

### Layout Description
- **Main view**: Description
- **Key interactions**: What user can do
- **Navigation**: How user gets here

### UI States to Handle

Following `.claude/skills/react-ui-patterns/`:

- [ ] **Loading state**: Only when no data exists
- [ ] **Error state**: Always surfaced to user with retry
- [ ] **Empty state**: For lists/collections
- [ ] **Success state**: Normal display with data
- [ ] **Form validation**: Inline errors
- [ ] **Button states**: Disabled during async operations

---

## Dependencies

### External Libraries
- [ ] Library name - version (reason)

### Internal Dependencies
- [ ] Feature X must be complete first
- [ ] Component Y needs to be refactored

### API Requirements
- [ ] Endpoint X must be created
- [ ] Database table Y must exist

### Documentation
- [ ] Update `training-context.md` with [new concepts]
- [ ] Update `ai-agent-context.md` with [new patterns]
- [ ] Update `SETUP.md`, `ARCHITECTURE.md`, `SUPABASE.md`, or `TESTING.md` if the feature changes those areas

---

## Risk Assessment

### Technical Risks

**Risk 1: [Description]**
- Likelihood: High | Medium | Low
- Impact: High | Medium | Low
- Mitigation: [How we'll handle it]

**Risk 2: [Description]**
- Likelihood: High | Medium | Low
- Impact: High | Medium | Low
- Mitigation: [How we'll handle it]

### UX Risks

**Risk 1: [Description]**
- Mitigation: [How we'll handle it]

---

## Success Metrics

How do we know this feature is successful?

- **Metric 1**: [e.g., Session generation < 10s]
- **Metric 2**: [e.g., Error rate < 5%]
- **Metric 3**: [e.g., User completes flow > 80%]

---

## Implementation Plan

### Phase 1: [Name]
- [ ] Task 1
- [ ] Task 2

### Phase 2: [Name]
- [ ] Task 1
- [ ] Task 2

### Phase 3: [Name]
- [ ] Task 1
- [ ] Task 2

---

## Open Questions

- [ ] Question 1: [What we need to decide]
- [ ] Question 2: [What needs clarification]

**Decision needed by:** YYYY-MM-DD

---

## References

### Related Documentation
- ADR: [Link to relevant ADR]
- Architecture: `docs/ARCHITECTURE.md`
- Domain: [Section in training-context.md]

### External Resources
- [Design inspiration](URL)
- [Technical reference](URL)
- [Research article](URL)

### Related Issues/PRs
- Issue #X
- PR #Y

---

## Development Log

### YYYY-MM-DD: [Update]
[What happened, decisions made, changes to plan]

### YYYY-MM-DD: [Update]
[Ongoing log of progress]

---

## Review Checklist

Before marking as "Complete":

**Functionality:**
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] Works in browser

**Code Quality:**
- [ ] Follows CONTRIBUTING.md standards
- [ ] `npm run build` passes
- [ ] No console.logs
- [ ] Proper error handling

**UI States (react-ui-patterns):**
- [ ] Loading state implemented correctly
- [ ] Error state shows to user
- [ ] Empty state for collections
- [ ] Buttons disabled during operations

**Documentation:**
- [ ] Code commented where complex
- [ ] ARCHITECTURE.md updated if needed
- [ ] Domain docs updated if needed
- [ ] ADR created if architectural decision

**Testing:**
- [ ] Manual testing complete
- [ ] No obvious bugs
- [ ] Performance acceptable

---

## Post-Launch

### Monitoring
- [ ] Error tracking set up (future)
- [ ] Analytics events defined (future)

### Follow-up Tasks
- [ ] Task to address in future iteration

---

**Last Updated:** YYYY-MM-DD
**Status:** [Planning | In Progress | Review | Complete | Archived]
