# Tasks: Coach Role Selection and Trainer Dashboard Scaffold

## Task Breakdown

### Task 1: Introduce authenticated app foundations
**Type:** Frontend
**Effort:** M
**Dependencies:** None

**Description:**
Introduce the minimum app shell needed for role-aware flows: routing, authenticated entry resolution, and a place for session/profile loading before the rest of the UI renders.

**Acceptance:**
- [ ] The app supports route-based navigation rather than a single hard-coded screen.
- [ ] Authenticated and unauthenticated entry states are distinguishable in the UI shell.
- [ ] There is a single place where initial session and profile resolution happens before redirects.

---

### Task 2: Implement the profile contract for role onboarding
**Type:** Data
**Effort:** M
**Dependencies:** Task 1

**Description:**
Create or confirm the minimal persistence contract needed to store an app role and onboarding completion for each authenticated user.

**Acceptance:**
- [ ] The profile record is keyed by authenticated user id.
- [ ] The profile record stores `role` and `onboardingCompletedAt`.
- [ ] Role completion is idempotent and does not create duplicate profile records.
- [ ] The implementation documents how profile reads and writes are secured.

---

### Task 3: Build the first-run role-selection flow
**Type:** Frontend
**Effort:** S
**Dependencies:** Task 2

**Description:**
Create the onboarding screen that captures whether the user is an athlete or coach, with clear copy and submit-state handling.

**Acceptance:**
- [ ] The screen presents only `athlete` and `coach` options.
- [ ] Continue is disabled until a role is selected.
- [ ] Submit shows a loading state and blocks duplicate submissions.
- [ ] Validation and error feedback are visible if persistence fails.

---

### Task 4: Persist role selection and redirect by role
**Type:** Frontend
**Effort:** S
**Dependencies:** Task 3

**Description:**
Wire the role-selection form into the profile mutation and redirect users into the correct post-onboarding route.

**Acceptance:**
- [ ] Successful submit stores the selected role and marks onboarding complete.
- [ ] Coach users are redirected to the trainer dashboard route.
- [ ] Athlete users are redirected to the agreed athlete entry route.
- [ ] Returning users with an existing role bypass the onboarding screen.

---

### Task 5: Create the trainer dashboard scaffold
**Type:** Frontend
**Effort:** M
**Dependencies:** Task 4

**Description:**
Build the coach-facing dashboard shell with a stable layout, summary row, and scaffold sections for future coach workflows.

**Acceptance:**
- [ ] The dashboard has a page header, orientation copy, and one primary CTA.
- [ ] The dashboard includes sections for roster, plans/sessions, and recent activity.
- [ ] Empty states explain what content will eventually appear in each section.
- [ ] Disabled or unavailable actions are labeled clearly.

---

### Task 6: Add dashboard data adapters and resilient UI states
**Type:** Frontend
**Effort:** M
**Dependencies:** Task 5

**Description:**
Connect the dashboard shell to a minimal summary query or placeholder adapter so the page can render loading, success, empty, and error states intentionally.

**Acceptance:**
- [ ] Summary cards render from a single typed data adapter.
- [ ] Loading, error, and empty states are all implemented explicitly.
- [ ] If no coach data exists yet, the dashboard still renders successfully with zero-state content.

---

### Task 7: Enforce role guards and regression-proof the flow
**Type:** Frontend
**Effort:** S
**Dependencies:** Task 6

**Description:**
Prevent cross-role leakage, verify fallback behavior, and add the minimum regression coverage or manual QA checklist for the new role-aware flow.

**Acceptance:**
- [ ] Athletes cannot access coach-only routes.
- [ ] Coaches do not get routed back into onboarding after completion.
- [ ] Manual QA or automated coverage exists for first-run onboarding, returning-user redirect, unauthorized route access, and dashboard empty states.

---

## Implementation Sequence

1. Complete Tasks 1 and 2 before any role-specific UI work.
2. Complete Tasks 3 and 4 as one implementation slice so onboarding and redirect logic land together.
3. Complete Tasks 5 and 6 together so the trainer dashboard never ships as a blank shell.
4. Finish with Task 7 before merging to avoid role leakage and navigation regressions.

## Notes

- This task plan assumes no separate ADR is required unless implementation reveals a cross-cutting auth or role-model decision that is hard to reverse.
- If the team decides to change the canonical role label from `coach`, update the data contract and copy constants before starting Task 3.

