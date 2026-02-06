/**
 * Type for UI messages from Vercel AI SDK
 * Imported from 'ai' package if available, otherwise defaults to any
 */
type UIMessage = any;
/**
 * Persistent working memory that agents maintain
 */
interface WorkingMemory {
    content: string;
    updatedAt: Date;
}
/**
 * Memory scope
 * - chat: Per-conversation (recommended)
 * - user: Per-user across all chats (optional)
 */
type MemoryScope = "chat" | "user";
/**
 * Conversation message for history
 */
interface ConversationMessage {
    chatId: string;
    userId?: string;
    role: "user" | "assistant" | "system";
    content: string | unknown;
    timestamp: Date;
}
/**
 * Chat session metadata for persistence and organization
 */
interface ChatSession {
    chatId: string;
    userId?: string;
    title?: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}
/**
 * Configuration for automatic title generation
 */
interface GenerateTitleConfig {
    model: any;
    instructions?: string;
}
/**
 * Configuration for automatic prompt suggestions generation
 */
interface GenerateSuggestionsConfig {
    enabled: boolean | ((params: {
        messages: any[];
        context?: Record<string, unknown>;
    }) => boolean | Promise<boolean>);
    model?: any;
    instructions?: string;
    limit?: number;
    minResponseLength?: number;
    contextWindow?: number;
}
/**
 * Configuration for chat session management
 */
interface ChatsConfig {
    enabled: boolean;
    generateTitle?: boolean | GenerateTitleConfig;
    generateSuggestions?: boolean | GenerateSuggestionsConfig;
}
/**
 * Memory Provider Interface
 *
 * Simple 4-method API for any storage backend.
 */
interface MemoryProvider {
    /** Get persistent working memory */
    getWorkingMemory(params: {
        chatId?: string;
        userId?: string;
        scope: MemoryScope;
    }): Promise<WorkingMemory | null>;
    /** Update persistent working memory */
    updateWorkingMemory(params: {
        chatId?: string;
        userId?: string;
        scope: MemoryScope;
        content: string;
    }): Promise<void>;
    /**
     * Add message to history (optional)
     * Note: This does NOT replace the messages array.
     * Use for analytics, retrieval, or cross-session context.
     */
    saveMessage?(message: ConversationMessage): Promise<void>;
    /** Get recent messages (optional)
     * Returns UIMessage[] format (Vercel AI SDK format) - extracts content field from stored ConversationMessage
     * @template T - The message type to return (defaults to UIMessage)
     */
    getMessages?<T = UIMessage>(params: {
        chatId: string;
        userId?: string;
        limit?: number;
    }): Promise<T[]>;
    /** Save or update chat session (optional) */
    saveChat?(chat: ChatSession): Promise<void>;
    /** Get chat sessions for a user (optional, returns all if userId omitted) */
    getChats?(params: {
        userId?: string;
        search?: string;
        limit?: number;
    }): Promise<ChatSession[]>;
    /** Get specific chat session (optional) */
    getChat?(chatId: string): Promise<ChatSession | null>;
    /** Update chat title (optional) */
    updateChatTitle?(chatId: string, title: string): Promise<void>;
    /** Delete a chat session and its messages (optional) */
    deleteChat?(chatId: string): Promise<void>;
}
/**
 * Memory configuration for agents
 */
interface MemoryConfig {
    /** Storage provider */
    provider: MemoryProvider;
    /** Working memory (learned facts) */
    workingMemory?: {
        enabled: boolean;
        scope: MemoryScope;
        /** Markdown template structure */
        template?: string;
    };
    /**
     * Conversation history (optional analytics)
     * Note: Agent still receives full messages array from frontend
     */
    history?: {
        enabled: boolean;
        /** Max messages to load */
        limit?: number;
    };
    /** Chat session management and title generation */
    chats?: ChatsConfig;
}

export type { ConversationMessage as C, GenerateSuggestionsConfig as G, MemoryConfig as M, UIMessage as U, WorkingMemory as W, ChatSession as a, ChatsConfig as b, GenerateTitleConfig as c, MemoryProvider as d, MemoryScope as e };
