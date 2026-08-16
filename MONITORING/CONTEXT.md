# Monitoring

`MONITORING/` preserves operational history and provides the evidence needed to understand how the workspace reached its current condition.

## Purpose

Monitoring protects three things:

1. **Continuity** — work can resume after context loss, interruption, or handover.
    
2. **Traceability** — significant actions and decisions can be reconstructed.
    
3. **Learning** — recurring failures and process patterns can be identified and corrected.
    

Monitoring is not a transcript of agent activity. It records information that remains useful after the immediate task has ended.

---

## Persistence Model

The workspace has two distinct memory layers:

### Current State

[STATE](STATE.md)

[STATE](STATE.md) describes the **current operational condition**.

Use it to answer:

- What is being worked on?
    
- Where is the work?
    
- What has been completed?
    
- What remains?
    
- What is blocked?
    
- What is the last verified checkpoint?
    
- What must happen next?
    

**STATE.md records the consequence.**

It should remain concise and operational. Historical detail belongs in the Logbook.

### Historical Record

LOGBOOK/

The Logbook records significant **events, decisions, failures, transitions, and evidence**.

Use it to answer:

- What happened?
    
- Why did it happen?
    
- What was attempted?
    
- What succeeded or failed?
    
- What decision was made?
    
- What evidence supports the conclusion?
    
- Has this problem occurred before?
    

**The Logbook records the event.**

The Logbook is historical memory, not the current state.

---

## Core Doctrine

### Rule of Consequence

> **[STATE](STATE.md) records the consequence; the Logbook records the event.**

An event may therefore require both:

- update `STATE.md` if it changes the current operational condition;
    
- add a Logbook entry if the event is historically significant.
    

Do not duplicate the same information unnecessarily.

### Rule of Recovery

A future agent must be able to determine a safe continuation point without access to the previous conversation.

If the current state cannot be recovered from `STATE.md`, repair `STATE.md`.

If understanding the state requires historical reasoning, consult the relevant Logbook entries.

### Rule of Evidence

Important claims about what happened should be traceable to artifacts, commands, files, tests, decisions, or other observable evidence whenever such evidence exists.

Do not manufacture historical certainty from memory.

### Rule of Signal

Monitoring is not a transcript.

Do not create historical records merely because an action occurred. Preserve information that has future operational, diagnostic, audit, or learning value.

### Rule of Locality

Monitoring instructions belong as close as possible to the system they govern.

This file routes to the monitoring systems. Detailed Logbook rules belong in LOGBOOK/CONTEXT.md, and entry structure belongs in the relevant templates.

---

## When to Read

### Read `STATE.md`

Read [STATE](STATE.md) when:

- starting a session or resuming work;
    
- picking up an existing task;
    
- entering an existing workspace;
    
- recovering after interruption or context loss;
    
- taking over from another agent or operator;
    
- the current task or checkpoint is uncertain;
    
- a status/pickup report is requested;
    
- the workspace does not match the expected state.
    

Do not repeatedly reload it when the current state is already known and unchanged.

### Read the Logbook

Read **LOGBOOK/** selectively when:

- the history behind a decision matters;
    
- investigating an error or regression;
    
- continuing an earlier design discussion;
    
- reconstructing how the current state was reached;
    
- investigating recurring process failures;
    
- performing an audit or evidence review;
    
- `STATE.md` does not adequately explain the situation.
    

Do not load the entire Logbook by default.

---

## When to Update

### Update `STATE.md`

Update [STATE](STATE.md) when the **current operational state changes materially**, especially after:

- a significant milestone;
    
- a workspace or task transition;
    
- a significant decision affecting future work;
    
- an error that changes the recovery position;
    
- creation or modification of important artifacts;
    
- validation or review-gate completion;
    
- handover;
    
- context compaction or imminent restart;
    
- session termination.
    

Follow [STATE_instructions](STATE_instructions.md) for the update procedure.

### Add a Logbook Entry

Add a Logbook entry when an event has durable historical value, including:

- completed jobs requiring a touchdown;
    
- significant design or strategic decisions;
    
- meaningful failures or unexpected behavior;
    
- session/agent handovers;
    
- completed features or major development stages;
    
- audit or evidence events;
    
- information needed to diagnose recurring system drift.
    

Follow [LOGBOOK/CONTEXT.md](LOGBOOK/CONTEXT.md)

---

## Automation Boundary

Deterministic information should be produced by tooling whenever practical rather than reconstructed by the agent.

Examples include:

- timestamps;
    
- model/version metadata;
    
- execution identifiers;
    
- command results;
    
- changed-file lists;
    
- test results;
    
- job completion markers;
    
- machine-readable status fields.
    

Agents should provide the **semantic interpretation** of events; scripts should provide deterministic facts wherever possible.

Automation must not silently replace the current-state contract. If an automated process detects that persisted state is stale or inconsistent, the discrepancy must be resolved.

---

## Handover Contract

A handover is successful only when a new agent can resume from the persisted workspace without relying on the previous conversation.

Before handover:

**Input**

- current workspace
    
- current task
    
- current state
    
- unfinished work
    
- relevant decisions
    
- known blockers
    

**Process**

1. Verify the current filesystem state.
    
2. Update `STATE.md`.
    
3. Record historically significant handover information in the Logbook.
    
4. Identify the next safe action.
    

**Output**

`STATE.md` must expose:

- objective;
    
- current location;
    
- current stage;
    
- completed work;
    
- unfinished work;
    
- blockers;
    
- last verified checkpoint;
    
- next action;
    
- relevant active decisions.
    

Historical detail should remain in the Logbook rather than being copied wholesale into `STATE.md`.

---

## Failure Handling

When an operation fails:

1. Preserve the last known successful checkpoint.
    
2. Record the failure when it has historical or diagnostic value.
    
3. Update `STATE.md` if the failure changes the current recovery position.
    
4. Do not claim successful completion when verification failed.
    
5. If recovery depends on historical context, inspect the relevant Logbook entries.
    

Where deterministic validation rules exist, automation should enforce them before the workflow proceeds.

---

## Monitoring Outputs

The primary monitoring outputs are:

- **Current state** → `STATE.md`
    
- **Historical events** → `MONITORING/LOGBOOK/`
    
- **Standardized job record** → `LOGBOOK/CC_TOUCHDOWN.md`
    
- **Deterministic metadata/harvesting** → `MONITORING/scripts/`
    

Monitoring should evolve from observed operational needs. Do not introduce additional procedures, schemas, or automation merely for theoretical completeness.

---

## Navigation

| Need                         | Read                                                 |
| ---------------------------- | ---------------------------------------------------- |
| Current state                | [STATE](STATE.md)                                    |
| State maintenance rules      | [STATE_instructions](STATE_instructions.md)          |
| Monitoring overview          | [CONTEXT](CONTEXT.md)                                |
| Logbook rules                | [LOGBOOK/CONTEXT.md](LOGBOOK/CONTEXT.md)             |
| Historical events            | LOGBOOK/                                             |

**Principle:** Keep current state small, history durable, schemas explicit, and deterministic facts automated wherever practical.
