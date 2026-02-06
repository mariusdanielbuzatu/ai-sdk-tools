// src/utils.ts
var DEFAULT_TEMPLATE = `# Working Memory

## Key Facts
- [Important information goes here]

## Current Focus
- [What the user is working on]

## Preferences
- [User preferences and settings]
`;
function formatWorkingMemory(memory) {
  if (!memory?.content) return "";
  return `
## Working Memory

${memory.content}
`;
}
function formatHistory(messages, limit = 10) {
  if (!messages.length) return "";
  const recent = messages.slice(-limit);
  const formatted = recent.map((m) => `**${m.role}**: ${m.content}`).join("\n\n");
  return `
## Recent Messages

${formatted}
`;
}
function getWorkingMemoryInstructions(template) {
  return `
## Working Memory

You have access to persistent working memory that stores user preferences, context, and important facts across conversations.

**ALWAYS call updateWorkingMemory when:**
- User shares OR corrects their name, role, company, or preferences
- User provides OR updates important facts you should remember
- User corrects previous information about themselves
- Any new or changed context that should persist for future conversations

**Template structure to follow:**
\`\`\`
${template}
\`\`\`

**Critical:** After calling updateWorkingMemory, respond to the user confirming the update.
`.trim();
}
export {
  DEFAULT_TEMPLATE,
  formatHistory,
  formatWorkingMemory,
  getWorkingMemoryInstructions
};
//# sourceMappingURL=index.js.map