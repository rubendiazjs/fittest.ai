# Architecture - Fittest.ai

## System Overview

Fittest.ai is an AI-powered training session generator for racket sports athletes, built with modern web technologies and agentic development principles.

### Current Phase: MVP
- **Status**: Development
- **Focus**: Session generation for padel players
- **Deployment**: Local development only

---

## Architecture Principles

### 1. AI-First Development
- AI agents (Claude) are first-class development partners
- Documentation written for both humans and AI
- MCP enables direct tool access for AI agents
- Iterative development with fast feedback loops

### 2. Domain-Driven Design Lite
- Sports science knowledge is explicitly documented
- Business logic separated from UI concerns
- Clear boundaries between features

### 3. Feature-Based Organization
- Code organized by feature, not by type
- Each feature owns its components, hooks, types, and logic
- Reduces cognitive load and improves maintainability

### 4. Progressive Enhancement
- Start simple, add complexity only when needed
- No premature optimization
- Ship working software, iterate based on real usage

---

## Technology Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

**Why**: Modern, fast, excellent TypeScript support, great DX

### UI Layer
- **shadcn/ui** - Copy-paste component library (built on Radix)
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

**Why**: Own the components, no black boxes, excellent accessibility, fast styling

### State Management
- **TanStack Query** - Server state (data fetching, caching)
- **Zustand** - Client state (UI state, preferences)

**Why**: TanStack Query handles API complexity elegantly, Zustand is minimal and predictable

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

**Why**: Excellent TypeScript integration, minimal re-renders, declarative validation

### AI Integration
- **Claude Sonnet 4.5** (Anthropic) - Primary AI model
- **Direct API calls** - No abstraction layer (yet)

**Why**: Most capable model for complex reasoning, direct control over prompts

---

## System Architecture

