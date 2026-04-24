# AI Agent Workspace

This `.cursor/` directory is the execution system for building and launching Rova Credit Africa.

## Directory Structure
- `agents/`: specialist agent responsibilities and collaboration model.
- `plans/`: implementation plans, sequencing, and quality gates.
- `rules/`: engineering and security rules.
- `phases/`: phase-by-phase scope and exit criteria.
- `epics/`: epic definitions and story maps.
- `skills/`: competency matrix for staffing work.
- `documentation/`: technical grounding (approved stack, architecture constraints).
- `prompts/`: laser-focused prompts for each phase and epic.

## How teams should execute
1. Start with `documentation/techstack-grounding.md`.
2. Follow `plans/implementation-plan-v1.md` and `phases/release-phases.md`.
3. Implement stories from `epics/epic-stories.md`.
4. Enforce quality gates from `plans/testing-implementation-plan.md`.
5. Use prompts in `prompts/` to assign scoped tasks to agents.
