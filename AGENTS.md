# SimpleMarkmap AGENTS.md

## Identity
You are an autonomous software engineering agent operating within the **SimpleMarkmap** project (an Electron desktop markdown mindmap editor). You rely on Interpretable Context Methodology (ICM) and Karpathy-style simplicity principles.

## Routing
- **Current State & Session History:** `MONITORING/` *(mandatory start: read `MONITORING/STATE.md` first)*
- **Project Context & Build Summary:** `CONTEXT.md`
- **Harness & Self-Verification Framework:** `harness/HARNESS.md` *(Goal-Driven, Verification Loop, Error→Rule registry)*
- **Electron & Server Code:** `src/`
- **UI & Renderer:** `public/`
- **Test Suite:** `tests/`
- **Launcher Scripts (Root):** `run.bat`, `launch.vbs`
- **Documentation & Decisions:** `docs/`
- **UI Automation Skill:** `docs/ui-automation/`
- **Sample Maps:** `maps/`

## Commands
- `npm run harness` – full self-verification loop (constraints → tests → PASS/BLOCK verdict)
- `npm run harness:constraints` – constraint-only fail-fast check
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
3. **Harness Self-Verification (mandatory):** After every change, run `npm run harness` yourself before reporting done. It runs constraints → unit tests and returns a **PASS − 0 issues** or **BLOCKED** verdict. Never report a job done while a gate is red.
4. **Goal-Driven Execution:** Write an acceptance statement *before* coding: **Goal / Verify by / Fails if**. Loop until **Verify by** passes. Do not execute vague instructions ("fix the bug") — decode them into measurable criteria.
5. **Generator/Evaluator split:** For non-trivial changes, do a critical re-read of your own diff (Evaluator pass) hunting for regressions + the failure signatures in `harness/error-rules.md`. Merge only on **PASS**.
6. **One Error, One Rule:** Every mistake appends one row to `harness/error-rules.md` (Date / Error / Root cause / Rule / Enforce via). The rule must map to an enforceable mechanism. Never rewrite the file; append.
7. **Think Before Coding:** Clarify goals and state assumptions. Avoid over-engineering (Simplicity First).
8. **Surgical Changes:** Edit only what is necessary. Match existing style. Remove orphaned code created by your changes.
9. **Environment & Safety Constraints:**
   - Do not edit `dist/` (build artifact).
   - Manual agent processes must not use raw `taskkill` (note: automated deterministic startup scripts like `run.bat` may safely clean up port 8765 listeners).
   - Do not hardcode user paths.
   - Application supports opening Markdown files from any local absolute/relative path.
   - **Architectural Invariants:** This project does not use a database, does not use external APIs (beyond OmniRoute gateway), and does not use CSS frameworks. These constraints prune the agent's reasoning space.
10. **Completion & Handover:**
   - After verification (`npm run harness` and build to `C:\sm-build\out`), update `CONTEXT.md` and `MONITORING/STATE.md`.
   - **Mandatory Final Action:** Always execute `git add`, `git commit`, and `git push` before finishing work.
   - **Clean-Pass Explicit Definitions:** If a verification run finds no errors, state **"PASS — 0 issues"** in the LOGBOOK entry to prevent hallucinating improvements.
