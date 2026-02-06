import { Redis } from '@upstash/redis';
import { d as MemoryProvider, e as MemoryScope, W as WorkingMemory, C as ConversationMessage, U as UIMessage, a as ChatSession } from '../types-CTmklkd-.js';

/**
 * Configuration options for UpstashProvider
 */
interface UpstashProviderOptions {
    /** Key prefix for all Redis keys (default: "memory:") */
    prefix?: string;
    /** TTL in seconds for message lists (default: no expiration) */
    messageTtl?: number;
}
/**
 * Upstash Redis provider - serverless edge
 */
declare class UpstashProvider implements MemoryProvider {
    private redis;
    private readonly messageTtl?;
    private readonly prefix;
    constructor(redis: Redis, options?: UpstashProviderOptions);
    getWorkingMemory(params: {
        chatId?: string;
        userId?: string;
        scope: MemoryScope;
    }): Promise<WorkingMemory | null>;
    updateWorkingMemory(params: {
        chatId?: string;
        userId?: string;
        scope: MemoryScope;
        content: string;
    }): Promise<void>;
    saveMessage(message: ConversationMessage): Promise<void>;
    getMessages<T = UIMessage>(params: {
        chatId: string;
        userId?: string;
        limit?: number;
    }): Promise<T[]>;
    saveChat(chat: ChatSession): Promise<void>;
    getChats(params: {
        userId?: string;
        search?: string;
        limit?: number;
    }): Promise<ChatSession[]>;
    getChat(chatId: string): Promise<ChatSession | null>;
    updateChatTitle(chatId: string, title: string): Promise<void>;
    deleteChat(chatId: string): Promise<void>;
    private getKey;
}

export { UpstashProvider, type UpstashProviderOptions };
