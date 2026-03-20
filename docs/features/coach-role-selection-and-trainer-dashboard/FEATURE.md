# Feature: Coach Role Selection and Trainer Dashboard Scaffold

**Status:** Planning
**Priority:** High
**Estimated Effort:** L
**Assignee:** Unassigned
**Started:** 2026-03-19
**Target Completion:** 2026-04-09

---

## Problem Statement

The repo has a documented direction toward auth, roles, coach collaboration, and a trainer dashboard, but the current app is still a single-page MVP shell with no role-aware entry flow. Without a defined first step for how an authenticated user becomes a coach and where that coach lands, the upcoming auth, routing, schema, and dashboard work will fragment across ad hoc implementation decisions.

This feature defines the first executable slice of that roadmap:
- capture a user's role during account setup
- persist that role in the app profile record
- route coach users into a trainer-facing dashboard shell
- keep athlete users unblocked while coach workflows are built out incrementally

This is the best next step because it establishes the app boundary between generic authentication and coach-specific workflows without requiring the full client-management product to exist yet.

---

## User Stories

### Story 1
**As a** newly authenticated user  
**I want** to choose whether I am using the app as an athlete or a coach  
**So that** the product can route me into the correct experience from my first session

**Acceptance Criteria:**
- [ ] Any authenticated user without a stored role is redirected to a dedicated role-selection screen before entering the rest of the app.
- [ ] The role-selection screen presents exactly two options in v1: `athlete` and `coach`.
- [ ] The primary action remains disabled until a role is selected.
- [ ] Submitting the form persists the selected role and marks onboarding as complete.
- [ ] The flow is resumable: refreshing the page during the role-selection step does not create duplicate profile records.

### Story 2
**As a** coach  
**I want** to land on a trainer dashboard shell after onboarding  
**So that** I have a clear starting point for future coach workflows

**Acceptance Criteria:**
- [ ] A user with role `coach` bypasses the role-selection screen on later visits.
- [ ] After successful role selection, a coach is redirected to the trainer dashboard route.
- [ ] The trainer dashboard includes a page title, short orientation copy, at least one primary CTA, summary cards, and scaffold sections for roster, plans/sessions, and recent activity.
- [ ] Each scaffold section has explicit empty, loading, and error states.
- [ ] Any non-functional actions are labeled as disabled or "coming soon" rather than failing silently.

### Story 3
**As an** athlete  
**I want** role selection to complete without waiting for coach features  
**So that** the coach-first work does not block my current product path

**Acceptance Criteria:**
- [ ] A user with role `athlete` is redirected away from coach-only routes.
- [ ] Athlete role completion redirects to the current primary app entry point rather than the trainer dashboard.
- [ ] Direct navigation to the trainer dashboard by an athlete shows a guarded unauthorized state or redirects safely.

---

## Technical Approach

### High-Level Design

This feature should be implemented as the first role-aware authenticated flow in the app:

1. Add an authenticated app shell with routing.
2. Resolve the signed-in user's profile record on app load.
3. If no role is stored, redirect to role selection.
4. Persist the selected role to the profile record.
5. Redirect by role:
   - `coach` -> trainer dashboard scaffold
   - `athlete` -> current athlete/MVP entry route
6. Guard coach-only routes based on the persisted role.

This follows the repo's documented future architecture:
- auth provider/context
- direct client integration first
- feature-based frontend organization
- TanStack Query for server state once introduced

### Components Needed

- **App Shell / Router**: Introduces route-based app entry points instead of the current single-screen shell.
- **Auth Session Provider**: Exposes authenticated user and session state to the app.
- **Profile Resolver**: Loads the current user's profile and determines whether onboarding is complete.
- **Role Selection Page**: First-run screen for choosing `athlete` or `coach`.
- **Role Completion Mutation**: Persists the role and onboarding completion timestamp.
- **Role Guard**: Redirects users away from routes that do not match their role.
- **Trainer Dashboard Page**: Coach-facing dashboard shell with scaffolded sections and clear empty states.
- **Dashboard Summary Adapter**: Fetches or derives the minimal counts/cards shown on the trainer dashboard.

### API Integration

Assume the app follows the documented Supabase direction for auth and persistence.

**Required integrations:**
- Auth session lookup for the current user
- Profile read by authenticated user id
- Profile upsert on first-run onboarding completion
- Dashboard summary query for coach-facing counts

**Suggested direct-client operations:**
- `getCurrentSession()` -> returns auth user/session
- `getCurrentProfile(userId)` -> returns stored app role and onboarding metadata
- `completeRoleSelection({ userId, role })` -> upserts role and onboarding completion
- `getTrainerDashboardSummary(userId)` -> returns dashboard counts and recent activity placeholders

### State Management

**Server state:**
- Authenticated profile
- Trainer dashboard summary
- Coach route authorization status

**Client state:**
- Local selected role before submit
- Redirect/loading UI state during onboarding

**Recommended ownership:**
- TanStack Query for profile and dashboard data
- Local component state for the selection form
- Minimal provider/context for auth session only

### Data Model

```typescript
type AppRole = "athlete" | "coach";

interface UserProfile {
  userId: string;
  role: AppRole | null;
  displayName: string | null;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrainerDashboardSummary {
  athleteCount: number;
  activePlanCount: number;
  recentSessionCount: number;
  pendingInviteCount: number;
}

interface TrainerDashboardActivityItem {
  id: string;
  type: "session_created" | "athlete_joined" | "plan_updated";
  title: string;
  occurredAt: string;
}
```

**Contract notes:**
- `role` must be nullable only until first-run onboarding is complete.
- `coach` should be the canonical stored enum value for the role.
- "Trainer dashboard" is treated as the coach-facing workspace label for this feature.
- If coach workflow tables do not exist yet, the summary query may return zeros plus empty activity lists in v1.

