# E2E Testing Iteration Plan

## Overview

This document defines how to iteratively build an end-to-end test suite using the
`e2e-test-architect` sub-agent and the `playwright-e2e` skill in Claude Code.

---

## What Was Created

### 1. Sub-Agent: `e2e-test-architect`

**Location**: `.claude/agents/e2e-test-architect.md`

A specialized Claude Code sub-agent that acts as a QA architect. It follows a phased
approach (discover → plan → generate → validate → heal) and has project-level persistent
memory so it learns your app's patterns over time.

| Property | Value |
|----------|-------|
| Model | Sonnet (balanced speed/quality) |
| Tools | Read, Grep, Glob, Bash, Write, Edit |
| Permissions | acceptEdits (auto-approves file writes) |
| Memory | project (persists across sessions) |
| Skill | playwright-e2e (loaded at startup) |

### 2. Skill: `playwright-e2e`

**Location**: `.claude/skills/playwright-e2e/`

A knowledge base of 8 curated guides that teach the sub-agent Playwright best practices.
The skill is loaded into the sub-agent's context at startup, so it always follows these
patterns without needing to discover them.

**Guides included**:

| Guide | Purpose |
|-------|---------|
| `locators.md` | Resilient element selection (getByRole, getByLabel, etc.) |
| `assertions-and-waiting.md` | Auto-retrying assertions, no hardcoded waits |
| `authentication.md` | Reusable auth state, multi-role setup |
| `page-object-model.md` | POM patterns for maintainable tests |
| `test-organization.md` | File structure, tags, fixtures, parallelism |
| `api-mocking.md` | Route interception, error simulation, HAR |
| `configuration.md` | Starter playwright.config.ts, CLI commands |
| `ci-integration.md` | GitHub Actions, sharding, Docker |
| `visual-regression.md` | Screenshot comparison testing |
| `debugging.md` | Failure diagnosis workflow |

---

## Iteration Strategy

### Sprint 0 — Foundation (Day 1)

**Goal**: Get Playwright installed and one test passing.

1. Install Playwright in the project:
   ```bash
   npm init playwright@latest
   ```
2. Copy the `.claude/agents/` and `.claude/skills/` folders into your repo.
3. Ask Claude Code:
   ```
   Use the e2e-test-architect to set up Playwright for this project
   and write a smoke test that verifies the home page loads.
   ```
4. Commit the config and first test.

**Exit criteria**: `npx playwright test` passes with 1 green test.

---

### Sprint 1 — Critical Journeys (Week 1)

**Goal**: Cover the 3-5 highest-risk user journeys.

1. Ask the sub-agent to plan:
   ```
   Use the e2e-test-architect to identify the top 5 critical user journeys
   in this project and create test spec files in specs/.
   ```
2. Review the specs (markdown files describing each journey).
3. Generate tests for each spec:
   ```
   Use the e2e-test-architect to generate Playwright tests for all specs.
   ```
4. The sub-agent will:
   - Read each spec
   - Write test files aligned 1:1 with specs
   - Run the tests
   - Fix failures iteratively
   - Report results

**Exit criteria**: 5 journey tests passing consistently (3 consecutive green runs).

**Typical journeys to cover first**:
- Authentication (login / logout)
- Core CRUD operation (create, read, update, delete)
- Navigation / routing between main pages
- Form validation (happy path + error states)
- Search / filter functionality

---

### Sprint 2 — Stability & POM (Week 2)

**Goal**: Refactor for maintainability, eliminate flakiness.

1. Ask for a test audit:
   ```
   Use the e2e-test-architect to review all existing tests for
   anti-patterns, flakiness risks, and maintainability issues.
   ```
2. Refactor based on recommendations:
   - Extract Page Object Models for pages with 3+ tests
   - Replace any brittle locators
   - Add proper wait strategies
   - Create custom fixtures for repeated setup
3. Run tests 10 times to verify stability:
   ```bash
   npx playwright test --repeat-each=10
   ```

**Exit criteria**: 0 flaky tests over 10 consecutive runs.

---

### Sprint 3 — Coverage Expansion (Week 3)

**Goal**: Expand to secondary journeys and edge cases.

1. Ask the sub-agent to identify gaps:
   ```
   Use the e2e-test-architect to analyze the app and find untested
   user journeys. Prioritize by risk and create new specs.
   ```
2. Generate tests for new specs.
3. Add error scenario tests:
   - Network failures (API mocking)
   - Invalid input validation
   - Permission boundaries
   - Empty states

**Exit criteria**: All major user flows covered, error scenarios for critical paths.

---

### Sprint 4 — CI/CD & Visual Regression (Week 4)

**Goal**: Automate in CI, add visual checks.

1. Set up CI pipeline:
   ```
   Use the e2e-test-architect to create a GitHub Actions workflow
   for running e2e tests on every PR.
   ```
2. Add visual regression tests for key UI components:
   ```
   Use the e2e-test-architect to add visual regression tests for
   the dashboard, login page, and navigation.
   ```
3. Configure test sharding if suite > 5 minutes.
4. Set up nightly full runs vs. PR smoke runs.

**Exit criteria**: Tests run automatically on PRs, visual baselines established.

---

### Ongoing — Heal & Grow

After the initial 4 sprints, the sub-agent shifts to maintenance mode:

- **On new features**: Ask it to write tests alongside the feature.
- **On test failures**: Ask it to diagnose and heal broken tests.
- **Monthly**: Ask it to review the suite for staleness and gaps.
- **On Playwright updates**: Update the skill guides if APIs change.

The sub-agent's persistent memory accumulates knowledge about your app's patterns,
common failure modes, and effective locator strategies — making it more effective
over time.

---

## How to Invoke the Sub-Agent

```text
# Planning
Use the e2e-test-architect to plan tests for the checkout flow.

# Generating
Use the e2e-test-architect to write Playwright tests for the login journey.

# Healing
Use the e2e-test-architect to fix the failing tests in tests/e2e/auth/.

# Reviewing
Use the e2e-test-architect to review all tests for quality and best practices.

# Background (for long-running tasks)
Run the e2e-test-architect in the background to generate tests for all specs.
```

---

## Skills to Consider Adding Later

| Skill | When | Why |
|-------|------|-----|
| `accessibility-testing` | Sprint 3+ | Add axe-core checks to every test |
| `performance-testing` | Sprint 4+ | Measure and assert on page load times |
| `api-testing` | Sprint 3+ | Complement e2e with API-level contract tests |
| `test-data-management` | Sprint 2+ | Database seeding/cleanup strategies |
| `maestro-mobile` | If mobile app added | YAML-based mobile e2e with Maestro framework |

---

## File Structure Summary

```
your-repo/
├── .claude/
│   ├── agents/
│   │   └── e2e-test-architect.md      # The sub-agent
│   ├── skills/
│   │   └── playwright-e2e/
│   │       ├── SKILL.md                # Skill metadata
│   │       └── guides/
│   │           ├── locators.md
│   │           ├── assertions-and-waiting.md
│   │           ├── authentication.md
│   │           ├── page-object-model.md
│   │           ├── test-organization.md
│   │           ├── api-mocking.md
│   │           ├── configuration.md
│   │           ├── ci-integration.md
│   │           ├── debugging.md
│   │           └── visual-regression.md
│   └── agent-memory/
│       └── e2e-test-architect/         # Auto-created, persists learnings
│           └── MEMORY.md
├── specs/                               # Human-readable test plans
├── tests/
│   └── e2e/                            # Generated Playwright tests
├── playwright.config.ts
└── E2E_TESTING_ITERATION_PLAN.md       # This file
```
