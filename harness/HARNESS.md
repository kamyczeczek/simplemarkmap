# HARNESS — SimpleMarkmap Verification Framework

This file turns the agent from a *babysat* chat partner into an **autonomous engineering collaborator**. It replaces "tell me what to fix" with **measurable success criteria** and makes the agent **verify its own work** before reporting done. It is the *Instruction + Constraint + Feedback* layer of the ICM harness.

## Doctrine (the 5 moves)

### 1. Goal-Driven Execution (not command-following)
Do not execute a vague instruction ("fix the bug"). Instead write an **acceptance statement** before coding:

> **Goal:** <measurable outcome>  
> **Verify by:** <test / command / observable that proves success>  
> **Fails if:** <concrete failure signature>

Then loop until **Verify by** passes. Example:
- Goal: Backspace edits last char instead of deleting node.
- Verify by: `npm run test` includes a passing case for backspace-edit.
- Fails if: node is removed from tree on Backspace.

### 2. Self-Verification Loop (Eyes)
After any change, the agent **runs the verification loop itself** — it does not wait for human acceptance. The loop is:
1. Run static checks: `node harness/verify.js --constraints`
2. Run unit tests: `npm test`
3. Run E2E where available: `npm run test:e2e`
4. Fragile path (`native dialogs`, `shell.openPath`): `npm run test:desktop`
5. If any step fails, **iterate** (fix → re-run) before declaring done.

The loop is wired to a single entrypoint: **`npm run harness`**. Run it after every work item.

### 3. Generator / Evaluator split (GAN-like)
For non-trivial changes, split roles into two passes:
- **Generator pass:** produce the solution (optimistic, broad).
- **Evaluator pass:** critically re-read the diff as if it were a stranger's code; hunt for regressions, edge cases, and the exact failure signatures in `harness/error-rules.md`. Report a verdict (PASS/BLOCK) and concrete fixes.
Only merge after the Evaluator pass returns **PASS**.

### 4. One Error, One Rule (memory)
Every mistake the agent makes **appends one rule** to `harness/error-rules.md`. This is enforced as a **constraint**, not advice: if `harness/verify.js --constraints` detects a repeated pattern that already has a rule and the rule was not followed, the loop **FAILS**. This is how the harness "learns" and prevents recurrence.

### 5. Background Loops (on the loop, not in the loop)
Repetitive hygiene is delegated to autonomous loops the human designed once:
- Documentation cleanliness: re-serialize `HARNESS.md`, `AGENTS.md`, `CONTEXT.md` on changes.
- Log discipline: every session terminates with a LOGBOOK entry (see `MONITORING/CONTEXT.md`).
- Triage: on `npm test` failures, the verify loop auto-tags the failing test as the "one error" seed for a new rule.

The human works **on the loop** (designing environment + laws), not **in the loop** (fixing trivial mistakes).

## Command Surface
| Command | Meaning |
|---|---|
| `npm run harness` | Full self-verification loop (constraints → unit → report) |
| `npm run harness:constraints` | Constraint-only check (fail-fast on law violations) |
| `node harness/error-rules.md` | Human/agent append-only error→rule registry |
| `npm run build:safe` | Build (already gated by `node hooks/init.js`) |

## The Checklist (finish a job only when ALL green)
- [ ] Acceptance statement written (Goal / Verify / Fails-if)
- [ ] `npm run harness` passes
- [ ] One-error-one-rule honored (no new rule needed, or it was added)
- [ ] LOGBOOK touch-down entry appended (`MONITORING/LOGBOOK/`)
- [ ] STATE.md consequence updated (`MONITORING/STATE.md`)
- [ ] `npm run build:safe` succeeds (source change only)

## Hard constraints (interfaced via hooks/init.js)
- Do not edit `dist/`.
- Do not hardcode user paths.
- Do not delete/modify `MONITORING/` or `harness/error-rules.md` destructively.
- Do not `git push` while `npm run harness` is failing (verify first).