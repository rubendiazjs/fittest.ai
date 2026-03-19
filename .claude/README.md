# Claude Code Configuration

## Project Overview

**Fittest.ai** is an AI-powered training platform for padel players.

This project has a dual purpose:
1. **Product**: Build a useful training tool
2. **Learning**: Develop Founder Engineer skills with AI-first development

> **Important**: Read [LEARNING-GOALS.md](./LEARNING-GOALS.md) to understand the learning objectives.

---

## Directory Structure

```
.claude/
├── README.md           # This file - start here
├── LEARNING-GOALS.md   # Career transition & learning tracker
├── settings.local.json # Local Claude Code settings
├── commands/           # Slash commands (/commit, /pr-review, etc.)
└── skills/             # Reusable skill prompts
```

---

## Key Context Files

| File | Purpose |
|------|---------|
| `.claude/LEARNING-GOALS.md` | Learning objectives and progress |
| `docs/training-context.md` | Sports science domain knowledge |
| `docs/ai-agent-context.md` | Prompt for session generation AI |
| `docs/ARCHITECTURE.md` | Technical architecture |
| `docs/CONTRIBUTING.md` | Code standards |

---

## Working Style

When helping with this project:

### 1. Teach While Building
Don't just write code - explain concepts when relevant:
```
"I'm using TanStack Query here because... This is a good pattern for..."
```

### 2. Suggest Learning Opportunities
Point out chances to explore new topics:
```
"This would be a good place to try MCP if you want to explore that"
```

### 3. Keep It Lean
- Ship fast, iterate often
- Good enough > Perfect
- Avoid over-engineering

### 4. Balance Speed and Learning
- Simple task? Just do it efficiently
- New concept? Take time to explain
- Complex decision? Present options with tradeoffs

---

## Current Focus

**Feature**: Player Onboarding
- Typeform-style questionnaire
- 15 questions across 3 dimensions
- Profile generation with scoring

**Next Up**:
- [ ] Backend integration (Supabase)
- [ ] MCP setup for database access
- [ ] AI-powered session generation

---

## Quick Commands

```bash
# Development
npm run dev         # Start dev server
npm run build       # Build for production
npx tsc --noEmit    # Type check

# Claude Code
/commit             # Create commit with AI summary
/pr-review          # Review current PR
/code-quality       # Run quality checks
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind, shadcn/ui
- **State**: TanStack Query (server), useState (local)
- **Backend**: Supabase (planned)
- **AI**: Claude API for session generation
- **Build**: Vite

---

## For New Sessions

When starting a new Claude Code session:

1. Skim this README for context
2. Check `LEARNING-GOALS.md` for current learning focus
3. Look at recent git commits for context
4. Ask if unclear about priorities

---

**Owner**: Ruben (Tech Lead → Founder Engineer transition)
**Updated**: 2026-01-10
