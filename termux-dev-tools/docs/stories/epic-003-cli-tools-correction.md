# Epic 3: CLI Tools Correction & API Key Management

## Status
- Planning

## Goal

To correct the CLI tools installation suite with **verified, real npm packages** and implement proper API key management, replacing non-existent packages with production-ready alternatives.

## Description

The current `install-cli-suite.js` contains 6 CLI tools, but **4 of them do not exist** as npm packages or have incorrect names. This epic corrects the tool list with verified packages (Claude Code, Gemini CLI, OpenAI Codex, OpenCode AI), adds API key validation, and implements special handling for non-npm tools like Factory Droid.

## Priority

**HIGH** - **Blocking Issue** - Current implementation will fail for most users

## Problem Statement

### Current Issues
1. ❌ `@google-cloud/cloud-code` - Does not exist as npm package
2. ❌ `@google/generative-ai-cli` - Wrong package name
3. ❌ `codec-cli` - Does not exist
4. ❌ `open-core-cli` - Does not exist
5. ❌ `@factory-ai/cli` - Not available on npm
6. ⚠️ `droid-cli` - Exists but is wrong tool (Android dev, not Factory.ai)

### Impact
- **100% installation failure rate** for CLI tools
- Users cannot access AI coding assistants
- Poor user experience and trust
- Wasted installation time

### Root Cause
- Packages were not verified against npm registry
- Placeholder/fictional package names used
- Lack of research on actual tool availability

## Core Features (User Stories)

### Fix & Verification
-   **Story 3.1: Correct CLI Tools List**: As a developer, I want the CLI tools list updated with verified packages, so that installations succeed.
-   **Story 3.2: API Key Configuration System**: As a user, I want a guided setup for API keys, so that CLI tools are properly configured.
-   **Story 3.3: Factory Droid Special Installer**: As a user, I want Factory Droid installed via its official curl installer, so that it works correctly.

### Enhancement & UX
-   **Story 3.4: CLI Tool Selection Menu**: As a user, I want to choose which AI tools to install, so that I only install what I need.
-   **Story 3.5: API Key Validation**: As a user, I want API keys validated before installation, so that I don't waste time on invalid configurations.
-   **Story 3.6: Tool-Specific Documentation**: As a user, I want quick-start guides for each AI tool, so that I can start using them immediately.

## Definition of Done

-   [ ] All CLI tool packages verified on npm registry
-   [ ] install-cli-suite.js updated with correct packages
-   [ ] API key configuration system implemented
-   [ ] Factory Droid special installer handler created
-   [ ] CLI tool selection menu integrated
-   [ ] API key validation added
-   [ ] Tool-specific documentation created
-   [ ] All tests pass (100% success rate)
-   [ ] QA review completed with quality gate passed

## Success Metrics

### Installation Success
-   **Current**: 0% success rate (all packages fail)
-   **Target**: 95%+ success rate
-   **Measurement**: Actual package installation completion

### User Experience
-   **API Key Setup**: 90%+ users complete on first try
-   **Tool Usage**: 80%+ users successfully use at least one AI tool
-   **Documentation**: 85%+ users rate docs as "helpful" or better

## Corrected CLI Tools List

### NPM Packages (4 tools)
1. **@anthropic-ai/claude-code** ✅ (5.2M weekly downloads)
   - Command: `claude`
   - Requires: ANTHROPIC_API_KEY
   - Status: Official Anthropic package

2. **@google/gemini-cli** ✅ (Verified, corrected name)
   - Command: `gemini`
   - Requires: GOOGLE_API_KEY
   - Status: Official Google package

3. **@openai/codex** ✅ (Verified, corrected name)
   - Command: `codex`
   - Requires: OPENAI_API_KEY
   - Status: Official OpenAI package

4. **opencode-ai** ✅ (Open source alternative)
   - Command: `opencode`
   - Requires: Provider API key
   - Status: Community package

### Special Installers (1 tool)
5. **Factory Droid** ✅ (curl installer only)
   - Install: `curl -fsSL https://static.factory.ai/droid/install.sh | sh`
   - Command: `droid`
   - Requires: FACTORY_API_KEY
   - Status: Official Factory.ai

### Removed (1 tool)
6. **droid-cli** ❌ REMOVED
   - Reason: Wrong tool (Android development, not Factory.ai)
   - Replacement: Factory Droid (curl installer)

## Technical Debt Addressed

