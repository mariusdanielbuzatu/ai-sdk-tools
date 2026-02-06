import * as ai from 'ai';
import { StepResult, Tool, ModelMessage, LanguageModelUsage, StreamTextResult, LanguageModel, UIMessage, UIMessageStreamWriter, UIMessageStreamOnFinishCallback, IdGenerator } from 'ai';
import { MemoryConfig } from '@ai-sdk-tools/memory';

/**
 * AgentRunContext
 *
 * Tracks user context and metadata throughout agent workflows.
 */
declare class AgentRunContext<TContext = Record<string, unknown>> {
    /**
     * The context object passed to the agent workflow
     */
    context: TContext;
    /**
     * Additional metadata for the run
     */
    metadata: Record<string, unknown>;
    constructor(context?: TContext);
    /**
     * Serialize the run context to JSON
     */
    toJSON(): {
        context: TContext;
        metadata: Record<string, unknown>;
    };
}

/**
 * Interface for context objects that include memory identifiers
 */
interface MemoryIdentifiers {
    chatId?: string;
    userId?: string;
    metadata?: {
        chatId?: string;
        userId?: string;
    };
}
/**
 * Extended execution context with internal memory properties
 */
interface ExtendedExecutionContext extends Record<string, unknown> {
    _memoryAddition?: string;
}
/**
 * Handoff data structure
 */
interface HandoffData {
    agent: string;
    reason?: string;
    data?: Record<string, unknown>;
}
/**
 * ConfiguredHandoff - represents an agent with handoff configuration
 */
interface HandoffConfig<TContext extends Record<string, unknown> = Record<string, unknown>> {
    /** Callback when handoff is invoked */
    onHandoff?: (context: AgentRunContext<TContext>) => void | Promise<void>;
    /** Input filter to modify data passed to the next agent */
    inputFilter?: HandoffInputFilter;
}
interface ConfiguredHandoff<TContext extends Record<string, unknown> = Record<string, unknown>> {
    agent: Agent$1<TContext>;
    config?: HandoffConfig<TContext>;
}
interface Agent$1<TContext extends Record<string, unknown> = Record<string, unknown>> {
    name: string;
    instructions: string | ((context: TContext) => string);
    matchOn?: (string | RegExp)[] | ((message: string) => boolean);
    onEvent?: (event: AgentEvent) => void | Promise<void>;
    inputGuardrails?: InputGuardrail[];
    outputGuardrails?: OutputGuardrail[];
    permissions?: ToolPermissions;
    lastMessages?: number;
    generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
    stream(options: AgentStreamOptions): AgentStreamResult;
    getHandoffs(): Array<Agent$1<any>>;
}
interface AgentConfig<TContext extends Record<string, unknown> = Record<string, unknown>> {
    /** Unique name for the agent */
    name: string;
    /**
     * Static instructions or dynamic function that receives context.
     * Function receives the full execution context and returns the system prompt.
     */
    instructions: string | ((context: TContext) => string);
    /** Language model to use */
    model: LanguageModel;
    /** Tools available to the agent - static or dynamic function receiving context */
    tools?: Record<string, Tool> | ((context: TContext) => Record<string, Tool>);
    /** Agents this agent can hand off to */
    handoffs?: Array<Agent$1<any> | ConfiguredHandoff<any>>;
    /** Description of when to hand off to this agent */
    handoffDescription?: string;
    /** Maximum number of turns before stopping */
    maxTurns?: number;
    /** Temperature for model responses */
    temperature?: number;
    /** Additional model settings */
    modelSettings?: Record<string, unknown>;
    /** Programmatic routing patterns */
    matchOn?: (string | RegExp)[] | ((message: string) => boolean);
    /** Lifecycle event handler */
    onEvent?: (event: AgentEvent) => void | Promise<void>;
    /** Input guardrails - run before agent execution */
    inputGuardrails?: InputGuardrail[];
    /** Output guardrails - run after agent execution */
    outputGuardrails?: OutputGuardrail[];
    /** Tool permissions - control tool access */
    permissions?: ToolPermissions;
    /** Memory configuration - persistent working memory and conversation history */
    memory?: MemoryConfig;
    /** Number of last messages from memory thread to include in context (default: 10) */
    lastMessages?: number;
}
interface HandoffInstruction {
    /** Target agent to hand off to */
    targetAgent: string;
    /** Context to pass to the target agent */
    context?: string;
    /** Reason for the handoff */
    reason?: string;
    /** Tool results that are already available */
    availableData?: Record<string, any>;
}
interface HandoffInputData {
    /** The input history before the handoff */
    inputHistory: ModelMessage[];
    /** Items generated before the handoff */
    preHandoffItems: any[];
    /** New items generated during current turn (including tool results) */
    newItems: any[];
    /** Run context */
    runContext?: any;
}
type HandoffInputFilter = (input: HandoffInputData) => HandoffInputData;
/**
 * Generate options for agents
 */
