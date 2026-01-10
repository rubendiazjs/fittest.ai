# Fittest.ai 🎾

> AI-powered training session generator for racket sports athletes

## Vision

Fittest.ai is a training session generator designed to help racket sports athletes (starting with padel) get scientifically-backed, personalized training programs. Built with agentic development principles, this project serves as both a production application and a learning playground for advanced AI-assisted development workflows.

## Current Status: MVP - Padel Training Generator

**Phase 1 (Current):** Simple training session generator for padel players
- Generate customized training sessions
- Based on athlete level (beginner, intermediate, advanced)
- Aligned with training phase (pre-season, competition, transition)
- Scientifically grounded in sports performance methodology

## Core Features (Phase 1)

### Session Generation
- **Personalized workouts** based on:
  - Athlete level
  - Current training phase
  - Specific goals (power, agility, endurance, etc.)
  - Available equipment
- **Complete session structure**:
  - Progressive warm-up
  - Main training block
  - Proper cool-down
  - Coaching notes and corrections

### Scientific Foundation
- Based on periodization principles (Bompa, Issurin)
- Padel-specific movement patterns
- Injury prevention integrated
- Progressive overload applied correctly

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui (Radix + Tailwind CSS)
- **State Management:** TanStack Query + Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

### AI Integration
- **Primary Model:** Claude Sonnet 4.5 (Anthropic)
- **Architecture:** Agentic workflows with MCP
- **Context:** Custom training knowledge base

### Development Approach
- **Methodology:** Agentic development + Vibe engineering
- **MCP Servers:** Filesystem, GitHub, Shell
- **AI Assistants:** Cursor, Claude Desktop
- **Version Control:** Git + GitHub

## Project Structure

```
fittest.ai/
├── docs/                          # Documentation
│   ├── training-context.md        # Full sports science reference
│   ├── ai-agent-context.md        # Condensed context for AI agents
│   └── ...
├── src/
│   ├── features/                  # Feature-based organization
│   │   └── session-generator/     # Training session generation
│   ├── components/                # Shared components
│   │   └── ui/                    # shadcn components
│   ├── lib/                       # Utilities and config
│   ├── hooks/                     # Shared hooks
│   └── stores/                    # Zustand stores
└── ...
```

## Documentation

### For Developers
- **[Training Context](./docs/training-context.md)** - Complete sports science foundation for padel training
- Explains periodization, exercise selection, safety considerations
- Reference for understanding business logic

### For AI Agents
- **[AI Agent Context](./docs/ai-agent-context.md)** - Condensed prompt context
- Quick reference for AI-assisted development
- Rules and patterns for session generation

## Roadmap

### Phase 1: MVP ✓ (Current)
- [x] Project setup
- [ ] Session generator UI
- [ ] AI-powered session generation
- [ ] Basic personalization (level, phase, goal)
- [ ] Session display and export

### Phase 2: Enhanced Personalization
- [ ] User profiles and history
- [ ] Progress tracking
- [ ] Session feedback loop
- [ ] Equipment-based filtering
- [ ] Injury history consideration

### Phase 3: Multi-Sport Expansion
- [ ] Tennis support
- [ ] Squash support
- [ ] Badminton support
- [ ] Sport-specific adaptations

### Phase 4: Advanced Features
- [ ] Periodization planning (full season)
- [ ] Performance analytics
- [ ] Video exercise library
- [ ] Coach collaboration tools
- [ ] Mobile app

## Development Philosophy

This project is built using **agentic development** principles:

- **AI-First:** Leveraging Claude and Cursor for rapid development
- **MCP Integration:** Direct tool access for AI agents
- **Iterative:** Small increments, fast feedback loops
- **Documentation-Driven:** Context is code
- **Learning-Oriented:** Exploring cutting-edge AI development patterns

### Key Principles
1. Start simple, iterate based on real usage
2. Let AI handle boilerplate, humans handle architecture
3. Document for both humans and AI agents
4. Prioritize working software over perfect planning

## Getting Started

### Prerequisites
- Node.js 24+ (using nvm recommended)
- npm 11+

### Installation

```bash
# Clone the repository
git clone https://github.com/rubendiazjs/fittest.ai.git
cd fittest.ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5174`

### Development with AI

This project is designed for AI-assisted development:

1. **Read the context docs** in `/docs/` before generating code
2. **Use MCP tools** for file operations and git
3. **Refer to training-context.md** for domain logic
4. **Follow ai-agent-context.md** for session generation

## Contributing

This is currently a personal learning project, but feedback and suggestions are welcome!

### For AI Agents Contributing

Before generating code:
1. Read `/docs/training-context.md` for domain understanding
2. Reference `/docs/ai-agent-context.md` for generation rules
3. Follow the established project structure
4. Ensure scientific accuracy in training logic

## License

MIT

## Author

**Ruben Diaz** - Tech Lead specializing in agentic development and AI-powered applications

## Acknowledgments

- Sports science research from padel and racket sports communities
- Anthropic's Claude for AI capabilities
- The MCP protocol for agent interoperability
- shadcn/ui for beautiful components

---

**Note:** This project serves dual purposes:
1. **Product:** Helping athletes train better
2. **Learning:** Mastering agentic development, MCP, and AI-first workflows

Both goals inform the development approach and architecture decisions.
