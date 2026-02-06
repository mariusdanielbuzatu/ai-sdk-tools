/**
 * Schema helpers for Drizzle provider
 *
 * These helpers make it easy to create compatible table schemas
 * for any database backend (PostgreSQL, MySQL, SQLite).
 *
 * Note: These functions use `any` types because they accept Drizzle's
 * table builder objects which have different types for each database.
 * This is intentional to support all database backends.
 */
/**
 * Create a working memory table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable } from 'drizzle-orm/pg-core';
 * import { createPgWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = pgTable('working_memory', createPgWorkingMemorySchema());
 * ```
 */
declare function createPgWorkingMemorySchema(): {
    id: (t: any) => any;
    scope: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    content: (t: any) => any;
    updatedAt: (t: any) => any;
};
/**
 * Create a conversation messages table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable, serial } from 'drizzle-orm/pg-core';
 * import { createPgMessagesSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const messages = pgTable('conversation_messages', createPgMessagesSchema());
 * ```
 */
declare function createPgMessagesSchema(): {
    id: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    role: (t: any) => any;
    content: (t: any) => any;
    timestamp: (t: any) => any;
};
/**
 * Create a working memory table schema for MySQL
 *
 * @example
 * ```ts
 * import { mysqlTable } from 'drizzle-orm/mysql-core';
 * import { createMysqlWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = mysqlTable('working_memory', createMysqlWorkingMemorySchema());
 * ```
 */
declare function createMysqlWorkingMemorySchema(): {
    id: (t: any) => any;
    scope: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    content: (t: any) => any;
    updatedAt: (t: any) => any;
};
/**
 * Create a conversation messages table schema for MySQL
 */
declare function createMysqlMessagesSchema(): {
    id: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    role: (t: any) => any;
    content: (t: any) => any;
    timestamp: (t: any) => any;
};
/**
 * Create a working memory table schema for SQLite
 *
 * @example
 * ```ts
 * import { sqliteTable } from 'drizzle-orm/sqlite-core';
 * import { createSqliteWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = sqliteTable('working_memory', createSqliteWorkingMemorySchema());
 * ```
 */
declare function createSqliteWorkingMemorySchema(): {
    id: (t: any) => any;
    scope: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    content: (t: any) => any;
    updatedAt: (t: any) => any;
};
/**
 * Create a conversation messages table schema for SQLite
 */
declare function createSqliteMessagesSchema(): {
    id: (t: any) => any;
    chatId: (t: any) => any;
    userId: (t: any) => any;
    role: (t: any) => any;
    content: (t: any) => any;
    timestamp: (t: any) => any;
};
/**
 * Create a chat sessions table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable } from 'drizzle-orm/pg-core';
 * import { createPgChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = pgTable('chat_sessions', createPgChatsSchema());
 * ```
 */
declare function createPgChatsSchema(): {
    chatId: (t: any) => any;
    userId: (t: any) => any;
    title: (t: any) => any;
    createdAt: (t: any) => any;
    updatedAt: (t: any) => any;
    messageCount: (t: any) => any;
};
/**
 * Create a chat sessions table schema for MySQL
 *
 * @example
 * ```ts
 * import { mysqlTable } from 'drizzle-orm/mysql-core';
 * import { createMysqlChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = mysqlTable('chat_sessions', createMysqlChatsSchema());
 * ```
 */
declare function createMysqlChatsSchema(): {
    chatId: (t: any) => any;
    userId: (t: any) => any;
    title: (t: any) => any;
    createdAt: (t: any) => any;
    updatedAt: (t: any) => any;
    messageCount: (t: any) => any;
};
/**
 * Create a chat sessions table schema for SQLite
 *
 * @example
 * ```ts
 * import { sqliteTable } from 'drizzle-orm/sqlite-core';
 * import { createSqliteChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = sqliteTable('chat_sessions', createSqliteChatsSchema());
 * ```
 */
declare function createSqliteChatsSchema(): {
    chatId: (t: any) => any;
    userId: (t: any) => any;
    title: (t: any) => any;
    createdAt: (t: any) => any;
    updatedAt: (t: any) => any;
    messageCount: (t: any) => any;
};
/**
 * Example SQL for manual schema creation
 */
declare const SQL_SCHEMAS: {
    readonly postgresql: {
        readonly workingMemory: "\n      CREATE TABLE IF NOT EXISTS working_memory (\n        id TEXT PRIMARY KEY,\n        scope TEXT NOT NULL,\n        chat_id TEXT,\n        user_id TEXT,\n        content TEXT NOT NULL,\n        updated_at TIMESTAMP NOT NULL DEFAULT NOW()\n      );\n      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);\n    ";
        readonly messages: "\n      CREATE TABLE IF NOT EXISTS conversation_messages (\n        id SERIAL PRIMARY KEY,\n        chat_id TEXT NOT NULL,\n        user_id TEXT,\n        role TEXT NOT NULL,\n        content TEXT NOT NULL,\n        timestamp TIMESTAMP NOT NULL DEFAULT NOW()\n      );\n      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);\n    ";
        readonly chats: "\n      CREATE TABLE IF NOT EXISTS chat_sessions (\n        chat_id TEXT PRIMARY KEY,\n        user_id TEXT,\n        title TEXT,\n        created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),\n        message_count INTEGER NOT NULL DEFAULT 0\n      );\n      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);\n    ";
    };
    readonly mysql: {
        readonly workingMemory: "\n      CREATE TABLE IF NOT EXISTS working_memory (\n        id VARCHAR(255) PRIMARY KEY,\n        scope VARCHAR(50) NOT NULL,\n        chat_id VARCHAR(255),\n        user_id VARCHAR(255),\n        content TEXT NOT NULL,\n        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n      );\n      CREATE INDEX idx_working_memory_scope ON working_memory(scope, chat_id, user_id);\n    ";
        readonly messages: "\n      CREATE TABLE IF NOT EXISTS conversation_messages (\n        id INT PRIMARY KEY AUTO_INCREMENT,\n        chat_id VARCHAR(255) NOT NULL,\n        user_id VARCHAR(255),\n        role VARCHAR(50) NOT NULL,\n        content TEXT NOT NULL,\n        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n      );\n      CREATE INDEX idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);\n    ";
        readonly chats: "\n      CREATE TABLE IF NOT EXISTS chat_sessions (\n        chat_id VARCHAR(255) PRIMARY KEY,\n        user_id VARCHAR(255),\n        title VARCHAR(500),\n        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n        message_count INT NOT NULL DEFAULT 0\n      );\n      CREATE INDEX idx_chats_user ON chat_sessions(user_id, updated_at DESC);\n    ";
    };
    readonly sqlite: {
        readonly workingMemory: "\n      CREATE TABLE IF NOT EXISTS working_memory (\n        id TEXT PRIMARY KEY,\n        scope TEXT NOT NULL,\n        chat_id TEXT,\n        user_id TEXT,\n        content TEXT NOT NULL,\n        updated_at INTEGER NOT NULL\n      );\n      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);\n    ";
        readonly messages: "\n      CREATE TABLE IF NOT EXISTS conversation_messages (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        chat_id TEXT NOT NULL,\n        user_id TEXT,\n        role TEXT NOT NULL,\n        content TEXT NOT NULL,\n        timestamp INTEGER NOT NULL\n      );\n      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);\n    ";
        readonly chats: "\n      CREATE TABLE IF NOT EXISTS chat_sessions (\n        chat_id TEXT PRIMARY KEY,\n        user_id TEXT,\n        title TEXT,\n        created_at INTEGER NOT NULL,\n        updated_at INTEGER NOT NULL,\n        message_count INTEGER NOT NULL DEFAULT 0\n      );\n      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);\n    ";
    };
};

export { SQL_SCHEMAS, createMysqlChatsSchema, createMysqlMessagesSchema, createMysqlWorkingMemorySchema, createPgChatsSchema, createPgMessagesSchema, createPgWorkingMemorySchema, createSqliteChatsSchema, createSqliteMessagesSchema, createSqliteWorkingMemorySchema };
