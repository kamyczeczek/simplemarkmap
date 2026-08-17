# ERROR → RULE registry (one error, one rule)

**Convention:** Every mistake the agent makes appends ONE row. The rule must be enforceable in future work (tests, hooks, or a checklist), never just "be careful." This file is append-only; never rewrite history — add a row.

**Format:**
```
| Date | Error (what happened) | Root cause | Rule (how to prevent) | Enforce via |
```

| Date | Error | Root cause | Rule | Enforce via |
|---|---|---|---|---|
| 2026-08-17 | `ipcMain.handle("open-in-default-editor")` used `Return` (capital) → JS `SyntaxError: Unexpected reserved word` | Case-sensitivity: JS keyword is lower-case `return` | In main-process code, keywords (`return`, `const`, `if`) must be lowercase; proofread IPC handlers for capitalization | `harness/verify.js` runs `npm test`; validate with ESLint before commit |
| 2026-08-17 | `preload.js` exposed `OpenInDefaultEditor` (capital O) but renderer called `openInDefaultEditor` → runtime "function not found" | Exposed name vs caller name mismatch | The key exposed via `contextBridge` must match the caller exactly (camelCase, same string) | Evaluator re-read (Harness move 3); grep the exposed key vs its usage |
| 2026-08-17 | `build.bat` ran `node hooks\init.js` relative — resolved to `C:\Users\Mateusz\hooks\` → `MODULE_NOT_FOUND` | Relative path depended on CWD | Batch scripts must `cd /d "%~dp0"` to the project root, or use an absolute path `%PROJECT_DIR%\...` | `harness/verify.js` constraint gate; documented in HARNESS.md |
| 2026-08-17 | `node_modules/` missing → `electron-builder` "not recognized" | Dependencies not installed | After any environment/checkout change, run `npm install` before `npm run build:safe` | Verify loop step "unit-tests" fails fast if deps absent |
| 2026-08-17 | Deleting a node also deleted its newly-focused neighbor (Backspace/Delete) | Event bubbling: local `onNodeKey` handled delete, then bubbled to global document handler | In node key handlers, call `e.preventDefault()` + `e.stopPropagation()` once the node handler handles it | HARNESS move 2 (self-verify); keep `stopPropagation()` on the node delete path |
| 2026-08-17 | First opened map could not be reached via Back (empty history stack) | `openFile(lastFile, false)` suppressed push to history on load | Initial map must be pushed with `pushToHistory=true` so Back works from position 0 | Unit/e2e test asserting back-navigation from cold start |
| 2026-08-17 | Markdown bullets broke in Typora (`-` without space, or H7 `#######`) | Serializer emitted invalid Markdown (no space after marker, headings beyond H6) | Lists always serialize as `- `; headings clamp to `Math.min(6, depth)` | Parser/serializer round-trip test in `tests/` |

| 2026-08-18 | `onNodeMouseDown` was referenced from node `mousedown` listeners → `ReferenceError` prevented drag start | The handler was implemented as `dragState.mousedown`, but the renderer called a nonexistent global function | Node drag listeners must call `dragState.mousedown(e, div)` and remain covered by the harness evaluator | Harness evaluator re-read / constraint verification |
## How to add a rule
1. When verify fails or the human points out a repeated mistake, open this file.
2. Add one row capturing Error / Root cause / Rule / Enforce via.
3. The rule MUST map to an enforceable mechanism (test, hook, or verify gate) — not advice.
4. Append to `MONITORING/LOGBOOK/<timestamp>.md` with a link to this row.