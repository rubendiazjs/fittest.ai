---
description: Review a feature for completion readiness
allowed-tools: Read, Glob, Grep, Bash(npm:*)
---

# Review Feature

Review feature for completion: $ARGUMENTS

## Instructions

1. **Locate feature**:

   - Find `docs/features/[feature-name]/FEATURE.md`
   - Find `src/features/[feature-name]/`

2. **Check FEATURE.md status**:

   - Current status should be "Review"
   - If "Planning" or "In Progress" → Stop and ask user to update

3. **Verify acceptance criteria**:

   ```
   Read FEATURE.md and check:
   - Are all acceptance criteria checkboxes marked?
   - If not → List incomplete criteria
   ```

4. **Run automated checks**:

   ```bash
   # Build + type checking
   npm run build
   
   # Linting
   npm run lint -- src/features/[feature-name]
   ```

5. **Review code quality** (using code-quality.md checklist):

   In `src/features/[feature-name]/`:
   
   **TypeScript:**
   - [ ] No `any` types
   - [ ] Interfaces defined for all props
   - [ ] Proper type exports in types/
   
   **React Patterns** (from .claude/skills/react-ui-patterns/):
   - [ ] Loading states only when no data
   - [ ] Error states always surfaced to user
   - [ ] Empty states for lists/collections
   - [ ] Buttons disabled during async operations
   - [ ] All mutations have onError handlers
   
   **Code Structure:**
   - [ ] Components under 200 lines
   - [ ] Complex logic in custom hooks
   - [ ] Proper file organization
   - [ ] index.ts exports public API

6. **Check documentation sync** (using doc-sync.md):

   - [ ] FEATURE.md reflects final implementation
   - [ ] Inline code comments for complex logic
   - [ ] ADR created if architectural decision made
   - [ ] ARCHITECTURE.md updated if structure changed
   - [ ] training-context.md updated if domain knowledge added
   - [ ] ai-agent-context.md updated if new patterns introduced

7. **Manual functionality check**:

   Ask user to confirm:
   - [ ] Feature works in browser
   - [ ] All user stories completable
   - [ ] Edge cases handled
   - [ ] No console errors
   - [ ] Performance acceptable

8. **Generate review report**:

   ```markdown
   # Feature Review: [Feature Name]
   
   ## Status: [Pass | Needs Work]
   
   ### Automated Checks
   - TypeScript: [✓ | ✗]
   - Linting: [✓ | ✗]
   
   ### Code Quality
   [List issues or ✓ All good]
   
   ### UI State Handling
   [List issues or ✓ All states handled correctly]
   
   ### Documentation
   [List issues or ✓ Docs synced]
   
   ### Blockers (if any)
   - Blocker 1: [Description and suggested fix]
   - Blocker 2: [Description and suggested fix]
   
   ### Recommendations
   - Suggestion 1: [Optional improvement]
   
   ### Next Steps
   [If Pass]:
   - Update FEATURE.md status to "Complete"
   - Create PR
   - Link FEATURE.md in PR description
   
   [If Needs Work]:
   - Address blockers listed above
   - Re-run review when ready
   ```

9. **Update FEATURE.md** (if passing):

   - Change Status to "Complete"
   - Add completion date to Development Log
   - Update "Last Updated" date

## Review Levels

### Quick Review (default)
- Automated checks only
- Basic code quality scan
- Documentation sync check

### Full Review
- Everything from Quick Review
- Manual code inspection
- Security considerations
- Performance review
- Accessibility check

Ask user which level they want.

## Output

Provide clear:
- ✅ Pass/Fail decision
- 📋 List of issues (if any)
- 🎯 Next steps
- 📝 Review summary for PR