---

## UI/UX Design

### Layout Description

**Role selection**
- A centered onboarding card or split layout shown immediately after authentication.
- Two role choices with short explanatory copy:
  - `Athlete`: generate and manage personal training sessions
  - `Coach`: manage athletes and coach-facing workflows
- One clear continuation action and a visible loading state on submit.

**Trainer dashboard**
- Header with welcome copy and one primary CTA.
- Summary row with key coach metrics.
- Three scaffold sections:
  - Athlete roster
  - Plans / sessions
  - Recent activity
- Empty states that explain what will populate each section later.

### UI States to Handle

- [ ] **Loading state**: While auth/profile resolution is in progress and while dashboard data loads
- [ ] **Error state**: Profile read/write failure and dashboard fetch failure are surfaced clearly
- [ ] **Empty state**: Dashboard sections explain the absence of athletes, plans, or activity
- [ ] **Success state**: Redirect completes and the correct landing page renders
- [ ] **Form validation**: Role must be selected before submit
- [ ] **Button states**: Submit is disabled while mutation is in flight

---

## Dependencies

### External Libraries
- [ ] Auth client and session tooling consistent with the planned Supabase integration
- [ ] Routing library for protected and role-aware routes
- [ ] TanStack Query if the implementation follows the documented architecture rather than local-only state

### Internal Dependencies
- [ ] Authenticated user identity must be available before role resolution can occur
- [ ] A profile persistence layer must exist or be introduced in the same implementation slice
- [ ] A stable primary athlete entry route must be identified for post-onboarding redirects

### API Requirements
- [ ] Profile table or equivalent store keyed by auth user id
- [ ] Role field stored in the user profile record
- [ ] Onboarding completion timestamp or boolean
- [ ] Minimal coach dashboard summary source, even if initially scaffolded with zero-state data

### Documentation Assumptions
- [ ] `docs/planning/AUTH_INTEGRATION.md` is planning material, so this feature spec still needs to define its current implementation slice clearly.
- [ ] `docs/planning/ROADMAP.md` and `docs/planning/DOCUMENTATION-ROADMAP.md` are planning material, not implementation truth.
- [ ] `docs/decisions/002-trainer-database-schema.md` should be reconciled before any schema work starts.

---

## Risk Assessment

### Technical Risks

**Risk 1: Auth and profile persistence are under-specified in the current repo**
- Likelihood: High
- Impact: High
- Mitigation: Implement the profile contract first and treat role onboarding as the forcing function for the minimum viable auth/data layer.

**Risk 2: Coach metrics may depend on tables that do not exist yet**
- Likelihood: High
- Impact: Medium
- Mitigation: Define the dashboard as a scaffold feature; allow zero-value summary cards and explicit empty states until coach workflow entities are built.

**Risk 3: The current app has no routing or query infrastructure**
- Likelihood: High
- Impact: Medium
- Mitigation: Make routing, auth session plumbing, and server-state setup part of this feature's first phase instead of bolting them on later.

### UX Risks

**Risk 1: "Coach" and "trainer" terminology may confuse users and developers**
- Mitigation: Store `coach` as the role enum, centralize copy, and confirm the final user-facing label before implementation starts.

**Risk 2: A scaffold dashboard can feel unfinished**
- Mitigation: Use explicit orientation copy and "coming soon" messaging so the screen reads as an intentional starting workspace, not a broken page.

---

## Success Metrics

- **Onboarding completion**: 100% of authenticated users with no role are routed through role selection before accessing protected app routes.
- **Role redirect accuracy**: Coach users always land on the trainer dashboard; athlete users never do.
- **Implementation readiness**: The feature can be broken into concrete implementation tasks without needing another planning pass for route behavior, profile shape, or dashboard scope.

---

## Implementation Plan

### Phase 1: Foundations
- [ ] Add routing, auth session plumbing, and profile-loading entry logic
- [ ] Define or create the minimum viable profile contract

### Phase 2: Role Capture
- [ ] Build the role-selection screen
- [ ] Persist role and onboarding completion
- [ ] Add redirect-by-role behavior

### Phase 3: Coach Landing Experience
- [ ] Build the trainer dashboard scaffold
- [ ] Add summary cards and empty-state sections
- [ ] Guard coach-only routes

### Phase 4: Hardening
- [ ] Add failure states for profile and dashboard queries
- [ ] Validate athlete fallback behavior
- [ ] Add analytics or event logging for onboarding completion if the app has instrumentation by then

---

## Open Questions

- [ ] What is the canonical user-facing label: `Coach`, `Trainer`, or `Coach / Trainer`?
- [ ] What exact route should athletes land on after role selection in v1?
- [ ] Should the trainer dashboard summary use real counts immediately or start with explicit placeholder zeros until client-management tables exist?

**Decision needed by:** 2026-03-24

---

## References

### Related Documentation
- `docs/process/FEATURE-WORKFLOW.md`
- `docs/templates/FEATURE_TEMPLATE.md`
- `docs/ARCHITECTURE.md`
- `docs/planning/DOCUMENTATION-ROADMAP.md`
- `README.md`

### Related Decisions
- `docs/decisions/001-use-react-typescript-vite.md`

### Source Gaps
- Planning docs exist, but they do not define the current runtime behavior.
- Coach workflow reality still needs implementation-facing documentation once work starts.

---

## Development Log

### 2026-03-19: Initial planning spec
- Selected as the next executable feature because it unlocks the auth, routing, and coach-workflow boundary with the least speculative product surface area.
- Scoped as a scaffold, not a full coach management system, to keep the first implementation slice buildable.
