// Hooks system for programmatic enforcement of safety constraints
// SimpleMarkmap ICM Harness Engineering

const fs = require('fs');
const path = require('path');

// Constraints that MUST be enforced programmatically
const CONSTRAINTS = {
  // Safety red lines - these are "laws" not suggestions
  safety: {
    // Prevent deletion of MONITORING directory contents
    preventMonitoringDeletion: {
      check: (filePath) => {
        const monitoringDir = path.resolve('MONITORING');
        return filePath.startsWith(monitoringDir);
      },
      violationMessage: 'ERROR: Cannot delete or modify files in MONITORING/ - this is a protected constraint layer'
    },
    // Prevent editing dist/ build artifacts
    preventDistEditing: {
      check: (filePath) => {
        const distDir = path.resolve('dist');
        return filePath.startsWith(distDir);
      },
      violationMessage: 'ERROR: Cannot edit dist/ - this is a build artifact, not a source file'
    },
    // Prevent hardcoding user paths
    preventHardcodedPaths: {
      check: (content) => {
        const hardcodedPatterns = [
          /C:\\Users\\\\[^\\]+/g,
          /C:\\Program Files/g
        ];
        return hardcodedPatterns.some(p => p.test(content));
      },
      violationMessage: 'ERROR: Hardcoded user paths detected - use environment variables or config files instead'
    }
  },
  
  // Rule hierarchy enforcement
  ruleHierarchy: {
    // Root AGENTS.md must stay under 100 lines
    agentsMdLineLimit: {
      check: () => {
        const agentsMdPath = path.resolve('AGENTS.md');
        if (fs.existsSync(agentsMdPath)) {
          const content = fs.readFileSync(agentsMdPath, 'utf8');
          const lineCount = content.split('\n').length;
          return lineCount > 100;
        }
        return false;
      },
      violationMessage: 'ERROR: Root AGENTS.md exceeds 100 lines - move stage-specific rules to local CONTEXT.md files'
    }
  }
};

// Pre-tool use hook - intercepts agent actions
function preToolUse(toolName, toolArgs) {
  // Check safety constraints
  const safetyChecks = Object.values(CONSTRAINTS.safety);
  
  // Check for hardcoded paths in content edits
  if (toolName === 'write' || toolName === 'edit') {
    const content = toolArgs.newString || '';
    const hardcodedCheck = CONSTRAINTS.safety.preventHardcodedPaths.check(content);
    if (hardcodedCheck) {
      return { 
        error: hardcodedCheck.violationMessage,
        abort: true 
      };
    }
  }
  
  // Check rule hierarchy
  if (toolName === 'write' && toolArgs.filePath === 'AGENTS.md') {
    const hierarchyCheck = CONSTRAINTS.ruleHierarchy.agentsMdLineLimit.check();
    if (hierarchyCheck) {
      return { 
        error: hierarchyCheck.violationMessage,
        abort: true 
      };
    }
  }
  
  return { abort: false };
}

// Post-tool use hook - records outcomes
function postToolUse(toolName, result) {
  // Log significant actions to MONITORING
  if (result && result.error) {
    // Error events go to logbook
    console.log(`[HOOK] ${toolName} error: ${result.error}`);
  }
  
  return { continue: true };
}

// Export for use by the framework
module.exports = { preToolUse, postToolUse, CONSTRAINTS };