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

// src/providers/redis.ts
var logger = createLogger("REDIS");
var RedisProvider = class {
  isRedisPackage;
  ioredis;
  redisPkg;
  messageTtl;
  prefix;
  constructor(redis, options) {
    this.prefix = options?.prefix ?? "memory:";
    this.messageTtl = options?.messageTtl;
    this.isRedisPackage = "setEx" in redis || "rPush" in redis || "hSet" in redis;
    if (this.isRedisPackage) {
      this.redisPkg = redis;
      this.ioredis = null;
    } else {
      this.ioredis = redis;
      this.redisPkg = null;
    }
  }
  // Typed wrapper methods to avoid 'as any' casts
  async setex(key, seconds, value) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.setEx(key, seconds, value);
    }
    if (this.ioredis) {
      return this.ioredis.setex(key, seconds, value);
    }
    throw new Error("Redis client not properly initialized");
  }
  async rpush(key, ...values) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.rPush(key, ...values);
    }
    if (this.ioredis) {
      return this.ioredis.rpush(key, ...values);
    }
    throw new Error("Redis client not properly initialized");
  }
  async ltrim(key, start, stop) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.lTrim(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.ltrim(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }
  async lrange(key, start, stop) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.lRange(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.lrange(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }
  async hset(key, data) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.hSet(key, data);
    }
    if (this.ioredis) {
      return this.ioredis.hset(key, data);
    }
    throw new Error("Redis client not properly initialized");
  }
  async hgetall(key) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.hGetAll(key);
    }
    if (this.ioredis) {
      return this.ioredis.hgetall(key);
    }
    throw new Error("Redis client not properly initialized");
  }
  async zadd(key, score, member) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zAdd(key, { score, value: member });
    }
    if (this.ioredis) {
      return this.ioredis.zadd(key, { score, member });
    }
    throw new Error("Redis client not properly initialized");
  }
  async zrange(key, start, stop) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zRange(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.zrange(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }
  async zrevrange(key, start, stop) {
    if (this.ioredis) {
      return this.ioredis.zrevrange(key, start, stop);
    }
    if (this.isRedisPackage && this.redisPkg) {
      if (stop === -1) {
        const result2 = await this.redisPkg.zRange(key, 0, -1);
        return result2.reverse();
      }
      const count = stop - start + 1;
      const result = await this.redisPkg.zRange(key, -count, -1);
      return result.reverse();
    }
    throw new Error("Redis client not properly initialized");
  }
  async get(key) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.get(key);
    }
    if (this.ioredis) {
      return this.ioredis.get(key);
    }
    throw new Error("Redis client not properly initialized");
  }
  async expire(key, seconds) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.expire(key, seconds);
    }
    if (this.ioredis) {
      return this.ioredis.expire(key, seconds);
    }
    throw new Error("Redis client not properly initialized");
  }
  async keys(pattern) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.keys(pattern);
    }
    if (this.ioredis) {
      return this.ioredis.keys(pattern);
    }
    throw new Error("Redis client not properly initialized");
  }
  async del(key) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.del(key);
    }
    if (this.ioredis) {
      return this.ioredis.del(key);
    }
    throw new Error("Redis client not properly initialized");
  }
  async zrem(key, member) {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zRem(key, member);
    }
    if (this.ioredis) {
      return this.ioredis.zrem(key, member);
    }
    throw new Error("Redis client not properly initialized");
  }
  async getWorkingMemory(params) {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    const value = await this.get(key);
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return {
        ...parsed,
        updatedAt: new Date(parsed.updatedAt)
      };
    } catch (error) {
      logger.error("Failed to parse working memory", { key, error });
      return null;
    }
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
    const value = JSON.stringify(memory);
    await this.setex(key, ttl, value);
    logger.debug("updateWorkingMemory complete", { key });
  }
  async saveMessage(message) {
    const key = this.getKey("msg", "chat", message.chatId);
    logger.debug(`saveMessage: chatId=${message.chatId}`, {
      chatId: message.chatId,
      role: message.role,
      key
    });
    const serialized = JSON.stringify({
      ...message,
      timestamp: message.timestamp.getTime()
    });
    await this.rpush(key, serialized);
    await this.ltrim(key, -100, -1);
    if (this.messageTtl !== void 0) {
      await this.expire(key, this.messageTtl);
    }
    logger.debug(`saveMessage complete for ${message.chatId}`, {
      chatId: message.chatId
    });
  }
  async getMessages(params) {
    const key = this.getKey("msg", "chat", params.chatId);
    const start = params.limit ? -params.limit : 0;
    const rawMessages = await this.lrange(key, start, -1);
    logger.debug(`getMessages for ${params.chatId}`, {
      chatId: params.chatId,
      key,
      start,
      found: rawMessages?.length || 0
    });
    if (!rawMessages || rawMessages.length === 0) return [];
    const messages = [];
    for (const raw of rawMessages) {
      try {
        const parsed = JSON.parse(raw);
        const message = {
          ...parsed,
          timestamp: new Date(parsed.timestamp)
        };
        if (params.userId) {
          if (message.userId && message.userId !== params.userId) {
            continue;
          }
        }
        let content = message.content;
        try {
          if (typeof message.content === "string") {
            const parsedContent = JSON.parse(message.content);
            content = parsedContent;
          }
        } catch {
        }
        messages.push(content);
      } catch (error) {
        logger.error("Failed to parse message", { error, raw });
      }
    }
    if (messages.length > 0) {
      logger.debug(`Messages retrieved`, {
        count: messages.length
      });
    }
    return messages;
  }
  async saveChat(chat) {
    const chatKey = `${this.prefix}chat:${chat.chatId}`;
    const existing = await this.hgetall(chatKey);
    const chatData = {
      chatId: chat.chatId,
      userId: chat.userId || "",
      // Preserve existing title if new chat doesn't have one
      title: chat.title || existing?.title || "",
      createdAt: chat.createdAt.getTime().toString(),
      updatedAt: chat.updatedAt.getTime().toString(),
      messageCount: chat.messageCount.toString()
    };
    Object.keys(chatData).forEach((key) => {
      if (chatData[key] === "") {
        delete chatData[key];
      }
    });
    await this.hset(chatKey, chatData);
    await this.expire(chatKey, 60 * 60 * 24 * 30);
    const globalChatsKey = `${this.prefix}chats:global`;
    const score = chat.updatedAt.getTime();
    await this.zadd(globalChatsKey, score, chat.chatId);
    await this.expire(globalChatsKey, 60 * 60 * 24 * 30);
    if (chat.userId) {
      const userChatsKey = `${this.prefix}chats:${chat.userId}`;
      await this.zadd(userChatsKey, score, chat.chatId);
      await this.expire(userChatsKey, 60 * 60 * 24 * 30);
    }
  }
  async getChats(params) {
    let chats = [];
    if (params.userId) {
      const userChatsKey = `${this.prefix}chats:${params.userId}`;
      const fetchLimit = params.search ? void 0 : params.limit;
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.zrevrange(userChatsKey, 0, endIndex);
      if (chatIds.length === 0) return [];
      const userChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.hgetall(chatKey);
          if (!data || Object.keys(data).length === 0) return null;
          return {
            ...data,
            chatId: data.chatId || chatId,
            userId: data.userId || void 0,
            title: data.title || void 0,
            createdAt: new Date(parseInt(data.createdAt, 10)),
            updatedAt: new Date(parseInt(data.updatedAt, 10)),
            messageCount: parseInt(data.messageCount || "0", 10)
          };
        })
      );
      chats = userChats.filter(
        (chat) => chat !== null
      );
    } else {
      const globalChatsKey = `${this.prefix}chats:global`;
      const fetchLimit = params.search && params.limit ? params.limit * 3 : params.search ? void 0 : params.limit;
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.zrevrange(globalChatsKey, 0, endIndex);
      if (chatIds.length === 0) return [];
      const allChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.hgetall(chatKey);
          if (!data || Object.keys(data).length === 0) return null;
          return {
            ...data,
            chatId: data.chatId || chatId,
            userId: data.userId || void 0,
            title: data.title || void 0,
            createdAt: new Date(parseInt(data.createdAt, 10)),
            updatedAt: new Date(parseInt(data.updatedAt, 10)),
            messageCount: parseInt(data.messageCount || "0", 10)
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
    const data = await this.hgetall(chatKey);
    if (!data || Object.keys(data).length === 0) return null;
    return {
      ...data,
      chatId: data.chatId || chatId,
      userId: data.userId || void 0,
      title: data.title || void 0,
      createdAt: new Date(parseInt(data.createdAt, 10)),
      updatedAt: new Date(parseInt(data.updatedAt, 10)),
      messageCount: parseInt(data.messageCount || "0", 10)
    };
  }
  async updateChatTitle(chatId, title) {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.hgetall(chatKey);
    const updatedAt = Date.now();
    if (data && Object.keys(data).length > 0) {
      const chatData = {
        ...data,
        title,
        updatedAt: updatedAt.toString()
      };
      await this.hset(chatKey, chatData);
      const globalChatsKey = `${this.prefix}chats:global`;
      await this.zadd(globalChatsKey, updatedAt, chatId);
      if (data.userId) {
        const userChatsKey = `${this.prefix}chats:${data.userId}`;
        await this.zadd(userChatsKey, updatedAt, chatId);
      }
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
  }
  async deleteChat(chatId) {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const messageKey = this.getKey("msg", "chat", chatId);
    const chatData = await this.hgetall(chatKey);
    const userId = chatData?.userId;
    await this.del(chatKey);
    await this.del(messageKey);
    const globalChatsKey = `${this.prefix}chats:global`;
    await this.zrem(globalChatsKey, chatId);
    if (userId) {
      const userChatsKey = `${this.prefix}chats:${userId}`;
      await this.zrem(userChatsKey, chatId);
    }
    logger.debug(`Deleted chat ${chatId}`, { chatId, userId });
  }
  getKey(type, scope, chatId, userId) {
    const id = scope === "chat" ? chatId : userId;
    return `${this.prefix}${type}:${scope}:${id}`;
  }
};
export {
  RedisProvider
};
//# sourceMappingURL=redis.js.map