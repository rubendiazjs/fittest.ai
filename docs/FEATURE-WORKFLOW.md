# Feature Development Workflow

## Purpose

This document defines the workflow for developing new features in Fittest.ai, integrating with our `.claude` commands and agentic development approach.

---

## Workflow Overview

```
1. Define Feature → 2. Plan Implementation → 3. Build → 4. Review → 5. Ship
      ↓                     ↓                   ↓          ↓          ↓
   FEATURE.md          Task breakdown      Code + Docs   Quality    Merge
                       + ADR if needed                   Check
```

---

## Phase 1: Define Feature

### Create Feature Definition

**Location**: `docs/features/[feature-name]/FEATURE.md`

**Use the template below** to define the feature completely before coding.

### Feature Definition Template

```markdown
# Feature: [Feature Name]

**Status:** Planning | In Progress | Review | Complete
**Priority:** Critical | High | Medium | Low
**Estimated Effort:** XS | S | M | L | XL
**Assignee:** [Name]
**Started:** YYYY-MM-DD
**Target Completion:** YYYY-MM-DD

## Problem Statement

What problem are we solving? Why is it important?

## User Stories

As a [type of user], I want [goal], so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Approach

### High-Level Design
How will this work architecturally?

### Components Needed
- Component 1: Description
- Component 2: Description

### API Changes
- Endpoint 1: Purpose
- Endpoint 2: Purpose

### State Management
- What state is needed?
- Where does it live? (TanStack Query, Zustand, local)

### Data Model
```typescript
interface FeatureData {
  // Define types
}
```

## UI/UX Mockup

[Link to Figma / Sketch / Screenshot]

Or text description:
- Layout: ...
- Key interactions: ...
- States to handle: Loading, Error, Empty, Success

## Dependencies

- External libraries needed
- Other features that must be complete first
- API endpoints required

## Risk Assessment

### Technical Risks
- Risk 1: Description and mitigation
- Risk 2: Description and mitigation

### UX Risks
- Risk 1: Description and mitigation

## Success Metrics

How do we know this feature is successful?
- Metric 1: Target value
- Metric 2: Target value

## Open Questions

- [ ] Question 1
- [ ] Question 2

## References

- Related ADRs
- Design documents
- Research links
```

---

## Phase 2: Plan Implementation

### Create Task Breakdown

Once feature is defined, break it into tasks:

**Location**: `docs/features/[feature-name]/TASKS.md`

**Template**:

```markdown
# Tasks: [Feature Name]

## Task Breakdown

### Task 1: [Name]
**Type:** Frontend | Backend | Data | Docs
**Effort:** XS | S | M | L
**Dependencies:** None | Task X

**Description:**
What needs to be done

**Acceptance:**
- [ ] Criterion 1
- [ ] Criterion 2

---

### Task 2: [Name]
...
```

### Create ADR if Needed

If feature involves significant architectural decision:
- Create ADR in `docs/decisions/`
- Follow ADR template
- Link from FEATURE.md

### AI Agent Onboarding

Before starting implementation, use `.claude/commands/onboard.md`:

```bash
# In Claude Desktop or Cursor
Run: onboard "Feature: [feature-name] - Review docs/features/[feature-name]/FEATURE.md"
```

This creates `.claude/tasks/[feature-name]/onboarding.md` with AI's understanding.

---

