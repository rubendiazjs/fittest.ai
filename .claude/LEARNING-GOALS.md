# Learning Goals: Tech Lead → Founder Engineer

## About This Document

This document helps AI agents understand the dual purpose of this project:
1. **Build a product**: Fittest.ai - AI-powered padel training platform
2. **Learn by doing**: Develop skills for the Founder Engineer role

When helping with this project, balance shipping features with teaching concepts.

---

## Career Transition Context

### Current Role: Tech Lead (React)
- Strong frontend architecture skills
- Team leadership and code review
- React/TypeScript ecosystem expertise
- Traditional software development workflows

### Target Role: Founder Engineer
- End-to-end product ownership
- AI-first development approach
- Rapid prototyping and iteration
- Automation-heavy workflows
- Small team / solo efficiency

### Key Mindset Shifts
| From (Tech Lead) | To (Founder Engineer) |
|------------------|----------------------|
| Coordinate team efforts | Do it yourself, fast |
| Perfect architecture | Good enough, ship it |
| Long planning cycles | Build → Learn → Iterate |
| Manual processes | Automate everything |
| Code-first solutions | AI-augmented solutions |

---

## Learning Tracks

### 1. AI Agent Development
**Goal**: Understand how to build, orchestrate, and leverage AI agents

**Topics to explore**:
- [ ] Claude Code internals and patterns
- [ ] Custom agent architectures
- [ ] Agent memory and context management
- [ ] Multi-agent orchestration
- [ ] Agent evaluation and testing

**Practice in this project**:
- Using Claude Code effectively for development
- Creating custom skills and workflows
- Building AI-powered features (session generation)

### 2. MCP (Model Context Protocol)
**Goal**: Master the protocol for connecting AI to external tools/data

**Topics to explore**:
- [ ] MCP architecture and concepts
- [ ] Building MCP servers
- [ ] Connecting to databases, APIs, file systems
- [ ] Security and permissions model
- [ ] Real-world MCP patterns

**Practice in this project**:
- Connect Claude to Supabase via MCP
- Create custom MCP tools for training data
- Build MCP server for exercise database

### 3. Automations & Workflows
**Goal**: Eliminate repetitive work through intelligent automation

**Topics to explore**:
- [ ] CI/CD with AI-assisted reviews
- [ ] Automated testing strategies
- [ ] Git hooks and pre-commit automation
- [ ] Issue/PR automation
- [ ] Deployment pipelines

**Practice in this project**:
- Set up Claude Code hooks for quality checks
- Automate feature documentation
- Create PR templates with AI summaries

### 4. Vibe Engineering
**Goal**: Develop intuition for AI collaboration patterns

**Topics to explore**:
- [ ] Effective prompting strategies
- [ ] When to delegate vs. do yourself
- [ ] Iterating with AI feedback loops
- [ ] Managing AI context and memory
- [ ] Building trust with AI tools

**Practice in this project**:
- Document what works/doesn't work
- Refine .claude/ configuration over time
- Develop personal prompt patterns

### 5. Full-Stack Founder Skills
**Goal**: Be dangerous across the entire stack

**Topics to explore**:
- [ ] Backend basics (Supabase, Edge Functions)
- [ ] Infrastructure (Vercel, Cloudflare)
- [ ] Analytics and monitoring
- [ ] User feedback loops
- [ ] Growth and distribution

**Practice in this project**:
- Build complete features end-to-end
- Deploy and monitor production
- Implement analytics

---

## Learning Log

Use this section to capture insights as we build.

### Template
```markdown
### YYYY-MM-DD: [Topic]
**Context**: What we were building
**Learned**: Key insight or technique
**Apply next**: How to use this going forward
```

### Entries

#### 2026-01-10: Project Setup with Claude Code
**Context**: Setting up Fittest.ai project structure
**Learned**:
- Feature-based architecture works well with AI agents
- .claude/ folder with skills and context helps maintain consistency
- Defining types upfront gives AI clear contracts to work with
**Apply next**: Always start features with types and research docs

#### 2026-01-10: Typeform-Style Onboarding
**Context**: Building player onboarding questionnaire
**Learned**:
- Iterating on UI with AI is fast when you describe the target experience
- Data-driven components (questions.ts) are easier for AI to modify
- Keyboard navigation improves UX significantly
**Apply next**: Prefer data-driven components over hard-coded JSX

