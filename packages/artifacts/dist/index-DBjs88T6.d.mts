import { UIMessageStreamWriter } from 'ai';
import { z } from 'zod';

type ArtifactStatus = "idle" | "loading" | "streaming" | "complete" | "error";
declare class ArtifactError extends Error {
    code: string;
    constructor(code: string, message: string);
}
interface ArtifactData<T = unknown> {
    id: string;
    type: string;
    status: ArtifactStatus;
    payload: T;
    version: number;
    progress?: number;
    error?: string;
    createdAt: number;
    updatedAt: number;
}
interface ArtifactConfig<T = unknown> {
    id: string;
    schema: z.ZodSchema<T>;
}
interface ArtifactCallbacks<T = unknown> {
    onUpdate?: (data: T, prevData: T | null) => void;
    onComplete?: (data: T) => void;
    onError?: (error: string, data: T | null) => void;
    onProgress?: (progress: number, data: T) => void;
    onStatusChange?: (status: ArtifactStatus, prevStatus: ArtifactStatus) => void;
}
interface UseArtifactOptions<T = unknown> extends ArtifactCallbacks<T> {
    version?: number;
}
interface UseArtifactReturn<T = unknown> {
    data: T | null;
    status: ArtifactStatus;
    progress?: number;
    error?: string;
    isActive: boolean;
    hasData: boolean;
    versions: ArtifactData<T>[];
    currentIndex?: number;
}
interface UseArtifactActions {
    delete: (artifactId: string) => void;
}
interface UseArtifactsOptions {
    onData?: (artifactType: string, data: ArtifactData<unknown>) => void;
    storeId?: string;
    include?: string[];
    exclude?: string[];
    value?: string | null;
    onChange?: (value: string | null) => void;
    dismissed?: string[];
    onDismissedChange?: (dismissed: string[]) => void;
}
interface UseArtifactsReturn {
    byType: Record<string, ArtifactData<unknown>[]>;
    latestByType: Record<string, ArtifactData<unknown>>;
    artifacts: ArtifactData<unknown>[];
    current: ArtifactData<unknown> | null;
    activeType: string | null;
    activeArtifacts: ArtifactData<unknown>[];
    types: string[];
    latestArtifactType: string | null;
    available: string[];
    dismissed: string[];
}
interface UseArtifactsActions {
    setValue: (value: string | null) => void;
    dismiss: (type: string) => void;
    restore: (type: string) => void;
}

declare class StreamingArtifact<T> {
    private config;
    private instance;
    private writer;
    constructor(config: ArtifactConfig<T>, instance: ArtifactData<T>, writer: UIMessageStreamWriter);
    get data(): T;
    get id(): string;
    get progress(): number | undefined;
    set progress(value: number | undefined);
    update(updates: Partial<T> & {
        progress?: number;
    }): Promise<void>;
    complete(finalData?: T): Promise<void>;
    error(message: string): Promise<void>;
    cancel(): Promise<void>;
    timeout(ms: number): void;
    private stream;
}

declare function artifact<T>(id: string, schema: z.ZodSchema<T>): {
    id: string;
    schema: z.ZodType<T, unknown, z.core.$ZodTypeInternals<T, unknown>>;
    create(data?: Partial<T>): ArtifactData<T>;
    stream(data: Partial<T>, writer: UIMessageStreamWriter): StreamingArtifact<T>;
    validate(data: unknown): T;
    isValid(data: unknown): data is T;
};

/**
 * Artifacts Writer Access
 *
 * Provides access to the stream writer from tool executionOptions.
 * The writer is needed to stream artifact updates to the client.
 *
 */

/**
 * Get writer from execution context
 *
 * @param executionOptions - Tool execution options from AI SDK
 * @returns The stream writer
 *
 * @example
 * ```typescript
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     const writer = getWriter(executionOptions);
 *     const artifact = MyArtifact.stream(data, writer);
 *   }
 * });
 * ```
 */
declare function getWriter(executionOptions?: any): UIMessageStreamWriter;

export { type ArtifactCallbacks as A, StreamingArtifact as S, type UseArtifactOptions as U, type UseArtifactReturn as a, type UseArtifactActions as b, type UseArtifactsOptions as c, type UseArtifactsReturn as d, type UseArtifactsActions as e, type ArtifactConfig as f, type ArtifactData as g, ArtifactError as h, type ArtifactStatus as i, artifact as j, getWriter as k };