## Phase 3: Build

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/[feature-name]
   ```

2. **Follow feature-based structure**
   ```
   src/features/[feature-name]/
   ├── components/
   ├── hooks/
   ├── api/
   ├── types/
   └── index.ts
   ```

3. **Use AI assistance**
   - Reference `docs/ai-agent-context.md`
   - Reference `docs/training-context.md` for domain logic
   - Use `.claude/skills/react-ui-patterns/` for UI patterns

4. **Implement with quality**
   - Follow `docs/CONTRIBUTING.md` standards
   - Check `.claude/skills/react-ui-patterns/skill.md` for UI states
   - Handle: Loading, Error, Empty, Success states

5. **Update documentation**
   - Update FEATURE.md status
   - Update TASKS.md checklist
   - Add comments in code
   - Update ARCHITECTURE.md if structure changed

---

## Phase 4: Review

### Self-Review Checklist

Before requesting review:

**Code Quality:**
- [ ] Run `.claude/commands/code-quality.md` on feature directory
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] No console.logs or debugging code

**UI States (from react-ui-patterns):**
- [ ] Loading state (only when no data)
- [ ] Error state (always shown to user)
- [ ] Empty state (for lists/collections)
- [ ] Success state
- [ ] Buttons disabled during async ops

**Documentation:**
- [ ] Run `.claude/commands/doc-sync.md`
- [ ] FEATURE.md updated with final approach
- [ ] Inline code comments for complex logic
- [ ] ADR created if architectural decision made

**Functionality:**
- [ ] Feature works in browser
- [ ] All acceptance criteria met
- [ ] No obvious bugs
- [ ] Edge cases handled

### Request Review

1. **Update PR template** (from CONTRIBUTING.md)
2. **Link to FEATURE.md** in PR description
3. **Mark FEATURE.md status** as "Review"

---

## Phase 5: Ship

### Pre-Merge Checklist

- [ ] PR approved
- [ ] All tasks in TASKS.md completed
- [ ] FEATURE.md status updated to "Complete"
- [ ] Documentation synced

### Post-Merge

1. **Update README** if user-facing feature
2. **Create release notes** entry
3. **Mark feature complete** in project board
4. **Archive feature definition** (keep for reference)

---

## Feature Sizing Guide

**XS (< 2 hours)**
- Simple UI component
- Copy change
- Minor styling adjustment

**S (2-4 hours)**
- New page with existing components
- API integration with existing patterns
- Form with basic validation

**M (1-2 days)**
- Complex component with state
- New API endpoint + frontend
- Multi-step form

**L (3-5 days)**
- Multiple interconnected components
- Complex state management
- New data models

**XL (1+ week)**
- Major feature with multiple screens
- Significant architectural change
- Multiple integrations

**Rule**: If > XL, break into smaller features.

---

## Feature Priority Matrix

| Priority | Description | Examples |
|----------|-------------|----------|
| Critical | Blocks other work or users | Auth broken, data loss bug |
| High | Important, time-sensitive | Core feature for MVP |
| Medium | Valuable but not urgent | Enhancement, nice-to-have |
| Low | Future consideration | Experimental, long-term |

---

## Integration with Existing Docs

### Links to Other Documentation

- **Architecture decisions** → Create ADR in `docs/decisions/`
- **Setup changes** → Update `docs/SETUP.md`
- **Architecture changes** → Update `docs/ARCHITECTURE.md`
- **Domain knowledge** → Update `docs/training-context.md`
- **AI prompting** → Update `docs/ai-agent-context.md`

### Use .claude Commands

During feature development, use:

**Before coding**:
- `onboard.md` - Get AI up to speed on feature

**During coding**:
- Reference `.claude/skills/react-ui-patterns/` for UI patterns
- Reference `.claude/skills/systematic-debugging/` if issues

**Before PR**:
- `code-quality.md` - Quality check
- `doc-sync.md` - Verify docs match code

---

## Example: Session Generator Feature

See `docs/features/session-generator/` for complete example:
- `FEATURE.md` - Feature definition
- `TASKS.md` - Task breakdown
- Implementation in `src/features/session-generator/`

---

## Anti-Patterns to Avoid

❌ **Starting to code before defining the feature**
✅ Write FEATURE.md first, get clarity

❌ **Skipping UI state handling**
✅ Follow react-ui-patterns for all states

❌ **Not documenting architectural decisions**
✅ Create ADR when making significant choices

❌ **Building too much at once**
✅ Break large features into smaller ones

❌ **Forgetting to update FEATURE.md status**
✅ Keep status current (Planning → In Progress → Review → Complete)

---

## Quick Start for New Feature

```bash
# 1. Create feature directory
mkdir -p docs/features/[feature-name]

# 2. Copy feature template
cp docs/FEATURE_TEMPLATE.md docs/features/[feature-name]/FEATURE.md

# 3. Fill out FEATURE.md

# 4. Onboard AI agent (optional but recommended)
# Run in Claude: onboard "Feature: [feature-name]"

# 5. Create feature branch
git checkout -b feature/[feature-name]

# 6. Create feature structure
mkdir -p src/features/[feature-name]/{components,hooks,api,types}

# 7. Start building!
```

---

## Metrics to Track (Future)

- Average time from Define → Ship
- Features completed per sprint
- Quality issues found in review
- Documentation sync percentage

---

## Version History

- **v1.0** (January 2026): Initial workflow definition
- Future: Will evolve based on team feedback

---

**This workflow ensures**:
- Clear feature definition before coding
- Proper planning and task breakdown  
- Quality standards met
- Documentation stays current
- AI agents have context they need
