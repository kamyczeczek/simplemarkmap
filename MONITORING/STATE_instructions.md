### **STATE.md Update Instructions & Protocols**

#### **1. Operational Purpose**

- **Maintain Session Continuity**: Treat `STATE.md` as the "long-term memory" of the project, allowing subsequent AI agents to inherit the exact progress without re-explaining context.
- **Variable Data Only**: Use this file strictly for run-specific details.
- **Machine Readability**: Keep the document concise and formatted with clear Markdown headers so that agents can parse it instantly via the `read_file` tool.

#### **2. Mandatory Content Sections**

- **Current Situation**: Explicitly state the active numbered pipeline stage or maintenance status.
- **Recently Completed**: List specific artifacts, file changes, or validations committed during the current session.
- **In Progress**: Detail tasks that are partially finished, including specific percentages or line-item status.
- **Blockers & Decisions**: Record any unresolved tradeoffs, missing data, or specific user-approved decisions that impact future logic.
- **Best Next Move**: Provide a single, actionable instruction for the "future self" session to execute immediately upon startup.

#### **3. Update Triggers (When to Write)**

- **Session Termination**: Perform a mandatory update before sending the final message to the user.
- **Token Limit Threshold**: If the context window is nearing capacity and coherence is likely to drop, summarize the state immediately before a session restart.
- **Milestone Completion**: Update the file after finishing a major stage or hitting a defined human review gate.
- **Context Shifts**: Update whenever moving from one workspace or sub-task to another to ensure state is captured on disk.

#### **4. Verification Protocols**

- **Verify from Disk**: Do not rely on internal model memory; use tools like `ls` or `read_file` to confirm that reported artifacts actually exist on the filesystem.
- **Accuracy of Failure**: If a task failed, the state must reflect the error and the last successful checkpoint rather than assuming a "happy path".
- **Timestamping**: Log the exact time of the last refresh to ensure the timeline of changes is auditable for the user.

#### **5. Technical Constraints**

- **Strict Length Limit**: Keep the file under 80 lines of text to minimize token consumption during the next session's "pickup" phase.
- **The Pickup Command**: Ensure the file is structured to be read immediately by the next agent using a standard "pickup" or "handoff" prompt.
- **Sync with Stage Contracts**: When a stage is marked as complete in `STATE.md`, ensure the corresponding "Output" section in the local `CONTEXT.md` is also verified.
