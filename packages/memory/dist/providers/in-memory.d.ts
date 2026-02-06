import { d as MemoryProvider, e as MemoryScope, W as WorkingMemory, C as ConversationMessage, U as UIMessage, a as ChatSession } from '../types-CTmklkd-.js';

/**
 * In-memory provider - perfect for development
 */
declare class InMemoryProvider implements MemoryProvider {
    private workingMemory;
    private messages;
    private chats;
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

export { InMemoryProvider };
