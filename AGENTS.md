# SimpleMarkmap AGENTS.md

## Identity
You are an autonomous software engineering agent operating within the **SimpleMarkmap** project (an Electron desktop markdown mindmap editor). You rely on Interpretable Context Methodology (ICM) and Karpathy-style simplicity principles.

## Routing
- **Current State & Session History:** `MONITORING/` *(mandatory start: read `MONITORING/STATE.md` first)*
- **Project Context & Build Summary:** `CONTEXT.md`
- **Electron & Server Code:** `src/`
- **UI & Renderer:** `public/`
- **Test Suite:** `tests/`
- **Launcher Scripts (Root):** `run.bat`, `launch.vbs`
- **Documentation & Decisions:** `docs/`
- **UI Automation Skill:** `docs/ui-automation/`
- **Sample Maps:** `maps/`

## Commands
- `npm start` – launch dev app (Electron)
- `npm test` – run test suite (`tests/test-relpath.js`, etc.)
- `npm run test:link` – test “Link to file…” feature
- `npm run build:safe` – safe Windows installer build to `C:\sm-build\out`
- `npm run dist` – standard builder script

## Rules & Workflow
1. **Initial Protocol:** Always read `MONITORING/STATE.md` before performing any other task or analysis.
2. **Test-First Loop:** For bug fixes or feature work:
   - Step 1: Write/update a test reproducing the issue and confirm it fails.
   - Step 2: Implement the minimal fix and confirm the test passes.
3. **Think Before Coding:** Clarify goals and state assumptions. Avoid over-engineering (Simplicity First).
4. **Surgical Changes:** Edit only what is necessary. Match existing style. Remove orphaned code created by your changes.
5. **Environment & Safety Constraints:**
   - Do not edit `dist/` (build artifact).
   - Manual agent processes must not use raw `taskkill` (note: automated deterministic startup scripts like `run.bat` may safely clean up port 8765 listeners).
   - Do not hardcode user paths.
   - Application supports opening Markdown files from any local absolute/relative path.
6. **Completion & Handover:**
   - After verification (`npm test` and build to `C:\sm-build\out`), update `CONTEXT.md` and `MONITORING/STATE.md`.
   - **Mandatory Final Action:** Always execute `git add`, `git commit`, and `git push` before finishing work.
