# Claude Code Instructions for BSI Relay

This repository uses **bsirelay** as its agentic workflow framework.

## 🚀 Available Commands & Skills
- `/setup`   - Interactive workspace onboarding & auto-install tools (`skills/setup/SKILL.md`)
- `/brain`   - Read team rules & developer preferences (`skills/brain/SKILL.md`)
- `/config`  - Manage workspace paths & doctor diagnostics (`skills/config/SKILL.md`)
- `/newtask` - Start task interview & Figma slicing (`skills/newtask/SKILL.md`)
- `/learn`   - Record human feedback & update persistent memory (`skills/learn/SKILL.md`)
- `/update`  - Distill feedback logs into permanent rules (`skills/update/SKILL.md`)

## 🛠️ CLI Shortcuts
- `npx bsirelay doctor` — Run preflight health checks
- `npx bsirelay status` — Display active configuration
- `npx bsirelay sync`   — Sync companion UI library documentation

## 🚦 Execution Rules
- Always load `teammemory.md` before executing tasks.
- Always wait for `"go"` approval before writing files.
