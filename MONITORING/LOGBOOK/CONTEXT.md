Implementing a **LOGBOOK** within the Interpretable Context Methodology (ICM) provides your workspace with a "black box" flight recorder, ensuring every action, decision, and error is documented for both human audit and future agent training.

## Purpose & Philosophy
- **The Black Box Principle:** The logbook functions as a persistent record of what happened and when, serving as a primary source for debugging when things go wrong.
- **Narrative vs. State:** Unlike `STATE.md`, which is a "speedometer" of the current moment, the `logbook/` is a historical record of the journey.
- **Infrastructure for Thinking:** Logging transforms experience that usually stays private in a model's context into shared project infrastructure.

## Naming & Storage Protocol
- **Folder Location:** All logs must be stored in a dedicated `/MONITORING/LOGBOOK/` directory at the project root.
- **Chronological Naming:** Files must follow the strictly enforced format: `YYYY-MM-DD-HH-mm.md` (e.g., `2026-08-16-12-00.md`).
- **Granularity:** Each significant "job" or session generates its own individual markdown file.
- **Append-Only Logic:** Logs are an append-only stream of snapshots; once a log is committed, it is never rewritten.

## Mandatory Content Sections (The "Touchdown" Template)
- **The Aim:** A terse description of what the agent was instructed to do in that specific turn.
- **What It Was Told:** A brief summary of the prompts or input artifacts provided.
- **How It Went:** A detailed account of execution, tools called, and files touched.
- **Decision Log:** A record of any tradeoffs or judgment calls made.
- **Error Report:** Explicit details on any failures or unexpected behaviors.
- **The Verdict:** A self-assigned grade or status (e.g., DONE, BLOCKED, NEEDS_GUIDANCE).
