# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research project implementing a structured specification-driven development workflow. It provides custom slash commands (`/specify`, `/plan`, `/tasks`, `/analyze`, `/clarify`, `/implement`) that guide feature development through a rigorous, constitution-based process with automated artifact generation and consistency checking.

## Architecture

### Command System
Custom slash commands in `.claude/commands/` orchestrate the workflow:
- **`/constitution`** - Create/update project constitution defining non-negotiable development principles
- **`/specify`** - Generate feature specification with requirements, user stories, acceptance criteria
- **`/clarify`** - Interactive Q&A to resolve ambiguities before planning
- **`/plan`** - Execute implementation planning: research, contracts, data models, quickstart guides
- **`/tasks`** - Generate ordered task list from plan artifacts (TDD-ordered, dependency-aware)
- **`/analyze`** - Consistency check across spec/plan/tasks for gaps, conflicts, constitution violations
- **`/implement`** - Execute tasks following constitution principles

### Template System
Templates in `.specify/templates/` define artifact structure:
- **`plan-template.md`** - Self-contained executable template for Phase 0-1 (research, design, contracts)
- **`spec-template.md`** - Feature specification format (requirements, stories, acceptance criteria)
- **`tasks-template.md`** - Task generation rules (TDD order, parallel markers, file references)
- **`agent-file-template.md`** - Base for generating agent-specific guidance (CLAUDE.md, copilot-instructions.md)

### Constitution Framework
`.specify/memory/constitution.md` is a **template-based, versioned governance document**:
- Defines project-specific non-negotiable principles (library-first, TDD, CLI interfaces, etc.)
- Uses placeholder tokens (`[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, etc.) replaced by `/constitution` command
- Enforces semantic versioning (MAJOR/MINOR/PATCH) with amendment tracking
- All commands validate against constitution; violations must be justified or rejected

## Workflow Execution

### Standard Feature Development Flow
```bash
# 1. Create feature specification
/specify "Feature description"
# Output: specs/###-feature-name/spec.md

# 2. Resolve ambiguities (if needed)
/clarify
# Updates: specs/###-feature-name/spec.md (Clarifications section)

# 3. Generate implementation plan
/plan
# Output: plan.md, research.md, data-model.md, contracts/, quickstart.md

# 4. Generate tasks from design
/tasks
# Output: tasks.md (numbered, ordered, TDD-compliant)

# 5. Validate consistency
/analyze
# Output: Report with coverage gaps, conflicts, constitution violations

# 6. Execute implementation
/implement
# Executes tasks.md following constitution
```

### Constitution Management
```bash
# Initialize or update constitution
/constitution "5 principles: Library-First, CLI Interface, Test-First, Integration Testing, Observability"

# Updates constitution + propagates to all templates
# Validates all existing specs/plans against new principles
```

## Key Patterns

### Artifact Interdependencies
- **spec.md** → `/plan` → generates research.md, data-model.md, contracts/
- **contracts/** → `/tasks` → generates contract test tasks
- **tasks.md** → `/analyze` → validates against spec.md requirements
- **constitution.md** → all commands → enforce principles at every phase

### Error Handling Gates
- `/plan` aborts if clarifications missing (use `/clarify` first)
- `/tasks` requires completed Phase 1 artifacts (research.md, contracts/)
- `/analyze` must run before `/implement` if CRITICAL issues found
- Constitution violations block execution unless explicitly justified in Complexity Tracking

### Parallel Execution Markers
Tasks with `[P]` suffix can run concurrently (independent files):
```
1. [P] Create User model (models/user.py)
2. [P] Create Order model (models/order.py)
3. Implement UserService (depends on task 1)
```

### Absolute Path Requirement
All file operations use absolute paths resolved from repository root. Commands run setup scripts (e.g., `.specify/scripts/bash/setup-plan.sh --json`) to get canonical paths.

## Command-Specific Notes

### `/plan` Command Scope
- **Executes**: Phase 0 (research), Phase 1 (design/contracts)
- **Stops before**: Phase 2 (task generation) - use `/tasks` for that
- **Updates**: Agent-specific file (CLAUDE.md, copilot-instructions.md) via `update-agent-context.sh`
- **Constitution gates**: Checks before research AND after design; blocks on violations

### `/analyze` Requirements
- Runs **only after** `/tasks` produces tasks.md
- Read-only analysis (never modifies files)
- Detects: duplications, ambiguities, underspecification, coverage gaps, constitution conflicts
- Severity levels: CRITICAL (blocks implementation), HIGH, MEDIUM, LOW
- Offers remediation plan (user must approve before any edits)

### `/clarify` Interactive Mode
- Loads spec.md, identifies ambiguous requirements (vague adjectives, unresolved TODOs)
- Asks targeted questions, records answers in `## Clarifications` section with session timestamps
- Must run before `/plan` if spec contains `NEEDS CLARIFICATION` or critical unknowns

## Project Structure
```
research/
├── .claude/
│   └── commands/           # Slash command definitions (*.md)
├── .specify/
│   ├── memory/
│   │   └── constitution.md # Versioned governance template
│   ├── templates/          # Artifact templates
│   └── scripts/bash/       # Helper scripts (setup, prerequisites, agent updates)
└── specs/
    └── ###-feature-name/   # Per-feature artifact directory
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── tasks.md
        ├── quickstart.md
        └── contracts/
```

## Template Token Conventions
Templates use `[ALL_CAPS_IDENTIFIER]` placeholders:
- `[PROJECT_NAME]` - Full project name
- `[FEATURE]` - Current feature being developed
- `[PRINCIPLE_N_NAME]` / `[PRINCIPLE_N_DESCRIPTION]` - Constitution principles
- `[CONSTITUTION_VERSION]` - Semantic version (MAJOR.MINOR.PATCH)
- `[RATIFICATION_DATE]` / `[LAST_AMENDED_DATE]` - ISO 8601 dates (YYYY-MM-DD)

Comments in templates (`<!-- Example: ... -->`) removed once replaced; explicitly justify any unresolved tokens.

## Important Constraints
- **Constitution is non-negotiable**: Violations require refactoring artifacts, not diluting principles
- **TDD mandatory**: Tests written → user approved → tests fail → implement (if specified in constitution)
- **No file modifications** during `/analyze` (strictly read-only analysis)
- **Incremental agent file updates**: Add only new tech/patterns from current plan; preserve manual edits
- **All commands validate prerequisites**: Use JSON output from setup scripts; abort with clear error if missing dependencies