interface AgentGenerateOptions {
    prompt: string;
    messages?: ModelMessage[];
}
/**
 * Stream options for agents
 */
interface AgentStreamOptions {
    prompt?: string;
    messages?: ModelMessage[];
    toolChoice?: string;
}
interface AgentGenerateResult {
    text: string;
    finalAgent: string;
    finalOutput: string;
    handoffs: HandoffInstruction[];
    metadata: {
        startTime: Date;
        endTime: Date;
        duration: number;
    };
    steps?: StepResult<Record<string, Tool>>[];
    finishReason?: string;
    usage?: LanguageModelUsage;
    toolCalls?: Array<{
        toolCallId: string;
        toolName: string;
        args: unknown;
    }>;
}
/**
 * Extended stream result type
 */
type AgentStreamResult = StreamTextResult<Record<string, Tool>, never>;
/**
 * Lifecycle events emitted by agents
 */
type AgentEvent = {
    type: "start";
    agent: string;
    input: string;
} | {
    type: "agent-start";
    agent: string;
    round: number;
} | {
    type: "agent-step";
    agent: string;
    step: StepResult<Record<string, Tool>>;
} | {
    type: "agent-finish";
    agent: string;
    round: number;
} | {
    type: "agent-handoff";
    from: string;
    to: string;
    reason?: string;
} | {
    type: "agent-complete";
    totalRounds: number;
} | {
    type: "agent-error";
    error: Error;
} | {
    type: "tool-call";
    agent: string;
    toolName: string;
    args: unknown;
} | {
    type: "handoff";
    from: string;
    to: string;
    reason?: string;
} | {
    type: "complete";
    agent: string;
    output: string;
} | {
    type: "error";
    agent: string;
    error: Error;
};
/**
 * Guardrail result
 */
interface GuardrailResult {
    tripwireTriggered: boolean;
    outputInfo?: unknown;
}
/**
 * Input guardrail - runs before agent execution
 */
interface InputGuardrail {
    name: string;
    execute: (args: {
        input: string;
        context?: unknown;
    }) => Promise<GuardrailResult>;
}
/**
 * Output guardrail - runs after agent execution
 */
interface OutputGuardrail<TOutput = unknown> {
    name: string;
    execute: (args: {
        agentOutput: TOutput;
        context?: unknown;
    }) => Promise<GuardrailResult>;
}
/**
 * Tool permission context
 */
interface ToolPermissionContext {
    user?: {
        id: string;
        roles: string[];
        [key: string]: unknown;
    };
    usage: {
        toolCalls: Record<string, number>;
        tokens: number;
    };
    [key: string]: unknown;
}
/**
 * Tool permission result
 */
interface ToolPermissionResult {
    allowed: boolean;
    reason?: string;
}
/**
 * Tool permission check function
 */
type ToolPermissionCheck = (ctx: {
    toolName: string;
    args: unknown;
    context: ToolPermissionContext;
}) => ToolPermissionResult | Promise<ToolPermissionResult>;
/**
 * Tool permissions configuration
 */
interface ToolPermissions {
    check: ToolPermissionCheck;
}
/**
 * Options for agent.toUIMessageStream()
 */
