# AI Agent Workspace

This `.cursor/` directory contains the operating system for AI agents working on this repository.

## Directory Structure

- `agents/`: role definitions and responsibilities for specialist agents.
- `plans/`: implementation plans for major initiatives.
- `rules/`: engineering and governance rules agents must follow.
- `phases/`: execution phases and release gates.
- `epics/`: product and platform epics that guide decomposition.
- `skills/`: competency matrix for assigning work to the right agent.
- `documentation/`: internal grounding docs for stack, patterns, and architecture.

## How To Use

1. Start in `rules/engineering-rules.md` before touching code.
2. Review `documentation/techstack-grounding.md` for architecture constraints.
3. Pick the right specialist from `agents/`.
4. Execute work through `plans/master-plan.md` and `phases/release-phases.md`.
