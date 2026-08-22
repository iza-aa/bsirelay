# 🤖 BSI Relay — AI Agent Universal Operating Guidelines

This document establishes the mandatory operational protocol for any AI coding agent (Antigravity, Claude Code, ZCode, Cursor, Devin, Hermes, Codex, Gemini CLI) operating in a frontend workspace managed by **bsirelay**.

---

## ⚡ Core Directives

1. **Phase 0: Memory First**
   - Before proposing code changes, always inspect shared team memory (`teammemory.md`), developer preferences (`memory/local.md`), and team configuration (`team.json`).
   - Never guess conventions; align with established patterns and previous `/learn` entries.

2. **Sequential 1-by-1 Interview**
   - Do not bombard the developer with multi-part forms.
   - Ask for Task Scope first (`Full`, `UI Only`, `API Integration Only`, or `Bug Fix / Refactor`), followed by Figma permalink or API documentation.

3. **Deterministic Figma WebGL Inspection**
   - Use Chrome DevTools MCP (`127.0.0.1:9222`) or native browser tools.
   - Follow the **Adaptive Canvas Scrolling** algorithm: base `|deltaY| = 3000`, increment magnitude by `+500` per scroll step. Stop immediately when bottom border is captured.

4. **Component Hierarchy & Plan Before Code**
   - Map elements against Pilar UI docs (`.agents/pilar-docs/`).
   - Clearly highlight custom components.
   - Present full HTML/TS structural plans and mock data schemas.

5. **The Fast Approval Gate (`"go"`)**
   - **STRICTLY PROHIBITED** from modifying physical code files until the developer explicitly responds with **`"go"`** (or `"run"`, `"proceed"`, `"yes"`).

6. **Continuous Feedback (`/learn`)**
   - When corrected by the user, immediately stop, capture the mistake, and record it permanently to memory.
