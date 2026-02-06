// src/providers/drizzle.ts
import { and, desc, eq, like, or, sql } from "drizzle-orm";

// src/providers/drizzle-schema.ts
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

// src/providers/drizzle.ts
var DrizzleProvider = class {
  constructor(db, config) {
    this.db = db;
    this.config = config;
  }
  async getWorkingMemory(params) {
    const id = this.getId(params.scope, params.chatId, params.userId);
    const { workingMemoryTable } = this.config;
    const result = await this.db.select().from(workingMemoryTable).where(eq(workingMemoryTable.id, id)).limit(1);
    if (!result.length) return null;
    const row = result[0];
    return {
      content: row.content,
      updatedAt: new Date(row.updatedAt)
    };
  }
  async updateWorkingMemory(params) {
    const id = this.getId(params.scope, params.chatId, params.userId);
    const { workingMemoryTable } = this.config;
    const now = /* @__PURE__ */ new Date();
    const existing = await this.db.select().from(workingMemoryTable).where(eq(workingMemoryTable.id, id)).limit(1);
    if (existing.length > 0) {
      await this.db.update(workingMemoryTable).set({
        content: params.content,
        updatedAt: now
      }).where(eq(workingMemoryTable.id, id));
    } else {
      await this.db.insert(workingMemoryTable).values({
        id,
        scope: params.scope,
        chatId: params.chatId || null,
        userId: params.userId || null,
        content: params.content,
        updatedAt: now
      });
    }
  }
  async saveMessage(message) {
    const { messagesTable } = this.config;
    await this.db.insert(messagesTable).values({
      chatId: message.chatId,
      userId: message.userId || null,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp
    });
  }
  async getMessages(params) {
    const { messagesTable } = this.config;
    const whereConditions = [
      eq(messagesTable.chatId, params.chatId)
    ];
    if (params.userId) {
      whereConditions.push(
        or(
          eq(messagesTable.userId, params.userId),
          eq(messagesTable.userId, null)
        )
      );
    }
    const whereCondition = whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions);
    const result = await this.db.select().from(messagesTable).where(whereCondition).orderBy(
      desc(messagesTable.timestamp),
      desc(
        sql`CASE WHEN ${messagesTable.role} = 'assistant' THEN 1 ELSE 0 END`
      )
    ).limit(params.limit || 100);
    return result.map((row) => {
      let content = row.content;
      try {
        if (typeof row.content === "string") {
          const parsed = JSON.parse(row.content);
          content = parsed;
        }
      } catch {
      }
      return content;
    }).reverse();
  }
  async saveChat(chat) {
    const { chatsTable } = this.config;
    if (!chatsTable) return;
    const existing = await this.db.select().from(chatsTable).where(eq(chatsTable.chatId, chat.chatId)).limit(1);
    if (existing.length > 0) {
      await this.db.update(chatsTable).set({
        userId: chat.userId || null,
        title: chat.title || existing[0].title || null,
        updatedAt: chat.updatedAt,
        messageCount: chat.messageCount
      }).where(eq(chatsTable.chatId, chat.chatId));
    } else {
      await this.db.insert(chatsTable).values({
        chatId: chat.chatId,
        userId: chat.userId || null,
        title: chat.title || null,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat.messageCount
      });
    }
  }
  async getChats(params) {
    const { chatsTable } = this.config;
    if (!chatsTable) return [];
    const conditions = [];
    if (params.userId) {
      conditions.push(eq(chatsTable.userId, params.userId));
    }
    if (params.search) {
      conditions.push(like(chatsTable.title, `%${params.search}%`));
    }
    let query = this.db.select().from(chatsTable);
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
    }
    query = query.orderBy(desc(chatsTable.updatedAt));
    if (params.limit) {
      query = query.limit(params.limit);
    }
    const result = await query;
    let chats = result.map((row) => ({
      chatId: row.chatId,
      userId: row.userId || void 0,
      title: row.title || void 0,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      messageCount: row.messageCount
    }));
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      chats = chats.filter(
        (chat) => chat.title?.toLowerCase().includes(searchLower)
      );
    }
    return chats;
  }
  async getChat(chatId) {
    const { chatsTable } = this.config;
    if (!chatsTable) return null;
    const result = await this.db.select().from(chatsTable).where(eq(chatsTable.chatId, chatId)).limit(1);
    if (!result.length) return null;
    const row = result[0];
    return {
      chatId: row.chatId,
      userId: row.userId || void 0,
      title: row.title || void 0,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      messageCount: row.messageCount
    };
  }
  async updateChatTitle(chatId, title) {
    const { chatsTable } = this.config;
    if (!chatsTable) return;
    const existing = await this.db.select().from(chatsTable).where(eq(chatsTable.chatId, chatId)).limit(1);
    if (existing.length > 0) {
      await this.db.update(chatsTable).set({
        title,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(chatsTable.chatId, chatId));
    } else {
      await this.saveChat({
        chatId,
        title,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        messageCount: 0
      });
    }
  }
  async deleteChat(chatId) {
    const { chatsTable, messagesTable } = this.config;
    if (messagesTable) {
      await this.db.delete(messagesTable).where(eq(messagesTable.chatId, chatId));
    }
    if (chatsTable) {
      await this.db.delete(chatsTable).where(eq(chatsTable.chatId, chatId));
    }
  }
  getId(scope, chatId, userId) {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
};
export {
  DrizzleProvider,
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
};
//# sourceMappingURL=drizzle.js.map