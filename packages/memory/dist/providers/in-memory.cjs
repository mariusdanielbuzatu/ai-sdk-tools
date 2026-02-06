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

// src/providers/in-memory.ts
var in_memory_exports = {};
__export(in_memory_exports, {
  InMemoryProvider: () => InMemoryProvider
});
module.exports = __toCommonJS(in_memory_exports);
var InMemoryProvider = class {
  workingMemory = /* @__PURE__ */ new Map();
  messages = /* @__PURE__ */ new Map();
  chats = /* @__PURE__ */ new Map();
  async getWorkingMemory(params) {
    const key = this.getKey(params.scope, params.chatId, params.userId);
    return this.workingMemory.get(key) || null;
  }
  async updateWorkingMemory(params) {
    const key = this.getKey(params.scope, params.chatId, params.userId);
    this.workingMemory.set(key, {
      content: params.content,
      updatedAt: /* @__PURE__ */ new Date()
    });
  }
  async saveMessage(message) {
    const msgs = this.messages.get(message.chatId) || [];
    msgs.push(message);
    this.messages.set(message.chatId, msgs);
  }
  async getMessages(params) {
    let msgs = this.messages.get(params.chatId) || [];
    if (params.userId) {
      msgs = msgs.filter((msg) => !msg.userId || msg.userId === params.userId);
    }
    const limited = params.limit ? msgs.slice(-params.limit) : msgs;
    return limited.map((msg) => {
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
  }
  async saveChat(chat) {
    const existing = this.chats.get(chat.chatId);
    const title = chat.title || existing?.title;
    this.chats.set(chat.chatId, {
      ...chat,
      title
    });
  }
  async getChats(params) {
    let allChats = Array.from(this.chats.values());
    if (params.userId) {
      allChats = allChats.filter((chat) => chat.userId === params.userId);
    }
    allChats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      allChats = allChats.filter(
        (chat) => chat.title?.toLowerCase().includes(searchLower)
      );
    }
    if (params.limit) {
      allChats = allChats.slice(0, params.limit);
    }
    return allChats;
  }
  async getChat(chatId) {
    return this.chats.get(chatId) || null;
  }
  async updateChatTitle(chatId, title) {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.title = title;
      chat.updatedAt = /* @__PURE__ */ new Date();
      this.chats.set(chatId, chat);
    } else {
      const now = /* @__PURE__ */ new Date();
      this.chats.set(chatId, {
        chatId,
        title,
        createdAt: now,
        updatedAt: now,
        messageCount: 0
      });
    }
  }
  async deleteChat(chatId) {
    this.chats.delete(chatId);
    this.messages.delete(chatId);
  }
  getKey(scope, chatId, userId) {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryProvider
});
//# sourceMappingURL=in-memory.cjs.map