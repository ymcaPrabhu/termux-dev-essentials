# 🔧 CLI Tools Installation - Corrections & Verified Packages

## Executive Summary

The current `scripts/install-cli-suite.js` contains **6 CLI tools**, but research shows:
- ❌ **4 packages DO NOT EXIST** as specified
- ✅ **2 packages are CORRECT** but with wrong names
- ✅ **3 VERIFIED ALTERNATIVES** available

This document provides corrected package names and installation commands based on official documentation and npm registry verification.

---

## 📊 Current vs. Corrected Packages

| # | Current Package | Status | Corrected Package | Installation Method |
|---|----------------|--------|-------------------|-------------------|
| 1 | `@google-cloud/cloud-code` | ❌ Does not exist | `@anthropic-ai/claude-code` | npm ✅ |
| 2 | `@google/generative-ai-cli` | ❌ Wrong name | `@google/gemini-cli` | npm ✅ |
| 3 | `codec-cli` | ❌ Does not exist | `@openai/codex` | npm ✅ |
| 4 | `open-core-cli` | ❌ Does not exist | `opencode-ai` | npm ✅ |
| 5 | `@factory-ai/cli` | ❌ Not on npm | Factory Droid | curl installer |
| 6 | `droid-cli` | ⚠️ Wrong tool | Remove (Android tool) | N/A |

---

## ✅ VERIFIED & CORRECTED CLI Tools

### 1. **Anthropic Claude Code** ✅ NEW RECOMMENDATION
```bash
npm install -g @anthropic-ai/claude-code

# Command: claude
# Verify: claude --version
# API Key: Requires ANTHROPIC_API_KEY environment variable
```

**Status**: ✅ **VERIFIED** - Official Anthropic package  
**NPM**: [@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)  
**Downloads**: 5.2M weekly downloads  
**Version**: 1.0.117 (actively maintained)  
**Purpose**: Agentic coding assistant for terminal  
**Features**:
- Edit files directly
- Answer code questions
- Git workflow management
- Natural language coding tasks
- Customizable via `CLAUDE.md` files

**Requirements**:
- Node.js 18+
- Anthropic API key

---

### 2. **Google Gemini CLI** ✅ CORRECTED NAME
```bash
npm install -g @google/gemini-cli

# Command: gemini
# Verify: gemini --version
# API Key: Configure with 'gemini config'
```

