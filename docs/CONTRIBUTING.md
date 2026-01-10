# Contributing to Fittest.ai

First off, thank you for considering contributing to Fittest.ai! 

This is a pet project for learning agentic development, but contributions are welcome. This document provides guidelines to make the process smooth for everyone.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

Be respectful, inclusive, and constructive. That's it. Let's keep it simple.

---

## How Can I Contribute?

### Reporting Bugs
- Check if the bug is already reported in Issues
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Your environment (OS, Node version, etc.)

### Suggesting Features
- Check existing issues and discussions first
- Create an issue with:
  - Clear use case
  - Why it's valuable
  - How it might work
- Understand this is a learning project - features will be prioritized based on learning value

### Contributing Code
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

---

## Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

**Quick version**:
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/fittest.ai.git
cd fittest.ai

# Install dependencies
nvm use 24
npm install

# Run development server
npm run dev
```

---

## Development Workflow

### 1. Pick or Create an Issue
- Check existing issues for something to work on
- Or create a new issue describing what you'll work on
- Wait for feedback before starting major work

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Changes
- Write code
- Update documentation if needed
- Keep changes focused (one feature/fix per PR)

### 4. Test Your Changes
```bash
# Run the dev server
npm run dev

# Check TypeScript
npm run type-check

# Run linting
npm run lint
```

### 5. Commit Your Changes
See [Commit Messages](#commit-messages) below.

### 6. Push and Create PR
```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode (already configured)
- Define interfaces for all props and data structures
- Avoid `any` type - use `unknown` if type is truly unknown

**Good**:
```typescript
interface SessionFormProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  onSubmit: (data: SessionData) => void;
}

export function SessionForm({ level, onSubmit }: SessionFormProps) {
  // ...
}
```

**Bad**:
```typescript
export function SessionForm(props: any) {
  // ...
}
```

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract complex logic into custom hooks
- Prefer composition over prop drilling

**Component structure**:
```typescript
import { useState } from 'react'
import type { ComponentProps } from './types'

export function MyComponent({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Derived state
  const computedValue = useMemo(() => /* ... */, [deps])
  
  // 3. Event handlers
  const handleClick = () => {
    // ...
  }
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### File Organization
- Follow the feature-based structure (see ARCHITECTURE.md)
- Place files with their related feature when possible
- Use index files to export public APIs

```
features/
  └── session-generator/
      ├── components/
      │   ├── SessionForm.tsx
      │   └── SessionDisplay.tsx
      ├── hooks/
      │   └── useSessionGenerator.ts
      ├── types/
      │   └── session.types.ts
      └── index.ts  // Export public API
```

### Styling
- Use Tailwind CSS utility classes
- No custom CSS files
- Use shadcn/ui components when possible
- Keep styling consistent with existing components

**Good**:
```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>
```

**Bad**:
```tsx
<button style={{ padding: '8px 16px', background: 'blue' }}>
  Click me
</button>
```

### Naming Conventions
- **Components**: `PascalCase` (e.g., `SessionForm.tsx`)
- **Functions**: `camelCase` (e.g., `formatSession`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useSession`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_SESSION_LENGTH`)
- **Types/Interfaces**: `PascalCase` (e.g., `SessionData`)

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

**Good**:
```
feat(session-generator): add session difficulty selector

Added dropdown to select session difficulty (beginner/intermediate/advanced).
Updates the AI prompt based on selection.

Closes #123
```

```
fix(ui): correct button hover state

Fixed button not showing hover effect due to incorrect Tailwind class.
```

```
docs(setup): add MCP configuration steps

Added detailed instructions for setting up MCP servers
with Claude Desktop.
```

**Bad**:
```
fixed stuff
```

```
WIP
```

```
updated files
```

### Commit Scope
Scope is optional but helpful:
- `session-generator`
- `ui`
- `api`
- `docs`
- `config`

---

## Pull Request Process

### Before Submitting
- [ ] Code follows the style guide
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Changes work as expected (`npm run dev`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention

### PR Template

When you create a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style
- [ ] TypeScript compiles
- [ ] Linting passes
- [ ] Documentation updated
```

### Review Process
1. Maintainer will review within 3-5 days
2. Address any requested changes
3. Once approved, maintainer will merge
4. PR will be squashed into a single commit

### After Merge
- Your branch will be deleted automatically
- You'll be credited in the commit and release notes
- Thank you for contributing! 🎉

---

## Development Tips

### Using AI Assistance
This project encourages AI-assisted development:
- Use Claude Desktop with MCP configured
- Reference `docs/ai-agent-context.md` for prompting guidelines
- Let AI generate boilerplate, you review and refine
- Document new patterns in `ai-agent-context.md`

### Working with Existing Code
- Read `docs/ARCHITECTURE.md` first
- Check `docs/training-context.md` for domain knowledge
- Look for similar existing code for patterns
- Ask questions in issues if unclear

### Debugging
- Use browser DevTools
- Check console for errors and warnings
- Use React DevTools extension
- TypeScript errors usually point to the real problem

---

## Questions?

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Create an Issue
- **Feature ideas**: Create an Issue
- **Security concerns**: Email directly (see SECURITY.md when added)

---

## Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Thanked profusely 🙏

---

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](../LICENSE) that covers this project.

---

**Thank you for contributing to Fittest.ai!** 🚀

Every contribution, big or small, is valuable and appreciated.
