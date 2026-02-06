"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_TEMPLATE: () => DEFAULT_TEMPLATE,
  formatHistory: () => formatHistory,
  formatWorkingMemory: () => formatWorkingMemory,
  getWorkingMemoryInstructions: () => getWorkingMemoryInstructions
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_TEMPLATE,
  formatHistory,
  formatWorkingMemory,
  getWorkingMemoryInstructions
});
//# sourceMappingURL=index.cjs.map