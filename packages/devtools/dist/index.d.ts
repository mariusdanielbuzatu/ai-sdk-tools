import * as react_jsx_runtime from 'react/jsx-runtime';
import { LanguageModelUsage } from 'ai';
import * as react from 'react';
import react__default from 'react';
import { NodeProps } from '@xyflow/react';

type AIEventType = "tool-call-start" | "tool-call-result" | "tool-call-error" | "message-start" | "message-chunk" | "message-complete" | "start" | "start-step" | "text-start" | "text-delta" | "text-end" | "reasoning-start" | "reasoning-delta" | "reasoning-end" | "finish-step" | "finish" | "stream-done" | "error" | "custom-data" | "unknown" | "agent-start" | "agent-step" | "agent-finish" | "agent-handoff" | "agent-complete" | "agent-error";
interface AIEvent {
    id: string;
    timestamp: number;
    type: AIEventType;
    data: any & {
        usage: LanguageModelUsage;
    };
    metadata?: {
        toolName?: string;
        toolCallId?: string;
        toolParams?: Record<string, any>;
        duration?: number;
        messageId?: string;
        preliminary?: boolean;
        agent?: string;
        round?: number;
        fromAgent?: string;
        toAgent?: string;
        reason?: string;
        totalRounds?: number;
        routingStrategy?: "programmatic" | "llm";
        matchScore?: number;
        [key: string]: any;
    };
}
interface FilterOptions {
    types: AIEventType[];
    toolNames: string[];
    searchQuery: string;
    timeRange?: {
        start: number;
        end: number;
    };
}
interface DevtoolsConfig {
    enabled: boolean;
    maxEvents: number;
    position: "bottom" | "right" | "overlay";
    height?: number;
    width?: number;
    theme?: "light" | "dark" | "auto";
    streamCapture?: {
        enabled: boolean;
        endpoint: string;
        autoConnect: boolean;
    };
    throttle?: {
        enabled: boolean;
        interval: number;
        excludeTypes?: AIEventType[];
        includeTypes?: AIEventType[];
    };
}
interface ToolCallSession {
    id: string;
    toolName: string;
    toolCallId?: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status: "running" | "completed" | "error";
    events: AIEvent[];
    startEvent: AIEvent;
    endEvent?: AIEvent;
}
interface UseAIDevtoolsOptions {
    enabled?: boolean;
    maxEvents?: number;
    onEvent?: (event: AIEvent) => void;
    modelId?: string;
    debug?: boolean;
    streamCapture?: {
        enabled?: boolean;
        endpoints?: string[];
        autoConnect?: boolean;
    };
    throttle?: {
        enabled?: boolean;
        interval?: number;
        excludeTypes?: AIEventType[];
        includeTypes?: AIEventType[];
    };
}
interface UseAIDevtoolsReturn {
    events: AIEvent[];
    isCapturing: boolean;
    clearEvents: () => void;
    toggleCapturing: () => void;
    filterEvents: (filterTypes?: AIEventType[], searchQuery?: string, toolNames?: string[]) => AIEvent[];
    getUniqueToolNames: () => string[];
    getEventStats: () => {
        total: number;
        byType: Record<AIEventType, number>;
        byTool: Record<string, number>;
        timeRange: {
            start: number;
            end: number;
        } | null;
    };
}
interface AgentNode$1 {
    id: string;
    name: string;
    status: "idle" | "executing" | "completed" | "error";
    startTime?: number;
    endTime?: number;
    duration?: number;
    toolCallCount: number;
    routingStrategy?: "programmatic" | "llm";
    matchScore?: number;
    round?: number;
    model?: string;
}
interface AgentHandoff {
    id: string;
    from: string;
    to: string;
    reason?: string;
    routingStrategy?: "programmatic" | "llm";
    timestamp: number;
}
interface ToolNode$1 {
    id: string;
    name: string;
    agent?: string;
    description?: string;
    callCount: number;
}
interface AgentFlowData {
    nodes: AgentNode$1[];
    tools: ToolNode$1[];
    handoffs: AgentHandoff[];
    totalRounds: number;
    totalDuration: number;
    isActive: boolean;
}

interface AgentFlowVisualizationProps {
    events: AIEvent[];
}
declare function AgentFlowVisualization({ events, }: AgentFlowVisualizationProps): react_jsx_runtime.JSX.Element;

declare function AgentNodeComponent({ data }: NodeProps): react_jsx_runtime.JSX.Element;
declare const AgentNode: react.MemoExoticComponent<typeof AgentNodeComponent>;

interface AIDevtoolsProps extends UseAIDevtoolsOptions {
    config?: Partial<DevtoolsConfig>;
    className?: string;
    debug?: boolean;
}
declare function AIDevtools({ enabled, maxEvents, onEvent, config, className, debug, }: AIDevtoolsProps): react_jsx_runtime.JSX.Element | null;

interface DevtoolsButtonProps {
    onToggle: () => void;
    eventCount: number;
    hasNewEvents: boolean;
    className?: string;
}
declare function DevtoolsButton({ onToggle, eventCount, hasNewEvents, className, }: DevtoolsButtonProps): react_jsx_runtime.JSX.Element;