interface AgentStreamOptionsUI<TContext extends Record<string, unknown> = Record<string, unknown>> {
    /** New user message - agent automatically loads conversation history from memory */
    message: UIMessage;
    /** Routing strategy */
    strategy?: "auto" | "llm";
    /** Max orchestration rounds */
    maxRounds?: number;
    /** Max steps per agent */
    maxSteps?: number;
    /** Global timeout (ms) */
    timeout?: number;
    /** Direct agent selection - bypasses triage routing */
    agentChoice?: string;
    /** Tool preference - routes to agent with this tool and hints to use it */
    toolChoice?: string;
    /**
     * Context for permissions, guardrails, and artifacts.
     * This object will be wrapped in RunContext<T> and passed to all tools and hooks.
     * The writer will be automatically added when streaming.
     */
    context?: TContext;
    /** Hook before streaming starts */
    beforeStream?: (ctx: {
        writer: UIMessageStreamWriter;
    }) => Promise<boolean | undefined>;
    /** Lifecycle event handler */
    onEvent?: (event: AgentEvent) => void | Promise<void>;
    /** Callback when stream finishes with final messages */
    onFinish?: UIMessageStreamOnFinishCallback<never>;
    /** Process errors, e.g. to log them. Returns error message for data stream */
    onError?: (error: unknown) => string;
    /** Generate message ID for the response message */
    generateId?: IdGenerator;
    /** Send reasoning parts to client (default: true) */
    sendReasoning?: boolean;
    /** Send source parts to client (default: false) */
    sendSources?: boolean;
    /** Send finish event to client (default: true) */
    sendFinish?: boolean;
    /** Send message start event to client (default: true) */
    sendStart?: boolean;
    /** Extract message metadata to send to client */
    messageMetadata?: (options: {
        part: unknown;
    }) => Record<string, unknown> | undefined;
    /** AI SDK transform - stream transform function */
    experimental_transform?: unknown;
    /** HTTP status code */
    status?: number;
    /** HTTP status text */
    statusText?: string;
    /** HTTP headers */
    headers?: Record<string, string>;
}
/**
 * Base data part schemas for agent orchestration streaming.
 * Users can extend this interface to add custom data parts.
 *
 * @example Extending with custom data parts
 * ```typescript
 * declare module '@ai-sdk-tools/agents' {
 *   interface AgentDataParts {
 *     'custom-data': {
 *       value: string;
 *       timestamp: number;
 *     };
 *   }
 * }
 * ```
 */
interface AgentDataParts {
    /** Agent status updates (transient - won't be in message history) */
    "agent-status": {
        status: "routing" | "executing" | "completing";
        agent: string;
    };
    /** Agent handoff events (transient) */
    "agent-handoff": {
        from: string;
        to: string;
        reason?: string;
        routingStrategy?: "programmatic" | "llm";
    };
    /** Rate limit information (transient) */
    "rate-limit": {
        limit: number;
        remaining: number;
        reset: string;
        code?: string;
    };
    /** Suggested prompts (transient) */
    suggestions: {
        prompts: string[];
    };
    [key: string]: unknown;
}
/**
 * Generic UI Message type for agents with orchestration data parts.
 * Extends AI SDK's UIMessage with agent-specific data parts.
 *
 * @template TMetadata - Message metadata type (default: never)
 * @template TDataParts - Custom data parts type (default: AgentDataParts)
 *
 * @example Basic usage
 * ```typescript
 * import type { AgentUIMessage } from '@ai-sdk-tools/agents';
 *
 * const { messages } = useChat<AgentUIMessage>({
 *   api: '/api/chat',
 *   onData: (dataPart) => {
 *     if (dataPart.type === 'data-agent-status') {
 *       console.log('Agent status:', dataPart.data);
 *     }
 *   }
 * });
 * ```
 *
 * @example With custom data parts
 * ```typescript
 * interface MyDataParts extends AgentDataParts {
 *   'custom-metric': { value: number };
 * }
 *
 * const { messages } = useChat<AgentUIMessage<never, MyDataParts>>({
 *   api: '/api/chat'
 * });
 * ```
 */
