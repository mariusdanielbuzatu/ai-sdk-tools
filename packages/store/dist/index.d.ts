import { UIMessage, UseChatHelpers, UseChatOptions } from '@ai-sdk/react';
export { UIMessage, UseChatHelpers, UseChatOptions } from '@ai-sdk/react';
import * as zustand from 'zustand';
import { ChatStatus } from 'ai';
import * as React from 'react';
import { StateCreator } from 'zustand/vanilla';

type LogLevel = "log" | "warn" | "error";
interface DebugOptions {
    enabled?: boolean;
    prefix?: string;
    level?: LogLevel;
}
declare class DebugLogger {
    private enabled;
    private prefix;
    private level;
    constructor(options?: DebugOptions);
    private shouldLog;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    setEnabled(enabled: boolean): void;
    setLevel(level: LogLevel): void;
}
declare const debug: DebugLogger;
declare function configureDebug(options: DebugOptions): void;

declare class MessageIndex<TMessage extends UIMessage> {
    private idToMessage;
    private idToIndex;
    update(messages: TMessage[]): void;
    getById(id: string): TMessage | undefined;
    getIndexById(id: string): number | undefined;
    has(id: string): boolean;
}
interface StoreState<TMessage extends UIMessage = UIMessage> {
    id: string | undefined;
    messages: TMessage[];
    status: ChatStatus;
    error: Error | undefined;
    _throttledMessages: TMessage[] | null;
    _messageIndex: MessageIndex<TMessage>;
    _memoizedSelectors: Map<string, {
        result: any;
        deps: any[];
    }>;
    _transientDataParts: Map<string, any>;
    setId: (id: string | undefined) => void;
    setMessages: (messages: TMessage[]) => void;
    setStatus: (status: ChatStatus) => void;
    setError: (error: Error | undefined) => void;
    setNewChat: (id: string, messages: TMessage[]) => void;
    pushMessage: (message: TMessage) => void;
    popMessage: () => void;
    replaceMessage: (index: number, message: TMessage) => void;
    replaceMessageById: (id: string, message: TMessage) => void;
    sendMessage?: UseChatHelpers<TMessage>["sendMessage"];
    regenerate?: UseChatHelpers<TMessage>["regenerate"];
    stop?: UseChatHelpers<TMessage>["stop"];
    resumeStream?: UseChatHelpers<TMessage>["resumeStream"];
    addToolResult?: UseChatHelpers<TMessage>["addToolResult"];
    clearError?: UseChatHelpers<TMessage>["clearError"];
    _syncState: (newState: Partial<StoreState<TMessage>>) => void;
    reset: () => void;
    getLastMessageId: () => string | null;
    getMessageIds: () => string[];
    getThrottledMessages: () => TMessage[];
    getInternalMessages: () => TMessage[];
    getMessageById: (id: string) => TMessage | undefined;
    getMessageIndexById: (id: string) => number | undefined;
    getMessagesSlice: (start: number, end?: number) => TMessage[];
    getMessageCount: () => number;
    getMemoizedSelector: <T>(key: string, selector: () => T, deps: any[]) => T;
    registerThrottledMessagesEffect: (effect: () => void) => () => void;
    setTransientDataPart: (type: string, data: any) => void;
    getTransientDataPart: (type: string) => any;
    removeTransientDataPart: (type: string) => void;
    clearTransientDataParts: () => void;
}
declare function createChatStoreCreator<TMessage extends UIMessage>(initialMessages?: TMessage[]): StateCreator<StoreState<TMessage>, [], []>;
declare function createChatStore<TMessage extends UIMessage = UIMessage>(initialMessages?: TMessage[]): Omit<Omit<zustand.StoreApi<StoreState<TMessage>>, "setState" | "devtools"> & {
    setState(partial: StoreState<TMessage> | Partial<StoreState<TMessage>> | ((state: StoreState<TMessage>) => StoreState<TMessage> | Partial<StoreState<TMessage>>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: StoreState<TMessage> | ((state: StoreState<TMessage>) => StoreState<TMessage>), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: StoreState<TMessage>, previousSelectedState: StoreState<TMessage>) => void): () => void;
        <U>(selector: (state: StoreState<TMessage>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean;
        } | undefined): () => void;
    };
};
type ChatStoreApi<TMessage extends UIMessage = UIMessage> = ReturnType<typeof createChatStore<TMessage>>;
declare const ChatStoreContext: React.Context<(Omit<Omit<zustand.StoreApi<StoreState<any>>, "setState" | "devtools"> & {
    setState(partial: StoreState<any> | Partial<StoreState<any>> | ((state: StoreState<any>) => StoreState<any> | Partial<StoreState<any>>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: StoreState<any> | ((state: StoreState<any>) => StoreState<any>), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: StoreState<any>, previousSelectedState: StoreState<any>) => void): () => void;
        <U>(selector: (state: StoreState<any>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean;
        } | undefined): () => void;
    };
}) | undefined>;
type CompatibleChatStoreApi<TMessage extends UIMessage = UIMessage> = Omit<ChatStoreApi<TMessage>, "setState"> & {
    setState(partial: StoreState<TMessage> | Partial<StoreState<TMessage>> | ((state: StoreState<TMessage>) => StoreState<TMessage> | Partial<StoreState<TMessage>>), replace?: boolean, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
};
declare function Provider<TMessage extends UIMessage = UIMessage>({ children, initialMessages, store, }: {
    children: React.ReactNode;
    initialMessages?: TMessage[];
    store?: CompatibleChatStoreApi<TMessage>;
}): React.FunctionComponentElement<React.ProviderProps<(Omit<Omit<zustand.StoreApi<StoreState<any>>, "setState" | "devtools"> & {
    setState(partial: StoreState<any> | Partial<StoreState<any>> | ((state: StoreState<any>) => StoreState<any> | Partial<StoreState<any>>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: StoreState<any> | ((state: StoreState<any>) => StoreState<any>), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: StoreState<any>, previousSelectedState: StoreState<any>) => void): () => void;
        <U>(selector: (state: StoreState<any>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean;
        } | undefined): () => void;
    };
}) | undefined>>;
declare function useChatStore<T, TMessage extends UIMessage = UIMessage>(selector: (store: StoreState<TMessage>) => T): T;
declare function useChatStore<TMessage extends UIMessage = UIMessage>(): StoreState<TMessage>;
declare function useChatStoreApi<TMessage extends UIMessage = UIMessage>(): ChatStoreApi<TMessage>;
declare const useChatMessages: <TMessage extends UIMessage = UIMessage>() => TMessage[];
declare const useChatStatus: () => ChatStatus;
declare const useChatError: () => Error | undefined;
declare const useChatId: () => string | undefined;
declare const useMessageIds: <TMessage extends UIMessage = UIMessage>() => string[];
declare const useMessageById: <TMessage extends UIMessage = UIMessage>(messageId: string) => TMessage;
declare const useVirtualMessages: <TMessage extends UIMessage = UIMessage>(start: number, end?: number) => TMessage[];
declare const useMessageCount: () => number;
declare const useChatReset: () => () => void;
type ChatActions<TMessage extends UIMessage = UIMessage> = {
    setMessages: (messages: TMessage[]) => void;
    pushMessage: (message: TMessage) => void;
    popMessage: () => void;
    replaceMessage: (index: number, message: TMessage) => void;
    replaceMessageById: (id: string, message: TMessage) => void;
    setStatus: (status: ChatStatus) => void;
    setError: (error: Error | undefined) => void;
    setId: (id: string | undefined) => void;
    setNewChat: (id: string, messages: TMessage[]) => void;
    reset: () => void;
    sendMessage: UseChatHelpers<TMessage>["sendMessage"];
    regenerate: UseChatHelpers<TMessage>["regenerate"];
    stop: UseChatHelpers<TMessage>["stop"];
    resumeStream: UseChatHelpers<TMessage>["resumeStream"];
    addToolResult: UseChatHelpers<TMessage>["addToolResult"];
    clearError: UseChatHelpers<TMessage>["clearError"];
};
declare const useChatActions: <TMessage extends UIMessage = UIMessage>() => ChatActions<TMessage>;
declare const useSelector: <TMessage extends UIMessage = UIMessage, T = any>(key: string, selector: (messages: TMessage[]) => T, deps?: any[]) => T;

