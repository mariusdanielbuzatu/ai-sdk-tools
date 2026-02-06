import { d as MemoryProvider, e as MemoryScope, W as WorkingMemory, C as ConversationMessage, U as UIMessage, a as ChatSession } from '../types-CTmklkd-.js';
export { SQL_SCHEMAS, createMysqlChatsSchema, createMysqlMessagesSchema, createMysqlWorkingMemorySchema, createPgChatsSchema, createPgMessagesSchema, createPgWorkingMemorySchema, createSqliteChatsSchema, createSqliteMessagesSchema, createSqliteWorkingMemorySchema } from './drizzle-schema.js';

/**
 * Generic Drizzle table interface for working memory
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
interface WorkingMemoryTable {
    id: any;
    scope: any;
    chatId: any;
    userId: any;
    content: any;
    updatedAt: any;
}
/**
 * Generic Drizzle table interface for conversation messages
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
interface ConversationMessagesTable {
    id: any;
    chatId: any;
    userId: any;
    role: any;
    content: any;
    timestamp: any;
}
/**
 * Generic Drizzle table interface for chat sessions
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
interface ChatsTable {
    chatId: any;
    userId: any;
    title: any;
    createdAt: any;
    updatedAt: any;
    messageCount: any;
}
/**
 * Configuration for Drizzle provider
 */
interface DrizzleProviderConfig<TWM extends WorkingMemoryTable, TMsg extends ConversationMessagesTable, TChat extends ChatsTable = ChatsTable> {
    /** Working memory table */
    workingMemoryTable: TWM;
    /** Conversation messages table */
    messagesTable: TMsg;
    /** Chat sessions table (optional) */
    chatsTable?: TChat;
}
/**
 * Drizzle ORM provider - works with PostgreSQL, MySQL, and SQLite
 *
 * @example
 * ```ts
 * import { drizzle } from 'drizzle-orm/postgres-js';
 * import { createWorkingMemoryTable, createMessagesTable } from '@ai-sdk-tools/memory';
 *
 * const db = drizzle(client);
 * const provider = new DrizzleProvider(db, {
 *   workingMemoryTable: createWorkingMemoryTable('working_memory'),
 *   messagesTable: createMessagesTable('conversation_messages')
 * });
 * ```
 */
declare class DrizzleProvider<TWM extends WorkingMemoryTable, TMsg extends ConversationMessagesTable, TChat extends ChatsTable = ChatsTable> implements MemoryProvider {
    private db;
    private config;
    constructor(db: any, config: DrizzleProviderConfig<TWM, TMsg, TChat>);
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
    private getId;
}

export { type ChatsTable, type ConversationMessagesTable, DrizzleProvider, type DrizzleProviderConfig, type WorkingMemoryTable };
