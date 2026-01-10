# Documentation Roadmap - Fittest.ai

## Philosophy: Lean & Iterative

We follow a lean documentation approach:
- **Write only what's needed NOW**
- **Iterate based on actual development needs**
- **Keep docs close to code** (same repo)
- **Let AI agents help maintain** (documented for both humans and AI)

---

## Phase 1: MVP Foundation (Current) ✓

### Core Documents (Essential)
- [x] `README.md` - Project vision, getting started
- [x] `docs/training-context.md` - Sports science knowledge base
- [x] `docs/ai-agent-context.md` - AI prompt context
- [ ] `docs/SETUP.md` - Development environment setup
- [ ] `docs/ARCHITECTURE.md` - High-level system design
- [ ] `docs/CONTRIBUTING.md` - How to contribute (for future contributors)

### Purpose
These docs enable:
- New developers to get started quickly
- AI agents to understand business context
- Consistent development approach

---

## Phase 2: Data Layer (Next - When adding Supabase)

### Database & Auth Documents
- [ ] `docs/guides/database-schema.md` - Database design and RLS policies
- [ ] `docs/guides/authentication.md` - Auth flows and user management
- [ ] `docs/guides/api-integration.md` - How to use Supabase client

### Purpose
Added when we:
- Set up Supabase project
- Design first tables
- Implement auth flows

---

## Phase 3: Feature Development (As Needed)

### Component Documentation
- [ ] `docs/guides/component-library.md` - shadcn customizations and patterns
- [ ] `docs/guides/state-management.md` - TanStack Query + Zustand patterns
- [ ] `docs/guides/form-patterns.md` - React Hook Form + Zod examples

### Feature Guides
- [ ] `docs/features/session-generator.md` - How session generator works
- [ ] `docs/features/ai-integration.md` - Claude API integration details

### Purpose
Added as features grow complex enough to warrant documentation.

---

## Phase 4: Production Readiness (Later)

### Operations & Deployment
- [ ] `docs/guides/deployment.md` - Vercel deployment guide
- [ ] `docs/guides/environment-variables.md` - Env var reference
- [ ] `docs/guides/monitoring.md` - Error tracking and analytics
- [ ] `docs/SECURITY.md` - Security considerations and best practices

### Testing & Quality
- [ ] `docs/guides/testing-strategy.md` - Testing approach
- [ ] `docs/guides/code-review-checklist.md` - PR review guidelines

### Purpose
Added when preparing for production use.

---

## Decision Records (Ongoing)

### Architecture Decision Records (ADRs)
- [ ] `docs/decisions/001-use-supabase.md` - Why Supabase over alternatives
- [ ] `docs/decisions/002-use-tanstack-query.md` - Why TanStack Query over RTK Query
- [ ] `docs/decisions/003-session-generation-approach.md` - AI generation vs templates

### Format (ADR Template)
```markdown
# [NUMBER]. [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Deciders:** [Names]

## Context
What is the issue we're trying to solve?

## Decision
What did we decide to do?

## Consequences
What becomes easier or more difficult?

## Alternatives Considered
What else did we think about?
```

### Purpose
Capture **why** decisions were made for future reference.

---

## Documentation Principles

### 1. Just-In-Time Documentation
- Don't document what doesn't exist yet
- Add docs when the code is written
- Update docs in the same PR as code changes

### 2. Docs as Code
- Markdown files in the repo
- Version controlled with Git
- Reviewed in PRs like code
- AI-friendly format

### 3. Different Audiences

**For Developers:**
- Setup guides
- Architecture docs
- API references
- How-to guides

**For AI Agents:**
- Business context (`training-context.md`)
- Prompt templates (`ai-agent-context.md`)
- Code patterns and conventions
- Clear rules and constraints

**For Users (Future):**
- User guides
- FAQ
- Video tutorials

### 4. Living Documentation
- Review quarterly
- Archive obsolete docs
- Update based on team feedback
- Let tests serve as documentation where possible

---

## Documentation Triggers

**Create SETUP.md when:**
- Another developer joins
- Setup takes more than 3 terminal commands
- Environment configuration becomes complex

**Create ARCHITECTURE.md when:**
- We have 3+ distinct layers/modules
- Explaining the system takes > 5 minutes
- Onboarding takes > 1 day

**Create feature docs when:**
- Feature has complex business logic
- Multiple developers work on it
- AI struggles to understand context

**Create ADR when:**
- Making a significant technical decision
- Choosing between viable alternatives
- Decision will impact future development

---

## Tools & Automation

### Current Setup
- **Format:** Markdown (`.md` files)
- **Location:** `/docs` directory
- **Review:** PRs include doc changes
- **Access:** GitHub repo, rendered automatically

### Future Enhancements
- [ ] Add `mdbook` for rendered docs site
- [ ] GitHub Actions to check docs in PRs
- [ ] Auto-generate API docs from TypeScript
- [ ] Link checking automation

---

## Next Immediate Steps

1. **Create SETUP.md** - Document the exact setup process
2. **Create ARCHITECTURE.md** - High-level system design (even if simple)
3. **Create first ADR** - Document why we're using this stack

These three will enable independent development and onboarding.

---

## Documentation Checklist (For New Features)

When adding a feature, ask:
- [ ] Does it introduce new concepts? → Update `docs/training-context.md` or create feature doc
- [ ] Does it change setup process? → Update `docs/SETUP.md`
- [ ] Does it impact architecture? → Update `docs/ARCHITECTURE.md`
- [ ] Was there a key decision? → Create ADR
- [ ] Do AI agents need new context? → Update `docs/ai-agent-context.md`

**If answer is "no" to all → No new docs needed!**

---

## Version History

- **v1.0** (Jan 2026): Initial roadmap - lean approach for MVP phase
- Future versions will track docs evolution

---

## Notes

- This roadmap itself is a living document
- Adjust based on actual development needs
- Don't be dogmatic - pragmatism over process
- Documentation exists to serve development, not the other way around