### High-Level Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (React Components + shadcn/ui)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Application Layer               │
│  (TanStack Query + Zustand + Hooks)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Domain Layer                    │
│  (Business Logic + Validation)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Integration Layer               │
│  (Claude API + Future: Supabase)        │
└─────────────────────────────────────────┘
```

### Current Implementation

**Presentation Layer**
- React functional components
- shadcn/ui components for UI primitives
- Tailwind for styling
- Lucide React for icons

**Application Layer**
- Custom hooks for logic reuse
- TanStack Query for API state
- Zustand for app state
- React Hook Form for form state

**Domain Layer**
- Sports science knowledge (documented)
- Session generation logic
- Validation rules
- TypeScript types

**Integration Layer**
- Direct Anthropic API calls
- Future: Supabase client for DB + Auth

---

## Project Structure

```
fittest.ai/
├── docs/                          # Documentation
│   ├── training-context.md        # Domain knowledge
│   ├── ai-agent-context.md        # AI prompting guide
│   ├── ARCHITECTURE.md            # This file
│   ├── SETUP.md                   # Dev setup
│   └── guides/                    # How-to guides (future)
│
├── src/
│   ├── features/                  # Feature modules
│   │   └── session-generator/     # Training session generation
│   │       ├── components/        # Feature-specific components
│   │       ├── hooks/             # Feature-specific hooks
│   │       ├── api/               # API integration
│   │       ├── types/             # TypeScript types
│   │       └── utils/             # Feature utilities
│   │
│   ├── components/                # Shared components
│   │   └── ui/                    # shadcn components
│   │
│   ├── lib/                       # Shared utilities
│   │   └── utils.ts               # Helper functions
│   │
│   ├── hooks/                     # Shared hooks
│   ├── stores/                    # Zustand stores
│   ├── types/                     # Shared types
│   │
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Entry point
│
├── public/                        # Static assets
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind config
└── vite.config.ts                 # Vite config
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `SessionGenerator.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useSessionGenerator.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatSession.ts`)
- **Types**: `PascalCase.types.ts` (e.g., `Session.types.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` in `constants.ts`

### Import Aliases

```typescript
import { Button } from "@/components/ui/button"
import { useSession } from "@/features/session-generator/hooks/useSession"
import { formatDate } from "@/lib/utils"
```

`@/` maps to `/src` directory.

---

## Data Flow

### Current: Client-Only Architecture

```
User Input
    ↓
React Component
    ↓
Form State (React Hook Form)
    ↓
Submit Handler
    ↓
Claude API Call (TanStack Query mutation)
    ↓
Response Processing
    ↓
Display Session (React Component)
```

### Future: With Supabase (Phase 2)

```
User Input
    ↓
React Component
    ↓
Form State (React Hook Form)
    ↓
Submit Handler
    ↓
┌─────────────┴─────────────┐
│                           │
Claude API Call        Supabase Write
│                           │
Session Generation     Save to DB
│                           │
└─────────────┬─────────────┘
    ↓
Update UI State (TanStack Query)
    ↓
Display Session + History
```

---

## Key Architectural Decisions

### 1. Feature-Based Structure

**Decision**: Organize code by feature, not by type.

**Rationale**:
- Related code stays together
- Easier to understand and modify features
- Clear ownership and boundaries
- Scales better than type-based structure

**Example**:
```
❌ Don't do this (type-based):
src/
  ├── components/
  │   ├── SessionForm.tsx
  │   ├── SessionDisplay.tsx
  │   └── SessionList.tsx
  ├── hooks/
  │   ├── useSession.ts
  │   └── useSessionHistory.ts
  └── types/
      └── session.ts

✅ Do this (feature-based):
src/
  └── features/
      └── session-generator/
          ├── components/
          ├── hooks/
          ├── types/
          └── api/
```

### 2. No Global State (Initially)

**Decision**: Use TanStack Query for server state, local state for UI, avoid Redux/Context.

**Rationale**:
- TanStack Query handles 90% of "global state" needs
- Local state is sufficient for MVP
- Less boilerplate, faster development
- Can add Zustand later if needed

**When to reconsider**: User preferences, theme, complex multi-step flows

### 3. Direct API Integration

**Decision**: Call Claude API directly from frontend (no backend proxy initially).

**Rationale**:
- Simplest possible architecture
- No server to maintain
- Fast iteration
- Suitable for MVP with limited users

**Tradeoffs**:
- API keys visible in network tab (use environment variables)
- No request rate limiting
- No caching layer

**Future**: Add backend proxy when scaling or adding sensitive operations.

### 4. TypeScript Everywhere

**Decision**: Use TypeScript for all code, no JavaScript files.

**Rationale**:
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- AI agents understand types better

### 5. shadcn Over Component Libraries

**Decision**: Use shadcn (copy-paste components) instead of Material-UI/Ant Design.

**Rationale**:
- Own the code, no black boxes
- Customize without fighting the library
- Smaller bundle size
- Better for AI code generation (simpler, more predictable)

---

## Future Architecture Evolution

### Phase 2: Add Persistence (Supabase)

**What changes**:
- Add Supabase client
- Implement user authentication
- Store generated sessions
- Add session history feature

**New layers**:
- Auth context/provider
- Supabase API integration
- Row Level Security policies

### Phase 3: Enhanced AI

**What changes**:
- Add prompt chaining for complex sessions
- Implement session feedback loop
- Add personalization based on history

**New layers**:
- AI orchestration layer
- User preference system
- Analytics/tracking

### Phase 4: Multi-Sport

**What changes**:
- Abstract sport-specific logic
- Add sport selection
- Multiple knowledge bases

**New layers**:
- Sport abstraction layer
- Dynamic context loading
- Sport-specific validation

---

## Non-Functional Requirements

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Session Generation**: < 10s (Claude API dependent)

### Browser Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- No IE11 support

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios met

---

## Security Considerations

### Current (MVP)
- API keys in environment variables (not committed)
- No user authentication yet
- No sensitive data stored

### Future (With Supabase)
- Row Level Security (RLS) policies
- JWT authentication
- HTTPS only
- Rate limiting
- Input validation and sanitization

---

## Development Workflow

### Local Development
1. Make changes in feature branch
2. Use AI agents (Claude + MCP) for assistance
3. Test manually in browser
4. Commit with descriptive message
5. Push to GitHub
6. Create PR (future: automated checks)

### Code Quality
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- No tests yet (added in Phase 3)

### Deployment (Future)
- Main branch = production (Vercel)
- Preview deployments for PRs
- Environment variables via Vercel dashboard

---

## Monitoring & Observability (Future)

### Planned Tools
- **Error Tracking**: Sentry
- **Analytics**: Plausible or PostHog
- **Performance**: Vercel Analytics

### Metrics to Track
- Session generation success rate
- Average generation time
- User engagement
- Error frequency

---

## Known Technical Debt

### Accepted for MVP
- ✅ No backend (direct API calls)
- ✅ No testing suite
- ✅ No error boundaries
- ✅ No loading skeletons
- ✅ No offline support

### To Address Later
- 🔄 Add error boundaries (Phase 2)
- 🔄 Add loading states (Phase 2)
- 🔄 Add testing (Phase 3)
- 🔄 Add backend proxy (Phase 3)

---

## Questions & Answers

### Q: Why no backend?
**A**: MVP doesn't need it. Direct API calls are simpler. We'll add when we need rate limiting, caching, or sensitive operations.

### Q: Why TanStack Query instead of RTK Query?
**A**: Simpler API, no Redux dependency, excellent caching, perfect for AI code generation.

### Q: Why Zustand instead of Context?
**A**: Simpler than Context + useReducer, no provider hell, better performance, minimal API.

### Q: Why feature-based structure?
**A**: Related code stays together, easier to understand and modify, scales better than type-based.

### Q: Will this scale?
**A**: For 1000s of users, yes easily. For 100k+ users, we'll need backend optimizations, but the frontend architecture will remain solid.

---

## Contributing to Architecture

### Making Architecture Changes

1. **Small changes**: Update this doc in same PR as code
2. **Significant changes**: Create ADR (Architecture Decision Record)
3. **Unclear changes**: Discuss in GitHub issue first

### Architecture Review Triggers
- Adding new external dependency
- Changing state management approach
- Restructuring project organization
- Adding new integration layer

---

## Resources

### Related Documentation
- `docs/training-context.md` - Domain knowledge
- `docs/ai-agent-context.md` - AI prompting patterns
- `docs/SETUP.md` - Development setup

### External Resources
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Anthropic API Docs](https://docs.anthropic.com)

---

## Version History

- **v1.0** (January 2026): Initial architecture for MVP phase
- Future versions will document architectural evolution

---

**Last Updated**: January 2026
**Status**: Living Document - Update as architecture evolves
