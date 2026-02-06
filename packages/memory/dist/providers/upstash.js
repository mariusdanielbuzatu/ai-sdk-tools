// ../debug/dist/index.js
var isDebugEnabled = process.env.DEBUG_AGENTS === "true";
var colors = {
  reset: "\x1B[0m",
  gray: "\x1B[90m",
  blue: "\x1B[34m",
  cyan: "\x1B[36m",
  yellow: "\x1B[33m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  magenta: "\x1B[35m"
};
var timestamp = () => (/* @__PURE__ */ new Date()).toISOString().slice(11, 23);
function createLogger(category) {
  if (!isDebugEnabled) {
    return {
      debug: () => {
      },
      info: () => {
      },
      warn: () => {
      },
      error: () => {
      }
    };
  }
  return {
    debug: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.blue}DEBUG${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    info: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.green}INFO${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    warn: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.yellow}WARN${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.warn(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    error: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.red}ERROR${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.error(`${ts} ${level} ${cat} ${message}${dataStr}`);
    }
  };
}

// src/providers/upstash.ts
var logger = createLogger("UPSTASH");
var UpstashProvider = class {
  constructor(redis, options) {
    this.redis = redis;
    this.prefix = options?.prefix ?? "memory:";
    this.messageTtl = options?.messageTtl;
  }
  messageTtl;
  prefix;
  async getWorkingMemory(params) {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    return await this.redis.get(key);
  }
  async updateWorkingMemory(params) {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    logger.debug("updateWorkingMemory called", {
      key,
      scope: params.scope,
      chatId: params.chatId,
      userId: params.userId,
      contentLength: params.content.length
    });
    const memory = {
      content: params.content,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const ttl = params.scope === "user" ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    await this.redis.setex(key, ttl, memory);
    logger.debug("updateWorkingMemory complete", { key });
  }
  async saveMessage(message) {
    const key = this.getKey("msg", "chat", message.chatId);
    logger.debug(`saveMessage: chatId=${message.chatId}`, {
      chatId: message.chatId,
      role: message.role,
      key
    });
    await this.redis.rpush(key, message);
    await this.redis.ltrim(key, -100, -1);
    if (this.messageTtl !== void 0) {
      await this.redis.expire(key, this.messageTtl);
    }
    logger.debug(`saveMessage complete for ${message.chatId}`, {
      chatId: message.chatId
    });
  }
  async getMessages(params) {
    const key = this.getKey("msg", "chat", params.chatId);
    const start = params.limit ? -params.limit : 0;
    const messages = await this.redis.lrange(
      key,
      start,
      -1
    );
    logger.debug(`getMessages for ${params.chatId}`, {
      chatId: params.chatId,
      key,
      start,
      found: messages?.length || 0
    });
    if (!messages || messages.length === 0) return [];
    const filtered = messages.filter((msg) => {
      if (params.userId) {
        return !msg.userId || msg.userId === params.userId;
      }
      return true;
    }).map((msg) => {
      let content = msg.content;
      try {
        if (typeof msg.content === "string") {
          const parsed = JSON.parse(msg.content);
          content = parsed;
        }
      } catch {
      }
      return content;
    });
    if (filtered.length > 0) {
      logger.debug(`Messages retrieved`, {
        count: filtered.length
      });
    }
    return filtered;
  }
  async saveChat(chat) {
    const chatKey = `${this.prefix}chat:${chat.chatId}`;
    const existing = await this.redis.hgetall(chatKey);
    const chatData = {
      ...chat,
      createdAt: chat.createdAt.getTime(),
      updatedAt: chat.updatedAt.getTime(),
      // Preserve existing title if new chat doesn't have one
      title: chat.title || existing?.title
    };
    await this.redis.hset(chatKey, chatData);
    await this.redis.expire(chatKey, 60 * 60 * 24 * 30);
    const globalChatsKey = `${this.prefix}chats:global`;
    const score = chat.updatedAt.getTime();
    await this.redis.zadd(globalChatsKey, { score, member: chat.chatId });
    await this.redis.expire(globalChatsKey, 60 * 60 * 24 * 30);
    if (chat.userId) {
      const userChatsKey = `${this.prefix}chats:${chat.userId}`;
      await this.redis.zadd(userChatsKey, { score, member: chat.chatId });
      await this.redis.expire(userChatsKey, 60 * 60 * 24 * 30);
    }
  }
  async getChats(params) {
    let chats = [];
    if (params.userId) {
      const userChatsKey = `${this.prefix}chats:${params.userId}`;
      const fetchLimit = params.search ? void 0 : params.limit;
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.redis.zrange(userChatsKey, 0, endIndex, {
        rev: true
        // Most recent first (highest score = most recent)
      });
      if (chatIds.length === 0) return [];
      const userChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.redis.hgetall(chatKey);
          if (!data) return null;
          return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
          };
        })
      );
      chats = userChats.filter((chat) => chat !== null);
    } else {
      const globalChatsKey = `${this.prefix}chats:global`;
      const fetchLimit = params.search && params.limit ? params.limit * 3 : params.search ? void 0 : params.limit;
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.redis.zrange(globalChatsKey, 0, endIndex, {
        rev: true
        // Most recent first (highest score = most recent)
      });
      if (chatIds.length === 0) return [];
      const allChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.redis.hgetall(chatKey);
          if (!data) return null;
          return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
          };
        })
      );
      chats = allChats.filter((chat) => chat !== null);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      chats = chats.filter(
        (chat) => chat.title?.toLowerCase().includes(searchLower)
      );
    }
    if (params.limit) {
      chats = chats.slice(0, params.limit);
    }
    return chats;
  }
  async getChat(chatId) {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall(chatKey);
    if (!data) return null;
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
  async updateChatTitle(chatId, title) {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall(chatKey);
    const updatedAt = Date.now();
    if (data) {
      const chatData = {
        ...data,
        title,
        updatedAt
      };
      await this.redis.hset(chatKey, chatData);
    } else {
      const now = Date.now();
      const chatData = {
        chatId,
        title,
        createdAt: new Date(now),
        updatedAt: new Date(updatedAt),
        messageCount: 0
      };
      await this.saveChat(chatData);
      return;
    }
    const globalChatsKey = `${this.prefix}chats:global`;
    await this.redis.zadd(globalChatsKey, {
      score: updatedAt,
      member: chatId
    });
    if (data.userId) {
      const userChatsKey = `${this.prefix}chats:${data.userId}`;
      await this.redis.zadd(userChatsKey, {
        score: updatedAt,
        member: chatId
      });
    }
  }
  async deleteChat(chatId) {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const messageKey = this.getKey("msg", "chat", chatId);
    const chatData = await this.redis.hgetall(chatKey);
    const userId = chatData?.userId;
    await this.redis.del(chatKey);
    await this.redis.del(messageKey);
    const globalChatsKey = `${this.prefix}chats:global`;
    await this.redis.zrem(globalChatsKey, chatId);
    if (userId) {
      const userChatsKey = `${this.prefix}chats:${userId}`;
      await this.redis.zrem(userChatsKey, chatId);
    }
    logger.debug(`Deleted chat ${chatId}`, { chatId, userId });
  }
  getKey(type, scope, chatId, userId) {
    const id = scope === "chat" ? chatId : userId;
    return `${this.prefix}${type}:${scope}:${id}`;
  }
};
export {
  UpstashProvider
};
//# sourceMappingURL=upstash.js.map