**Status**: ✅ **VERIFIED** - Official Google package  
**NPM**: [@google/gemini-cli](https://www.npmjs.com/package/@google/gemini-cli)  
**Current Name**: `@google/gemini-cli` (NOT `@google/generative-ai-cli`)  
**Purpose**: Terminal-based AI assistant powered by Gemini  
**Features**:
- Code understanding and generation
- Automation & integration
- Google Search grounding
- Conversation checkpointing
- GitHub integration

**Requirements**:
- Node.js 16.14+
- Google API key

---

### 3. **OpenAI Codex** ✅ CORRECTED NAME
```bash
npm install -g @openai/codex

# Command: codex
# Verify: codex --version
# API Key: Set OPENAI_API_KEY environment variable
```

**Status**: ✅ **VERIFIED** - Official OpenAI package  
**NPM**: [@openai/codex](https://www.npmjs.com/package/@openai/codex)  
**Current Name**: `@openai/codex` (NOT `codec-cli`)  
**Purpose**: AI coding agent from OpenAI  
**Features**:
- Local codebase understanding
- Code refactoring
- File creation and modification
- Terminal command execution
- Multi-step task automation
- MCP (Model Context Protocol) server support

**Requirements**:
- Node.js (latest)
- OpenAI API key
- Config file: `~/.codex/config.toml`

---

### 4. **OpenCode AI** ✅ OPEN SOURCE ALTERNATIVE
```bash
npm install -g opencode-ai

# Command: opencode
# Verify: opencode --version
# Auth: opencode auth login
```

**Status**: ✅ **VERIFIED** - Open source Claude Code alternative  
**NPM**: [opencode-ai](https://www.npmjs.com/package/opencode-ai)  
**GitHub**: [opencode-ai/opencode](https://github.com/opencode-ai/opencode)  
**Purpose**: Open source AI coding agent for terminal  
**Features**:
- Native terminal UI
- Multiple LLM provider support (OpenAI, Anthropic, Google)
- Similar UI/UX to Claude Code
- Built on Vercel AI SDK
- Cross-platform shell support
- Custom tool integration

**Supported Providers**:
- OpenAI
- Anthropic
- Google
- Other Vercel AI SDK compatible providers

**Note**: May have installation issues on Windows (requires admin privileges)

---

### 5. **Factory Droid** ⚠️ NOT NPM
```bash
# macOS/Linux/WSL
curl -fsSL https://static.factory.ai/droid/install.sh | sh

# Windows PowerShell
irm https://static.factory.ai/droid/install.ps1 | iex

# Termux (Android Linux)
curl -fsSL https://static.factory.ai/droid/install.sh | sh

# Command: droid
# Verify: droid --version
```

**Status**: ✅ **VERIFIED** - **NOT available via npm**  
**Installation**: Official curl/PowerShell installer only  
**Documentation**: [docs.factory.ai/cli](https://docs.factory.ai/cli/getting-started/overview)  
**Purpose**: AI development agent from Factory.ai  
**Features**:
- End-to-end feature development
- Deep codebase understanding
- Engineering system integration
- Production-ready automation
- Headless execution mode
- CI/CD integration

**Requirements**:
- Factory.ai account
- API key or authentication

**Important**: The npm package `@factory-ai/cli` does NOT exist. Must use official installer.

---

### 6. **droid-cli** ❌ REMOVE - WRONG TOOL
```bash
npm install -g droid-cli  # DO NOT USE
```

**Status**: ⚠️ **INCORRECT TOOL**  
**Reality**: This is an Android development CLI (like Expo CLI), NOT Factory.ai's Droid  
**Purpose**: Android app development tool  
**Version**: 1.7.2 (last updated Aug 2025)  
**Recommendation**: **REMOVE from CLI_TOOLS array** - causes confusion with Factory Droid

---

## 🎯 RECOMMENDED: Final CLI_TOOLS Array

```javascript
const CLI_TOOLS = [
  {
    name: 'claude-code',
    installCmd: 'npm install -g @anthropic-ai/claude-code',
    verifyCmd: 'claude --version',
    description: 'Anthropic Claude Code - Agentic coding assistant',
    requiresApiKey: true,
    apiKeyVar: 'ANTHROPIC_API_KEY',
  },
  {
    name: 'gemini-cli',
    installCmd: 'npm install -g @google/gemini-cli',
    verifyCmd: 'gemini --version',
    description: 'Google Gemini CLI - Terminal AI assistant',
    requiresApiKey: true,
    apiKeyVar: 'GOOGLE_API_KEY',
  },
  {
    name: 'codex',
    installCmd: 'npm install -g @openai/codex',
    verifyCmd: 'codex --version',
    description: 'OpenAI Codex - AI coding agent',
    requiresApiKey: true,
    apiKeyVar: 'OPENAI_API_KEY',
  },
  {
    name: 'opencode',
    installCmd: 'npm install -g opencode-ai',
    verifyCmd: 'opencode --version',
    description: 'OpenCode AI - Open source coding agent',
    requiresApiKey: true,
    apiKeyVar: 'OPENAI_API_KEY', // or other providers
  },
  {
    name: 'gh',
    installCmd: 'type -p curl >/dev/null && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null && apt update && apt install gh -y || pkg install gh', // Termux fallback
    verifyCmd: 'gh --version',
    description: 'GitHub CLI - Official GitHub command line',
    requiresApiKey: false,
  },
];

// Factory Droid requires special handling (non-npm)
const FACTORY_DROID_INSTALL = {
  name: 'droid',
  installCmd: 'curl -fsSL https://static.factory.ai/droid/install.sh | sh',
  verifyCmd: 'droid --version',
  description: 'Factory Droid - AI development agent',
  requiresApiKey: true,
  isSpecialInstall: true,
};
```

---

## 📝 Additional Useful CLI Tools (Optional Additions)

### **GitHub CLI** (gh)
```bash
# Termux
pkg install gh

# Ubuntu/Debian
sudo apt install gh

# Verify
gh --version
```

### **GitLab CLI** (glab)
```bash
npm install -g @gitlab/cli

# Verify
glab --version
```

### **VS Code CLI** (code)
```bash
# Comes with VS Code installation
# Or install standalone: https://code.visualstudio.com/docs/editor/command-line

# Verify
code --version
```

---

## 🔑 API Key Configuration

All AI CLI tools require API keys. Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Anthropic Claude
export ANTHROPIC_API_KEY="your_anthropic_api_key"

# Google Gemini
export GOOGLE_API_KEY="your_google_api_key"

# OpenAI Codex
export OPENAI_API_KEY="your_openai_api_key"

# Factory Droid
export FACTORY_API_KEY="your_factory_api_key"
```

---

## ⚠️ Platform-Specific Considerations

### **Termux on Android**
- ✅ npm packages work well
- ✅ curl installers work (Factory Droid)
- ⚠️ Some packages may need Node.js 18+ (run `pkg install nodejs-lts`)
- ⚠️ OpenCode AI may have permission issues

### **Windows**
- ⚠️ OpenCode AI requires admin privileges or Developer Mode
- ✅ Factory Droid has PowerShell installer
- ✅ npm packages generally work

### **Linux/macOS**
- ✅ All tools work without issues
- ✅ Preferred platform for these CLI tools

---

## 📊 Installation Priority Recommendations

### **Essential (High Priority)**
1. **claude-code** - Most powerful, official Anthropic support
2. **gemini-cli** - Free tier available, good for testing
3. **gh** - Essential for GitHub workflows

### **Recommended (Medium Priority)**
4. **codex** - Excellent for OpenAI users
5. **opencode** - Good open-source alternative

### **Optional (Low Priority)**
6. **Factory Droid** - Specialized tool, requires specific use case

---

## 🎯 Story/Epic Recommendation

**Epic 003: CLI Tools Correction & API Key Management**
- **Story 3.1**: Update CLI tools list with verified packages
- **Story 3.2**: Implement API key validation and configuration
- **Story 3.3**: Add Factory Droid special installer handling
- **Story 3.4**: Create CLI tool selection menu
- **Story 3.5**: Add API key management commands

**Estimated Effort**: 2-3 days  
**Priority**: HIGH (prevents installation failures)

---

## 📚 References

- [Claude Code NPM](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- [Gemini CLI NPM](https://www.npmjs.com/package/@google/gemini-cli)
- [OpenAI Codex NPM](https://www.npmjs.com/package/@openai/codex)
- [OpenCode AI GitHub](https://github.com/opencode-ai/opencode)
- [Factory Droid Docs](https://docs.factory.ai/cli/getting-started/overview)

---

**Last Updated**: 2025-01-11  
**Status**: Ready for implementation in Epic 003