type AgentUIMessage<TMetadata = never, TDataParts extends Record<string, unknown> = AgentDataParts> = UIMessage<TMetadata, TDataParts>;

declare class Agent<TContext extends Record<string, unknown> = Record<string, unknown>> implements Agent$1<TContext> {
    readonly name: string;
    readonly instructions: string | ((context: TContext) => string);
    readonly matchOn?: (string | RegExp)[] | ((message: string) => boolean);
    readonly onEvent?: (event: AgentEvent) => void | Promise<void>;
    readonly inputGuardrails?: InputGuardrail[];
    readonly outputGuardrails?: OutputGuardrail[];
    readonly permissions?: ToolPermissions;
    readonly lastMessages?: number;
    private readonly memory?;
    private readonly model;
    private readonly aiAgent;
    private readonly handoffAgents;
    private readonly configuredTools;
    private readonly modelSettings?;
    private _cachedSystemPrompt?;
    private _cacheKey?;
    constructor(config: AgentConfig<TContext>);
    generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
    stream(options: AgentStreamOptions | {
        messages: ModelMessage[];
    }): AgentStreamResult;
    getHandoffs(): Array<Agent$1<any>>;
    getConfiguredHandoffs(): Array<ConfiguredHandoff<any>>;
    /**
     * Convert agent execution to UI Message Stream Response
     * High-level API for Next.js route handlers
     *
     * This follows the working pattern from the route.ts reference code
     */
    toUIMessageStream(options: AgentStreamOptionsUI): Response;
    /**
     * Extract chatId and userId from context for memory operations
     */
    private extractMemoryIdentifiers;
    /**
     * Generate a title for the chat based on the first user message
     */
    private generateChatTitle;
    /**
     * Build capabilities description from available tools and agents
     */
    private buildCapabilitiesDescription;
    /**
     * Generate contextual prompt suggestions after agent response
     */
    private generateSuggestions;
    /**
     * Create the updateWorkingMemory tool
     */
    private createWorkingMemoryTool;
    /**
     * Load working memory and inject into system prompt
     */
    private loadWorkingMemory;
    /**
     * Load message history from memory and prepend to the current message.
     * Falls back to just the current message if history is disabled or unavailable.
     *
     * @param message - The current user message
     * @param context - Execution context containing chatId
     * @returns Array of ModelMessages including history + current message
     */
    private loadMessagesWithHistory;
    /**
     * Save user and assistant messages, then update chat session.
     * Messages are saved in parallel for better performance.
     *
     * @param chatId - The chat identifier
     * @param userId - Optional user identifier
     * @param userMessage - The user's message text
     * @param assistantMessage - The assistant's response text
     * @param existingChat - Pre-loaded chat object to avoid duplicate queries
     */
    private saveConversation;
    /**
     * Generate a chat title if this is the first message.
     * Runs asynchronously without blocking the response.
     *
     * @param context - Execution context containing chatId
     * @param userMessage - The user's message to generate title from
     * @param writer - Stream writer for sending title update
     * @param existingChat - Pre-loaded chat object to avoid duplicate queries
     */
    private maybeGenerateChatTitle;
    static create<TContext extends Record<string, unknown> = Record<string, unknown>>(config: AgentConfig<TContext>): Agent<TContext>;
}

/**
 * Context Management using AI SDK's experimental_context
 *
 * This provides type-safe context that flows through tools via AI SDK's
 * built-in experimental_context parameter.
 *
 * Key features:
 * - Uses AI SDK's official context mechanism
 * - Fully flexible user context - pass ANY type you want (object, string, class instance, etc.)
 * - Stream writer for artifacts and real-time updates
 * - Type-safe with full TypeScript support
 * - Available in all tools via executionOptions.experimental_context
 */

/**
 * Core execution context that flows through tools via AI SDK
 *
 * This merges your custom context with required system fields.
 * Your context fields are available at the top level alongside writer and metadata.
 *
 * @template TContext - Your custom context type (must be an object)
 */