#### 2026-01-10: Supabase MCP + Backend Integration
**Context**: Wiring onboarding wizard to persist data in Supabase
**Learned**:
- MCP makes database operations conversational - create schema, apply migrations, check security all via chat
- Creating a skill document (supabase-patterns) before implementing ensures consistency
- The pattern: Supabase client → API functions → TanStack Query hooks → Component
- Using text columns with CHECK constraints is more flexible than Postgres enums
- RLS policies are auto-checked by MCP's `get_advisors` tool - catches missing policies
- `TablesInsert<'table_name'>` and `Tables<'table_name'>` types from generated types provide full type safety
**Apply next**: Always generate types after schema changes, create skills before implementing new patterns

#### 2026-01-11: First AI-Powered Feature (Warm-Up Generation)
**Context**: Generating personalized pre-match warm-ups using Claude API via Supabase Edge Functions
**Learned**:
- Edge Functions are Deno-based serverless functions - different from Node.js but similar concepts
- MCP `deploy_edge_function` makes deployment seamless - pass files array, MCP handles the rest
- Structured JSON output from Claude requires clear schema in the prompt with examples
- Feature spec documents (`docs/features/*/FEATURE.md`) help clarify requirements before coding
- The feedback loop pattern: generate → show expected outcomes → collect post-experience feedback → improve
- Prompt engineering tips:
  - Be explicit about output format (JSON schema with types)
  - Provide context about the user (profile data) inline in the prompt
  - Include domain expertise in system prompt ("expert padel fitness coach")
  - Use examples to guide structure when needed
- Edge Function auth: JWT verification via `verify_jwt: true` protects the function
- Error handling in AI features: always provide retry + fallback ("Continue without warm-up")
**Apply next**: Use feature specs for any AI-powered feature, design for feedback loops from the start

---

## Questions to Explore

Parking lot for things to investigate:

- [ ] How do production AI apps handle prompt versioning?
- [ ] What's the best pattern for AI-generated content review?
- [ ] How to structure a codebase for maximum AI assistance?
- [ ] When is fine-tuning worth it vs. prompting?
- [ ] How do you test AI-powered features?

---

## Resources

### To Read/Watch
- [ ] Anthropic's Claude documentation
- [ ] MCP specification and examples
- [ ] AI engineering blogs and case studies

### Tools to Try
- [ ] Different MCP servers
- [ ] AI coding assistants comparison
- [ ] Automation platforms (n8n, Zapier alternatives)

### People to Follow
- AI engineering practitioners on Twitter/X
- Founder engineers sharing their workflows

---

## For AI Agents

When working on this project:

1. **Teach while building**: Explain concepts when introducing new patterns
2. **Suggest learning opportunities**: "This would be a good place to try X"
3. **Share alternatives**: "We could also do this with Y, which has tradeoffs..."
4. **Encourage experimentation**: Support trying new approaches
5. **Keep it lean**: Don't over-engineer, we're learning by shipping

### Example interaction style
```
User: Add user authentication

Agent: I'll set up auth with Supabase. This is a good opportunity to
explore MCP - we could connect Claude directly to Supabase for
database operations. Want me to:

A) Set up basic auth now, explore MCP later
B) Set up auth + configure Supabase MCP server together

Both work, A is faster, B teaches more.
```

---

## Progress Tracking

### Milestones

| Milestone | Status | Notes |
|-----------|--------|-------|
| Project setup with .claude/ | ✅ Done | Skills, context, workflows |
| First feature (onboarding) | ✅ Done | Typeform-style questionnaire |
| MCP integration | ✅ Done | Supabase MCP + database schema |
| Backend integration | ✅ Done | Supabase client, TanStack Query |
| AI-powered feature | ✅ Done | Warm-up generation via Edge Function + Claude API |
| Production deployment | 🔲 Todo | Vercel + monitoring |
| Automation pipeline | 🔲 Todo | CI/CD + hooks |

### Skills Developed
- [x] Claude Code project configuration
- [x] Feature-driven development with AI
- [x] Data-driven React components
- [x] MCP integration (Supabase)
- [x] Supabase database schema design
- [x] TanStack Query patterns
- [x] AI prompt engineering for features
- [x] Supabase Edge Functions (Deno)
- [ ] Full-stack deployment

---

**Last Updated**: 2026-01-11
