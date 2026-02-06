import { C as ConversationMessage, W as WorkingMemory } from './types-CTmklkd-.cjs';
export { a as ChatSession, b as ChatsConfig, G as GenerateSuggestionsConfig, c as GenerateTitleConfig, M as MemoryConfig, d as MemoryProvider, e as MemoryScope } from './types-CTmklkd-.cjs';

/**
 * Default working memory template
 */
declare const DEFAULT_TEMPLATE = "# Working Memory\n\n## Key Facts\n- [Important information goes here]\n\n## Current Focus\n- [What the user is working on]\n\n## Preferences\n- [User preferences and settings]\n";
/**
 * Format working memory for system prompt
 */
declare function formatWorkingMemory(memory: WorkingMemory | null): string;
/**
 * Format conversation history
 */
declare function formatHistory(messages: ConversationMessage[], limit?: number): string;
/**
 * Instructions for working memory
 */
declare function getWorkingMemoryInstructions(template: string): string;

export { ConversationMessage, DEFAULT_TEMPLATE, WorkingMemory, formatHistory, formatWorkingMemory, getWorkingMemoryInstructions };