type ExecutionContext<TContext extends Record<string, unknown> = Record<string, unknown>> = TContext & {
    /** Stream writer for real-time updates and artifacts */
    writer: UIMessageStreamWriter;
    /** Metadata about the current execution */
    metadata?: {
        /** Current agent name */
        agent?: string;
        /** Execution start time */
        startTime?: Date;
        /** Request ID for tracing */
        requestId?: string;
        /** Chat ID for memory scope */
        chatId?: string;
        /** User ID for memory scope */
        userId?: string;
        /** Any custom metadata */
        [key: string]: unknown;
    };
    /** Memory configuration for persistent context */
    memory?: MemoryConfig;
};
/**
 * Type-safe context creator options
 *
 * @template TContext - Your custom context type (must be an object)
 */
interface ContextOptions<TContext extends Record<string, unknown> = Record<string, unknown>> {
    /** Your custom application context - spread at the top level */
    context: TContext;
    /** Stream writer (required in streaming mode) */
    writer: UIMessageStreamWriter;
    /** Metadata */
    metadata?: ExecutionContext<TContext>["metadata"];
}
/**
 * Create an execution context to pass to AI SDK's experimental_context
 *
 * Your context object is spread at the top level, merged with writer and metadata.
 * This means you can access your fields directly without a wrapper.
 *
 * @template TContext - Your custom context type (must be an object)
 *
 * @example Basic usage
 * ```typescript
 * const context = createExecutionContext({
 *   context: { userId: '123', db: database, permissions: ['read', 'write'] },
 *   writer: streamWriter
 * });
 * // Access in tools: executionOptions.experimental_context.userId
 * ```
 *
 * @example With typed context
 * ```typescript
 * interface MyAppContext {
 *   tenant: string;
 *   workspace: string;
 *   features: string[];
 * }
 *
 * const context = createExecutionContext<MyAppContext>({
 *   context: { tenant: 'acme', workspace: 'main', features: ['analytics'] },
 *   writer: streamWriter
 * });
 * // Access in tools: executionOptions.experimental_context.tenant
 * ```
 *
 * @example With metadata
 * ```typescript
 * const context = createExecutionContext({
 *   context: { userId: '123', tenantId: 'acme' },
 *   writer: streamWriter,
 *   metadata: { agent: 'reports', requestId: 'req_123' }
 * });
 * ```
 */
declare function createExecutionContext<TContext extends Record<string, unknown> = Record<string, unknown>>(options: ContextOptions<TContext>): ExecutionContext<TContext>;
/**
 * Get your custom context from execution options
 *
 * Your context fields are available directly in experimental_context (no wrapper).
 * This helper provides type-safe access.
 *
 * @template T - Your custom context type (object)
 * @param executionOptions - Tool execution options from AI SDK
 * @returns Your custom context
 *
 * @example Direct access (no helper needed)
 * ```typescript
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     // Access fields directly
 *     const userId = executionOptions.experimental_context.userId;
 *     const db = executionOptions.experimental_context.db;
 *   }
 * });
 * ```
 *
 * @example With typed helper
 * ```typescript
 * interface AppContext {
 *   userId: string;
 *   tenantId: string;
 *   db: Database;
 * }
 *
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     const { userId, tenantId, db } = getContext<AppContext>(executionOptions);
 *     const user = await db.users.findOne(userId);
 *   }
 * });
 * ```
 */
declare function getContext<T extends Record<string, unknown> = Record<string, unknown>>(executionOptions?: {
    experimental_context?: unknown;
}): T | undefined;

/**
 * Base error class for all agent errors
 */
declare class AgentsError extends Error {
    readonly state?: unknown | undefined;
    constructor(message: string, state?: unknown | undefined);
}
/**
 * Error thrown when input guardrail tripwire is triggered
 */
declare class InputGuardrailTripwireTriggered extends AgentsError {
    readonly guardrailName: string;
    readonly outputInfo?: unknown | undefined;
    constructor(guardrailName: string, outputInfo?: unknown | undefined, state?: unknown);
}
/**
 * Error thrown when output guardrail tripwire is triggered
 */