interface DevtoolsPanelProps {
    events: AIEvent[];
    isCapturing: boolean;
    onToggleCapturing: () => void;
    onClearEvents: () => void;
    onClose: () => void;
    onTogglePosition: () => void;
    config: DevtoolsConfig;
    className?: string;
}
declare function DevtoolsPanel({ events, isCapturing, onToggleCapturing, onClearEvents, onClose, onTogglePosition, config, className, }: DevtoolsPanelProps): react_jsx_runtime.JSX.Element;

interface EventItemProps {
    event: AIEvent;
    className?: string;
}
declare function EventItem({ event, className }: EventItemProps): react_jsx_runtime.JSX.Element;

interface EventListProps {
    events: AIEvent[];
    className?: string;
    groupByToolCalls?: boolean;
}
declare function EventList({ events, className, groupByToolCalls, }: EventListProps): react_jsx_runtime.JSX.Element;

interface StateDataExplorerProps {
    currentState?: unknown;
    className?: string;
}
declare function StateDataExplorer({ currentState, className, }: StateDataExplorerProps): react_jsx_runtime.JSX.Element;

interface StoreListProps {
    storeIds: string[];
    selectedStoreId: string | null;
    onSelectStore: (storeId: string) => void;
}
declare function StoreList({ storeIds, selectedStoreId, onSelectStore, }: StoreListProps): react_jsx_runtime.JSX.Element;

declare function ToolNodeComponent({ data }: NodeProps): react_jsx_runtime.JSX.Element;
declare const ToolNode: react.MemoExoticComponent<typeof ToolNodeComponent>;

declare function useAIDevtools(options?: UseAIDevtoolsOptions): UseAIDevtoolsReturn;

interface UseCurrentStateOptions {
    enabled?: boolean;
}
interface UseCurrentStateReturn {
    isStoreAvailable: boolean;
    availableStoreIds: string[];
    currentStates: Record<string, unknown>;
    refreshStates: () => void;
}
declare function useCurrentState(options?: UseCurrentStateOptions): UseCurrentStateReturn;

/**
 * Debug logging utility for AI SDK Devtools
 * Provides controlled logging that only outputs when debug mode is enabled
 */
declare function createDebugLogger(debug: boolean): (...args: any[]) => void;

/**
 * Parses a Server-Sent Event message and converts it to an AIEvent
 */
declare function parseSSEEvent(eventData: string, eventType: string, eventId: string): AIEvent | null;
/**
 * Parses a data part from the AI stream and converts it to an AIEvent
 * This function handles AI SDK stream parts and custom event types
 */
declare function parseEventFromDataPart(dataPart: any, eventId: string): AIEvent | null;
/**
 * Formats event data for display
 */
declare function formatEventData(event: AIEvent): string;
/**
 * Gets a human-readable description of the event
 */
declare function getEventDescription(event: AIEvent): string;

/**
 * Formats a timestamp to a readable time string
 */
declare function formatTimestamp(timestamp: number): string;
/**
 * Gets a color for an event type
 */
declare function getEventTypeColor(type: string): string;
/**
 * Gets an icon for an event type (using better Material-UI icons)
 */
declare function getEventTypeIcon(type: string): react__default.ReactElement;

/**
 * Groups events into tool call sessions for better debugging experience
 */
declare function groupEventsIntoSessions(events: AIEvent[]): {
    sessions: ToolCallSession[];
    standaloneEvents: AIEvent[];
};
/**
 * Gets a summary of a tool call session
 */
declare function getSessionSummary(session: ToolCallSession): string;
/**
 * Gets the status color for a tool call session
 */
declare function getSessionStatusColor(session: ToolCallSession): string;
/**
 * Gets the status icon for a tool call session
 */
declare function getSessionStatusIcon(session: ToolCallSession): string;

interface StreamInterceptorOptions {
    onEvent: (event: AIEvent) => void;
    endpoints: string[];
    enabled: boolean;
    debug?: boolean;
}
declare class StreamInterceptor {
    private originalFetch;
    private options;
    private eventIdCounter;
    private isPatched;
    private hasErrors;
    constructor(options: StreamInterceptorOptions);
    private generateEventId;
    private shouldInterceptUrl;
    private interceptStreamResponse;
    private parseSSEChunk;
    patch(): void;
    unpatch(): void;
    updateOptions(options: Partial<StreamInterceptorOptions>): void;
    isActive(): boolean;
}

/**
 * Working state detection utilities
 */
declare function isStorePackageAvailable(): boolean;

export { AIDevtools, type AIEvent, type AIEventType, type AgentFlowData, AgentFlowVisualization, type AgentHandoff, AgentNode, type AgentNode$1 as AgentNodeData, DevtoolsButton, type DevtoolsConfig, DevtoolsPanel, EventItem, EventList, type FilterOptions, StateDataExplorer, StoreList, StreamInterceptor, type ToolCallSession, ToolNode, type ToolNode$1 as ToolNodeData, type UseAIDevtoolsOptions, type UseAIDevtoolsReturn, createDebugLogger, formatEventData, formatTimestamp, getEventDescription, getEventTypeColor, getEventTypeIcon, getSessionStatusColor, getSessionStatusIcon, getSessionSummary, groupEventsIntoSessions, isStorePackageAvailable, parseEventFromDataPart, parseSSEEvent, useAIDevtools, useCurrentState };
