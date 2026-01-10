# Setup Guide - Fittest.ai

## Prerequisites

### Required Software
- **Node.js**: v24+ (we use v24.12.0)
- **npm**: v11+ (comes with Node)
- **nvm**: Recommended for Node version management
- **Git**: For version control

### Recommended Tools
- **Cursor IDE** or **VS Code**: For development
- **Claude Desktop**: For AI-assisted development
- **Warp Terminal**: Enhanced terminal experience (optional)

### Accounts Needed (Future)
- GitHub account (for contributing)
- Supabase account (when we add database - Phase 2)
- Vercel account (when we deploy - Phase 4)

---

## Step 1: Install Node.js with nvm

### Install nvm
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal, then:
nvm --version  # Verify installation
```

### Install Node v24
```bash
nvm install 24
nvm use 24
nvm alias default 24  # Set as default

# Verify
node -v  # Should show v24.12.0 or similar
npm -v   # Should show v11.6.2 or similar
```

---

## Step 2: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/rubendiazjs/fittest.ai.git
cd fittest.ai

# Verify you're on main branch
git branch  # Should show * main
```

---

## Step 3: Install Dependencies

```bash
# Make sure you're using Node 24
nvm use 24

# Install all dependencies
npm install

# This installs:
# - React, TypeScript, Vite
# - Tailwind CSS, shadcn/ui
# - TanStack Query, Zustand
# - React Hook Form, Zod
# - Lucide React icons
```

**Expected time**: 2-3 minutes depending on internet speed

---

## Step 4: Verify Installation

### Run Development Server
```bash
npm run dev
```

**Expected output**:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```

### Open in Browser
Navigate to `http://localhost:5174/`

You should see:
- A page with "Fittest.ai" title
- Text: "Your agentic development playground"
- A button that says "Click Me"
- When clicked, an alert appears

**If you see this → Setup is complete! ✅**

---

## Step 5: Configure Your IDE

### For Cursor

1. Open the project:
   ```bash
   cursor .
   ```

2. Recommended extensions (Cursor should prompt):
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - ESLint
   - Prettier

3. Enable Cursor features:
   - Cmd+K: For inline code generation
   - Cmd+L: For chat
   - Composer mode: For multi-file edits

### For VS Code

1. Open the project:
   ```bash
   code .
   ```

2. Install recommended extensions (VS Code should prompt)

3. Configure Prettier:
   - Set as default formatter
   - Enable "Format on Save"

---

## Step 6: MCP Setup (For AI-Assisted Development)

### What is MCP?
Model Context Protocol allows AI agents (Claude) to interact with your filesystem, GitHub, and terminal.

### Configure Claude Desktop

1. **Install Claude Desktop**
   - Download from https://claude.ai/download

2. **Create MCP Config File**
   ```bash
   # macOS
   mkdir -p ~/Library/Application\ Support/Claude
   touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Add Configuration**
   Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
   
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "/Users/YOUR_USERNAME/path/to/fittest.ai"
         ]
       },
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       },
       "shell": {
         "command": "npx",
         "args": ["-y", "@mkusaka/mcp-shell-server"]
       }
     }
   }
   ```

4. **Replace Placeholders**
   - `YOUR_USERNAME`: Your macOS username
   - `your_token_here`: Your GitHub Personal Access Token (create at https://github.com/settings/tokens)

5. **Restart Claude Desktop**
   - Quit completely (Cmd+Q)
   - Reopen

6. **Verify MCP is Working**
   - Look for 🔨 hammer icon in Claude Desktop (bottom left)
   - Ask Claude: "List my files" - it should show your project files

---

## Project Structure Overview

After setup, you should have:

```
fittest.ai/
├── docs/                     # Documentation (you are here!)
│   ├── training-context.md   # Sports science knowledge
│   ├── ai-agent-context.md   # AI prompt templates
│   ├── SETUP.md              # This file
│   └── ...
├── src/
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   ├── components/           # Shared components
│   │   └── ui/               # shadcn components
│   ├── lib/                  # Utilities
│   └── ...
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
└── vite.config.ts            # Vite config
```

---

## Common Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:5174)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

### Testing (Future)
```bash
npm test                 # Run tests (will be added)
```

---

## Troubleshooting

### Issue: `npm install` fails

**Solution 1**: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Verify Node version
```bash
node -v  # Must be v24+
nvm use 24
npm install
```

### Issue: Port 5174 already in use

**Solution**: Kill the process or use a different port
```bash
# Kill process on port 5174
lsof -ti:5174 | xargs kill -9

# Or run on different port
npm run dev -- --port 3000
```

### Issue: Tailwind styles not working

**Solution 1**: Restart dev server
```bash
# Ctrl+C to stop, then:
npm run dev
```

**Solution 2**: Clear Vite cache
```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: MCP not working in Claude Desktop

**Solution**:
1. Check config file location is correct
2. Verify JSON syntax (use JSONLint.com)
3. Ensure file paths are absolute (not relative)
4. Restart Claude Desktop completely (Cmd+Q then reopen)
5. Check for 🔨 icon in Claude Desktop interface

### Issue: TypeScript errors in IDE

**Solution**: Restart TypeScript server
- **Cursor/VS Code**: Cmd+Shift+P → "TypeScript: Restart TS Server"

---

## Environment Variables (Future)

Currently, no environment variables are needed for local development.

When we add Supabase (Phase 2), we'll need:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These will be documented in a `.env.example` file when needed.

---

## What's Next?

After successful setup:

1. **Read the docs**:
   - `docs/ARCHITECTURE.md` - Understand system design
   - `docs/training-context.md` - Learn the domain
   - `docs/ai-agent-context.md` - See how AI assists development

2. **Explore the code**:
   - Look at `src/App.tsx` - simple React component
   - Check `src/components/ui/button.tsx` - shadcn component example
   - Review `vite.config.ts` - path aliases configuration

3. **Make your first change**:
   - Edit `src/App.tsx`
   - See hot reload in action
   - Commit with a good message

4. **Use AI assistance**:
   - Open Claude Desktop
   - Ask it to explain files
   - Have it generate components
   - Let it help with refactoring

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Open a GitHub issue
- **Questions**: Ask in GitHub Discussions (when enabled)
- **AI Help**: Use Claude Desktop with MCP configured

---

## Setup Checklist

Before starting development, verify:

- [ ] Node v24+ installed and active (`node -v`)
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Dev server runs successfully (`npm run dev`)
- [ ] Can see app in browser (http://localhost:5174)
- [ ] IDE configured with extensions
- [ ] MCP working in Claude Desktop (optional but recommended)
- [ ] Can make changes and see hot reload

**All checked? You're ready to build! 🚀**

---

## Notes

- This setup is for **local development only**
- Production deployment will be covered in Phase 4
- Supabase setup will be added in Phase 2
- Setup time: ~15-30 minutes for first time

**Last updated**: January 2026