### Immediate Fixes
1. **Non-existent Packages**: Replaced with verified alternatives
2. **Wrong Package Names**: Corrected to official names
3. **Missing API Key Handling**: Added validation and configuration
4. **No Special Installer Support**: Added curl installer handler

### Future Improvements
- API key storage (encrypted)
- Tool version management
- Auto-update capabilities
- Usage analytics

## Dependencies

### Internal
- Epic 001 (MVP) complete ✅
- Story 2.1 (Interactive Menu) complete ✅

### External
- npm registry access
- API key availability (user-provided)
- Internet connectivity for curl installers

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API keys not available | Medium | High | Provide clear instructions, free tier options |
| npm packages change names | Low | Medium | Version pinning, periodic verification |
| curl installer fails | Low | High | Fallback instructions, manual install guide |
| Users confused by API setup | Medium | Medium | Guided wizard, clear documentation |

## Timeline Estimate

**Total Duration**: 2-3 days

### Day 1: Core Fixes
- Story 3.1: Correct CLI tools list (2 hours)
- Story 3.3: Factory Droid handler (1 hour)
- Testing & validation (1 hour)

### Day 2: API Key System
- Story 3.2: API key configuration (3 hours)
- Story 3.5: API key validation (2 hours)
- Integration testing (1 hour)

### Day 3: UX & Documentation
- Story 3.4: CLI tool selection menu (2 hours)
- Story 3.6: Tool documentation (2 hours)
- Final testing & QA (2 hours)

## Implementation Strategy

### Phase 1: Emergency Fix (4 hours)
**Priority**: CRITICAL
- Update CLI_TOOLS array with correct packages
- Basic installation testing
- Deploy to main branch

### Phase 2: API Key System (6 hours)
**Priority**: HIGH
- Interactive API key setup wizard
- Validation before installation
- Secure storage recommendations

### Phase 3: Polish & Documentation (6 hours)
**Priority**: MEDIUM
- Tool selection menu integration
- Quick-start guides per tool
- Troubleshooting documentation

## Story Details

### Story 3.1: Correct CLI Tools List
**Effort**: 2 hours  
**Priority**: CRITICAL  
**Tasks**:
- Update CLI_TOOLS array with verified packages
- Remove non-existent packages
- Add proper verify commands
- Update tests

### Story 3.2: API Key Configuration System
**Effort**: 3 hours  
**Priority**: HIGH  
**Tasks**:
- Create interactive API key wizard
- Add environment variable setup
- Provide free tier instructions
- Test with all providers

### Story 3.3: Factory Droid Special Installer
**Effort**: 1 hour  
**Priority**: HIGH  
**Tasks**:
- Detect curl availability
- Execute curl installer with error handling
- Verify installation
- Add fallback instructions

### Story 3.4: CLI Tool Selection Menu
**Effort**: 2 hours  
**Priority**: MEDIUM  
**Tasks**:
- Integrate with Story 2.1 menu
- Add tool descriptions
- Show API key requirements
- Allow individual selection

### Story 3.5: API Key Validation
**Effort**: 2 hours  
**Priority**: MEDIUM  
**Tasks**:
- Validate API key format
- Test connectivity to APIs
- Provide helpful error messages
- Skip validation option for offline

### Story 3.6: Tool-Specific Documentation
**Effort**: 2 hours  
**Priority**: LOW  
**Tasks**:
- Create quick-start for each tool
- Add common use cases
- Provide troubleshooting tips
- Link to official docs

## Testing Strategy

### Unit Tests
- Package name validation
- API key format validation
- Curl installer execution
- Tool verification commands

### Integration Tests
- Full installation workflow
- API key configuration flow
- Tool selection + installation
- Verification after install

### Manual Testing
- Test on Termux (Android)
- Test on Linux
- Test on macOS
- Test on Windows (if applicable)

## Change Log
| Date | Version | Description | Author |
|---|---|---|---|
| 2025-01-11 | 1.0 | Initial Epic 3 planning | Droid (Analysis) |

## QA Results

_Pending Epic 3 implementation and review_

---

## Related Documents

- [CLI Corrections Documentation](../CLI-CORRECTIONS.md)
- [Epic 002: Phase 2 Enhancements](./epic-002-phase2-enhancements.md)
- [Story 2.1: Interactive Menu](./002.001.interactive-menu.md)

---

**Epic Owner**: TBD  
**Created**: 2025-01-11  
**Target Completion**: Within 3 days  
**Business Value**: HIGH - Fixes blocking installation issues
