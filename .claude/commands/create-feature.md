---
description: Create a new feature definition following our workflow
allowed-tools: Read, Write, Bash(mkdir:*), Bash(cp:*)
---

# Create Feature

Create a new feature: $ARGUMENTS

## Instructions

1. **Parse feature name** from arguments
   - Convert to kebab-case for directory name
   - Example: "Session Generator" → "session-generator"

2. **Create feature directory structure**:

   ```bash
   mkdir -p docs/features/[feature-name]
   mkdir -p src/features/[feature-name]/{components,hooks,api,types}
   touch src/features/[feature-name]/index.ts
   ```

3. **Copy and customize feature template**:

   ```bash
   cp docs/FEATURE_TEMPLATE.md docs/features/[feature-name]/FEATURE.md
   ```

   Update the following in FEATURE.md:
   - Replace `[Feature Name]` with actual name
   - Set Status to "Planning"
   - Set Priority based on discussion
   - Add estimated effort
   - Fill in current date for "Started"

4. **Create initial index.ts**:

   ```typescript
   // Feature: [Feature Name]
   // Export components, hooks, and types from this feature

   export * from './components'
   export * from './hooks'
   export * from './types'
   ```

5. **Check if ADR is needed**:

   Ask user:
   - "Does this feature involve a significant architectural decision?"
   - "Are you choosing between multiple technical approaches?"
   
   If yes → Prompt to create ADR with template from docs/decisions/README.md

6. **Onboard AI agent** (optional):

   Create `.claude/tasks/[feature-name]/onboarding.md` with:
   - Feature context from FEATURE.md
   - Relevant sections from training-context.md
   - Relevant sections from ai-agent-context.md
   - Project architecture context

7. **Output checklist** for user:

   ```markdown
   ✅ Feature created: [feature-name]
   
   Next steps:
   1. Fill out docs/features/[feature-name]/FEATURE.md
   2. Define user stories and acceptance criteria
   3. Break down into tasks
   4. Create ADR if architectural decision needed
   5. Create feature branch: git checkout -b feature/[feature-name]
   6. Start implementing in src/features/[feature-name]/
   
   References:
   - Workflow: docs/FEATURE-WORKFLOW.md
   - Template: docs/FEATURE_TEMPLATE.md
   - Contributing: docs/CONTRIBUTING.md
   ```

## Validation

Before finishing:
- [ ] Feature directory created
- [ ] FEATURE.md exists and is customized
- [ ] src/features/[feature-name]/ structure created
- [ ] index.ts created
- [ ] User knows next steps