interface CompatibleChatStore<TMessage extends UIMessage = UIMessage> {
    <T>(selector: (state: StoreState<TMessage>) => T): T;
    setState?: (partial: Partial<StoreState<TMessage>>) => void;
    _syncState?: (partial: Partial<StoreState<TMessage>>) => void;
}
type UseChatOptionsWithPerformance<TMessage extends UIMessage = UIMessage> = UseChatOptions<TMessage> & {
    store?: CompatibleChatStore<TMessage>;
    enableBatching?: boolean;
};
declare function useChat<TMessage extends UIMessage = UIMessage>(options?: UseChatOptionsWithPerformance<TMessage>): UseChatHelpers<TMessage>;

/**
 * Interface for a data part extracted from messages
 */
interface DataPart<T = unknown> {
    type: string;
    data: T;
    timestamp?: number;
}
/**
 * Result of useDataParts hook
 */
interface UseDataPartsReturn {
    /** All data parts grouped by type (without 'data-' prefix) */
    byType: Record<string, DataPart<unknown>>;
    /** Array of all data parts */
    all: DataPart<unknown>[];
}
/**
 * Options for useDataPart hook
 */
interface UseDataPartOptions<T = unknown> {
    /** Include callback fired when the data part updates */
    onData?: (data: DataPart<T>) => void;
}
/**
 * Hook to extract and access all data parts from messages.
 * Returns the latest value for each data part type.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { byType, all } = useDataParts();
 *
 *   const agentStatus = byType['agent-status'];
 *   const rateLimit = byType['rate-limit'];
 *
 *   return (
 *     <div>
 *       {agentStatus && <p>Status: {agentStatus.data.status}</p>}
 *       {rateLimit && <p>Remaining: {rateLimit.data.remaining}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
declare function useDataParts(): UseDataPartsReturn;
/**
 * Hook to extract and access a specific data part by type.
 * Returns a tuple with the data and a clear function, similar to useState.
 *
 * @template T - The type of the data part's data property
 * @param type - The data part type without 'data-' prefix (e.g., 'agent-status', 'rate-limit')
 * @param options - Optional configuration including onData callback
 * @returns Tuple of [data, clearFunction] - data is the latest value, clearFunction removes the data part
 *
 * @example
 * ```tsx
 * function AgentStatusIndicator() {
 *   const [agentStatus, clearStatus] = useDataPart<{ status: string; agent: string }>('agent-status');
 *
 *   if (!agentStatus) return null;
 *
 *   return (
 *     <div>
 *       <p>Agent {agentStatus.agent} is {agentStatus.status}</p>
 *       <button onClick={clearStatus}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With callback
 * ```tsx
 * function RateLimitMonitor() {
 *   const [rateLimit] = useDataPart('rate-limit', {
 *     onData: (data) => {
 *       if (data.data.remaining < 10) {
 *         toast.warning('Rate limit running low!');
 *       }
 *     }
 *   });
 *
 *   return rateLimit ? <p>{rateLimit.remaining} requests remaining</p> : null;
 * }
 * ```
 */
declare function useDataPart<T = unknown>(type: string, options?: UseDataPartOptions<T>): [T | null, () => void];

export { type ChatActions, ChatStoreContext, type DataPart, DebugLogger, Provider, type StoreState, type UseDataPartOptions, type UseDataPartsReturn, configureDebug, createChatStore, createChatStoreCreator, debug, useChat, useChatActions, useChatError, useChatId, useChatMessages, useChatReset, useChatStatus, useChatStore, useChatStoreApi, useDataPart, useDataParts, useMessageById, useMessageCount, useMessageIds, useSelector, useVirtualMessages };