declare class OutputGuardrailTripwireTriggered extends AgentsError {
    readonly guardrailName: string;
    readonly outputInfo?: unknown | undefined;
    constructor(guardrailName: string, outputInfo?: unknown | undefined, state?: unknown);
}
/**
 * Error thrown when a guardrail fails to execute
 */
declare class GuardrailExecutionError extends AgentsError {
    readonly guardrailName: string;
    readonly originalError: Error;
    constructor(guardrailName: string, originalError: Error, state?: unknown);
}
/**
 * Error thrown when maximum turns are exceeded
 */
declare class MaxTurnsExceededError extends AgentsError {
    readonly currentTurns: number;
    readonly maxTurns: number;
    constructor(currentTurns: number, maxTurns: number, state?: unknown);
}
/**
 * Error thrown when a tool call fails
 */
declare class ToolCallError extends AgentsError {
    readonly toolName: string;
    readonly originalError: Error;
    constructor(toolName: string, originalError: Error, state?: unknown);
}
/**
 * Error thrown for tool permission denial
 */
declare class ToolPermissionDeniedError extends AgentsError {
    readonly toolName: string;
    readonly reason: string;
    constructor(toolName: string, reason: string, state?: unknown);
}
/**
 * Run input guardrails in parallel
 */
declare function runInputGuardrails(guardrails: InputGuardrail[], input: string, context?: unknown): Promise<void>;
/**
 * Run output guardrails in parallel
 */
declare function runOutputGuardrails<TOutput = unknown>(guardrails: OutputGuardrail<TOutput>[], agentOutput: TOutput, context?: unknown): Promise<void>;

/**
 * Creates a handoff instruction for transferring to another agent
 */
declare function createHandoff(targetAgent: Agent$1 | string, context?: string, reason?: string): HandoffInstruction;
/**
 * Creates a configured handoff from an agent
 */
declare function handoff<TContext extends Record<string, unknown> = Record<string, unknown>>(agent: Agent$1<TContext>, config?: HandoffConfig<TContext>): ConfiguredHandoff<TContext>;
/**
 * Generates the message that will be given as tool output to the model that requested the handoff
 */
declare function getTransferMessage<TContext extends Record<string, unknown>>(agent: Agent$1<TContext>): string;
/**
 * Handoff tool that agents can use to transfer to other agents
 * Updated to work with ConfiguredHandoff
 */
declare function createHandoffTool(availableHandoffs: Array<Agent$1 | ConfiguredHandoff>): ai.Tool<{
    targetAgent: string;
    context?: string | undefined;
    reason?: string | undefined;
}, HandoffInstruction>;
/**
 * The standard name for the handoff tool
 */
declare const HANDOFF_TOOL_NAME = "handoff_to_agent";
/**
 * Checks if a tool name is the handoff tool
 */
declare function isHandoffTool(toolName: string | undefined): boolean;
/**
 * Checks if a result contains a handoff instruction
 */
declare function isHandoffResult(result: unknown): result is HandoffInstruction;

/**
 * Tool Permissions System
 *
 * Runtime access control for tool execution
 */

/**
 * Check if a tool can be executed based on permissions
 */
declare function checkToolPermission(permissions: ToolPermissions | undefined, toolName: string, args: unknown, context: ToolPermissionContext): Promise<void>;
/**
 * Create a tool usage tracker for permission context
 */
declare function createUsageTracker(): ToolPermissionContext["usage"];
/**
 * Update usage tracker with tool call
 */
declare function trackToolCall(usage: ToolPermissionContext["usage"], toolName: string): void;

/**
 * Programmatic Routing System
 *
 * Matches user messages to agents based on keywords, patterns, or custom functions
 */

/**
 * Match a message against an agent's matchOn patterns
 */
declare function matchAgent(agent: Agent$1, message: string, matchOn?: (string | RegExp)[] | ((message: string) => boolean)): {
    matched: boolean;
    score: number;
};
/**
 * Find the best matching agent from a list of agents
 */
