// HARNESS verification loop — SimpleMarkmap
// Runs the self-verification loop described in harness/HARNESS.md:
//   constraints -> unit tests -> (optional e2e) -> clean-pass report.
// Exit code 0 = all green. 1 = a gate failed (Human works "on the loop").

const { execSync } = require("child_process");
const { preToolUse, CONSTRAINTS } = require("../hooks/init.js");
const fs = require("fs");
const path = require("path");

const GATES = [
  { name: "constraints", run: runConstraints },
  { name: "unit-tests", run: () => execSync("npm test", { stdio: "inherit" }) },
];

function runConstraints() {
  const result = preToolUse("test", {});
  if (result.error) {
    console.error(`\n[constraints] BLOCKED: ${result.error}`);
    return false;
  }
  const agentsMd = path.resolve("AGENTS.md");
  if (fs.existsSync(agentsMd)) {
    const lines = fs.readFileSync(agentsMd, "utf8").split("\n").length;
    if (lines > 100) {
      console.error(`\n[constraints] BLOCKED: AGENTS.md ${lines} lines (limit 100). Move stage rules to local CONTEXT.md.`);
      return false;
    }
  }
  console.log("\n[constraints] PASS");
  return true;
}

function shouldRunE2e() {
  // Never run full browser E2E during a routine verify; it needs a live app.
  // Invoke explicitly via: node harness/verify.js --e2e
  return process.argv.includes("--e2e");
}

function constraintsOnly() {
  return process.argv.includes("--constraints-only");
}

async function main() {
  let gates = [...GATES];
  if (constraintsOnly()) gates = gates.filter((g) => g.name === "constraints");
  if (shouldRunE2e()) gates.push({ name: "e2e", run: () => execSync("npm run test:e2e", { stdio: "inherit" }) });

  let allPass = true;
  console.log("=== HARNESS self-verification loop ===");
  for (const g of gates) {
    process.stdout.write(`\n[1/${gates.length}] ${g.name} ...`);
    try {
      const ok = await g.run();
      if (ok === false) { allPass = false; break; }
    } catch (e) {
      allPass = false;
      break;
    }
  }

  if (allPass) {
    console.log("\n\nVERDICT: PASS — 0 issues");
    process.exit(0);
  } else {
    console.log("\n\nVERDICT: BLOCKED — a gate failed. Fix then re-run `npm run harness`.");
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });