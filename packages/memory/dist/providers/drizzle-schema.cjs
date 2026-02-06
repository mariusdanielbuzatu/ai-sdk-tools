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

// src/providers/drizzle-schema.ts
var drizzle_schema_exports = {};
__export(drizzle_schema_exports, {
  SQL_SCHEMAS: () => SQL_SCHEMAS,
  createMysqlChatsSchema: () => createMysqlChatsSchema,
  createMysqlMessagesSchema: () => createMysqlMessagesSchema,
  createMysqlWorkingMemorySchema: () => createMysqlWorkingMemorySchema,
  createPgChatsSchema: () => createPgChatsSchema,
  createPgMessagesSchema: () => createPgMessagesSchema,
  createPgWorkingMemorySchema: () => createPgWorkingMemorySchema,
  createSqliteChatsSchema: () => createSqliteChatsSchema,
  createSqliteMessagesSchema: () => createSqliteMessagesSchema,
  createSqliteWorkingMemorySchema: () => createSqliteWorkingMemorySchema
});
module.exports = __toCommonJS(drizzle_schema_exports);
function createPgWorkingMemorySchema() {
  return {
    id: (t) => t.text("id").primaryKey(),
    scope: (t) => t.text("scope").notNull(),
    chatId: (t) => t.text("chat_id"),
    userId: (t) => t.text("user_id"),
    content: (t) => t.text("content").notNull(),
    updatedAt: (t) => t.timestamp("updated_at").notNull()
  };
}
function createPgMessagesSchema() {
  return {
    id: (t) => t.serial("id").primaryKey(),
    chatId: (t) => t.text("chat_id").notNull(),
    userId: (t) => t.text("user_id"),
    role: (t) => t.text("role").notNull(),
    content: (t) => t.text("content").notNull(),
    timestamp: (t) => t.timestamp("timestamp").notNull()
  };
}
function createMysqlWorkingMemorySchema() {
  return {
    id: (t) => t.varchar("id", { length: 255 }).primaryKey(),
    scope: (t) => t.varchar("scope", { length: 50 }).notNull(),
    chatId: (t) => t.varchar("chat_id", { length: 255 }),
    userId: (t) => t.varchar("user_id", { length: 255 }),
    content: (t) => t.text("content").notNull(),
    updatedAt: (t) => t.timestamp("updated_at").notNull()
  };
}
function createMysqlMessagesSchema() {
  return {
    id: (t) => t.int("id").primaryKey().autoincrement(),
    chatId: (t) => t.varchar("chat_id", { length: 255 }).notNull(),
    userId: (t) => t.varchar("user_id", { length: 255 }),
    role: (t) => t.varchar("role", { length: 50 }).notNull(),
    content: (t) => t.text("content").notNull(),
    timestamp: (t) => t.timestamp("timestamp").notNull()
  };
}
function createSqliteWorkingMemorySchema() {
  return {
    id: (t) => t.text("id").primaryKey(),
    scope: (t) => t.text("scope").notNull(),
    chatId: (t) => t.text("chat_id"),
    userId: (t) => t.text("user_id"),
    content: (t) => t.text("content").notNull(),
    updatedAt: (t) => t.integer("updated_at", { mode: "timestamp" }).notNull()
  };
}
function createSqliteMessagesSchema() {
  return {
    id: (t) => t.integer("id").primaryKey({ autoIncrement: true }),
    chatId: (t) => t.text("chat_id").notNull(),
    userId: (t) => t.text("user_id"),
    role: (t) => t.text("role").notNull(),
    content: (t) => t.text("content").notNull(),
    timestamp: (t) => t.integer("timestamp", { mode: "timestamp" }).notNull()
  };
}
function createPgChatsSchema() {
  return {
    chatId: (t) => t.text("chat_id").primaryKey(),
    userId: (t) => t.text("user_id"),
    title: (t) => t.text("title"),
    createdAt: (t) => t.timestamp("created_at").notNull(),
    updatedAt: (t) => t.timestamp("updated_at").notNull(),
    messageCount: (t) => t.integer("message_count").notNull().default(0)
  };
}
function createMysqlChatsSchema() {
  return {
    chatId: (t) => t.varchar("chat_id", { length: 255 }).primaryKey(),
    userId: (t) => t.varchar("user_id", { length: 255 }),
    title: (t) => t.varchar("title", { length: 500 }),
    createdAt: (t) => t.timestamp("created_at").notNull(),
    updatedAt: (t) => t.timestamp("updated_at").notNull(),
    messageCount: (t) => t.int("message_count").notNull().default(0)
  };
}
function createSqliteChatsSchema() {
  return {
    chatId: (t) => t.text("chat_id").primaryKey(),
    userId: (t) => t.text("user_id"),
    title: (t) => t.text("title"),
    createdAt: (t) => t.integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: (t) => t.integer("updated_at", { mode: "timestamp" }).notNull(),
    messageCount: (t) => t.integer("message_count").notNull().default(0)
  };
}
var SQL_SCHEMAS = {
  postgresql: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id TEXT PRIMARY KEY,
        scope TEXT NOT NULL,
        chat_id TEXT,
        user_id TEXT,
        content TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id SERIAL PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        message_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `
  },
  mysql: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id VARCHAR(255) PRIMARY KEY,
        scope VARCHAR(50) NOT NULL,
        chat_id VARCHAR(255),
        user_id VARCHAR(255),
        content TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        chat_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        title VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        message_count INT NOT NULL DEFAULT 0
      );
      CREATE INDEX idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `
  },
  sqlite: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id TEXT PRIMARY KEY,
        scope TEXT NOT NULL,
        chat_id TEXT,
        user_id TEXT,
        content TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        message_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQL_SCHEMAS,
  createMysqlChatsSchema,
  createMysqlMessagesSchema,
  createMysqlWorkingMemorySchema,
  createPgChatsSchema,
  createPgMessagesSchema,
  createPgWorkingMemorySchema,
  createSqliteChatsSchema,
  createSqliteMessagesSchema,
  createSqliteWorkingMemorySchema
});
//# sourceMappingURL=drizzle-schema.cjs.map