declare function findBestMatch(agents: Agent$1[], message: string, getMatchOn?: (agent: Agent$1) => (string | RegExp)[] | ((message: string) => boolean) | undefined): Agent$1 | null;

/**
 * Type-safe streaming utilities for agent orchestration
 *
 * This module provides helper functions for writing custom data parts
 * to the UI message stream following the AI SDK's streaming data pattern.
 */

/**
 * Write a typed data part to the stream.
 *
 * This helper provides type-safe access to agent data parts while handling
 * the necessary type assertions for AI SDK's internal types.
 *
 * @template K - Key of the data part type
 * @param writer - The UI message stream writer
 * @param type - The data part type (e.g., 'data-agent-status')
 * @param data - The data payload
 * @param options - Additional options (transient, id for reconciliation)
 *
 * @example
 * ```typescript
 * writeDataPart(writer, 'data-agent-status', {
 *   status: 'executing',
 *   agent: 'analytics'
 * }, { transient: true });
 * ```
 */
declare function writeDataPart<K extends keyof AgentDataParts>(writer: UIMessageStreamWriter, type: `data-${K}`, data: AgentDataParts[K], options?: {
    transient?: boolean;
    id?: string;
}): void;
/**
 * Write a transient agent status update.
 *
 * Status updates are ephemeral and won't be added to message history.
 * They're only available via the onData callback in useChat.
 *
 * @param writer - The UI message stream writer
 * @param status - The status update data
 *
 * @example
 * ```typescript
 * writeAgentStatus(writer, {
 *   status: 'routing',
 *   agent: 'orchestrator'
 * });
 * ```
 */
declare function writeAgentStatus(writer: UIMessageStreamWriter, status: AgentDataParts["agent-status"]): void;
/**
 * Write a transient rate limit update.
 *
 * Rate limit updates are ephemeral and won't be added to message history.
 * They're only available via the onData callback in useChat.
 *
 * @param writer - The UI message stream writer
 * @param rateLimit - The rate limit data
 *
 * @example
 * ```typescript
 * writeRateLimit(writer, {
 *   limit: 100,
 *   remaining: 95,
 *   reset: '2024-01-01T00:00:00Z'
 * });
 * ```
 */
declare function writeRateLimit(writer: UIMessageStreamWriter, rateLimit: AgentDataParts["rate-limit"]): void;

/**
 * Extract text content from a ModelMessage.
 * Handles both string content and content arrays with text parts.
 *
 * @param message - The message to extract text from
 * @returns The extracted text content, or an empty string if none found
 *
 * @example
 * ```ts
 * const text = extractTextFromMessage(message);
 * // "Hello world"
 * ```
 */
declare function extractTextFromMessage(message: ModelMessage | undefined): string;

export { Agent, type AgentConfig, type AgentDataParts, type AgentEvent, type AgentGenerateOptions, type AgentGenerateResult, AgentRunContext, type AgentStreamOptions, type AgentStreamOptionsUI, type AgentStreamResult, type AgentUIMessage, AgentsError, type ConfiguredHandoff, type ContextOptions, type ExecutionContext, type ExtendedExecutionContext, GuardrailExecutionError, type GuardrailResult, HANDOFF_TOOL_NAME, type HandoffConfig, type HandoffData, type HandoffInstruction, type InputGuardrail, InputGuardrailTripwireTriggered, MaxTurnsExceededError, type MemoryIdentifiers, type OutputGuardrail, OutputGuardrailTripwireTriggered, ToolCallError, type ToolPermissionCheck, type ToolPermissionContext, ToolPermissionDeniedError, type ToolPermissionResult, type ToolPermissions, checkToolPermission, createExecutionContext, createHandoff, createHandoffTool, createUsageTracker, extractTextFromMessage, findBestMatch, getContext, getTransferMessage, handoff, isHandoffResult, isHandoffTool, matchAgent, runInputGuardrails, runOutputGuardrails, trackToolCall, writeAgentStatus, writeDataPart, writeRateLimit };
