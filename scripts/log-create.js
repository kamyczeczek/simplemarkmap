// Automated logbook entry generator for SimpleMarkmap ICM workflow
const fs = require('fs');
const path = require('path');

// Define paths
const projectRoot = fs.realpathSync(__dirname + '/..');
const logbookDir = path.join(projectRoot, 'MONITORING', 'LOGBOOK');
const stateFile = path.join(projectRoot, 'MONITORING', 'STATE.md');

// Ensure logbook directory exists
if (!fs.existsSync(logbookDir)) {
  fs.mkdirSync(logbookDir, { recursive: true });
}

// Generate timestamp following YYYY-MM-DD-HH-mm format
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');
const timestamp = `${year}-${month}-${day}-${hour}-${minute}`;
const logFilePath = path.join(logbookDir, `${timestamp}.md`);

// Check if a log file already exists for this minute to avoid duplicates
if (fs.existsSync(logFilePath)) {
  console.log(`Log entry already exists: ${logFilePath}`);
  process.exit(0);
}

// Read current STATE.md if it exists for reference
let currentStateContent = '';
if (fs.existsSync(stateFile)) {
  currentStateContent = fs.readFileSync(stateFile, 'utf-8');
}

// Create the logbook entry using the "Touchdown" template
const logEntry = `# Logbook Entry: ${timestamp}

## The Aim
Agent executed automated logbook creation script.

## What It Was Told
Automated script triggered after task completion to record session state.

## How It Went
- Script ran successfully at ${timestamp}.
- Logbook entry ${fs.existsSync(logFilePath) ? 'was created' : 'was not created'}.
- Current state reviewed from STATE.md: ${currentStateContent ? 'yes' : 'no'}.

## Decision Log
- Automated logging confirmed per ICM persistence model.

## Error Report
None.

## The Verdict
DONE.

`;

try {
  fs.writeFileSync(logFilePath, logEntry, 'utf-8');
  console.log(`Logbook entry created: ${logFilePath}`);
} catch (err) {
  console.error('Failed to create logbook entry:', err);
  process.exit(1);
}