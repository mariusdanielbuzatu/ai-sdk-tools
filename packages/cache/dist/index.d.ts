import { Tool } from 'ai';
export { Tool } from 'ai';

/**
 * Cache configuration options
 */
interface CacheOptions {
    /** Cache duration in milliseconds (default: 5 minutes) */
    ttl?: number;
    /** Maximum cache size (default: 1000 entries) */
    maxSize?: number;
    /** Custom cache store backend */
    store?: CacheStore;
    /** Custom cache key generator */
    keyGenerator?: (params: any, context?: any) => string;
    /** Function to generate cache key context */
    cacheKey?: () => string;
    /** Whether to cache this result */
    shouldCache?: (params: any, result: any) => boolean;
    /** Cache hit callback */
    onHit?: (key: string) => void;
    /** Cache miss callback */
    onMiss?: (key: string) => void;
    /** Enable debug logging */
    debug?: boolean;
}
/**
 * Cache entry with metadata
 */
interface CacheEntry<T = any> {
    /** Cached result */
    result: T;
    /** Timestamp when cached */
    timestamp: number;
    /** Cache key */
    key: string;
}
/**
 * Cache statistics
 */
interface CacheStats {
    /** Number of cache hits */
    hits: number;
    /** Number of cache misses */
    misses: number;
    /** Hit rate (0-1) */
    hitRate: number;
    /** Current cache size */
    size: number;
    /** Maximum cache size */
    maxSize: number;
}
/**
 * Cached tool interface - combines CoreTool with cache methods
 */
type CachedTool<T extends Tool = Tool> = T & {
    /** Get cache statistics */
    getStats(): CacheStats;
    /** Clear cache entries */
    clearCache(key?: string): void;
    /** Check if parameters are cached */
    isCached(params: any): boolean | Promise<boolean>;
    /** Get cache key for parameters */
    getCacheKey(params: any): string;
};
/**
 * Internal cache store interface
 * Supports both sync and async operations for different backends
 */
interface CacheStore<T = any> {
    /** Get cached entry */
    get(key: string): CacheEntry<T> | undefined | Promise<CacheEntry<T> | undefined>;
    /** Set cache entry */
    set(key: string, entry: CacheEntry<T>): void | Promise<void>;
    /** Delete cache entry */
    delete(key: string): boolean | Promise<boolean>;
    /** Clear all entries */
    clear(): void | Promise<void>;
    /** Check if key exists */
    has(key: string): boolean | Promise<boolean>;
    /** Get current size */
    size(): number | Promise<number>;
    /** Get all keys */
    keys(): string[] | Promise<string[]>;
    /** Get default TTL if configured */
    getDefaultTTL?(): number | undefined;
}

declare function cached<T extends Tool>(tool: T, options?: CacheOptions): CachedTool<T>;
/**
 * Cache multiple tools with the same configuration
 */
declare function cacheTools<T extends Tool, TTools extends Record<string, T>>(tools: T, options?: CacheOptions): {
    [K in keyof TTools]: CachedTool<TTools[K]>;
};
/**
 * Create a cached function with Redis client or default LRU
 *
 * Example usage:
 * ```ts
 * import { Redis } from "@upstash/redis";
 * import { createCached } from "@ai-sdk-tools/cache";
 *
 * // Upstash Redis
 * const cached = createCached({ cache: Redis.fromEnv() });
 *
 * // Standard Redis
 * const cached = createCached({ cache: Redis.createClient() });
 *
 * // Default LRU (no cache client)
 * const cached = createCached();
 * ```
 */
declare function createCached(options?: {
    cache?: any;
    keyPrefix?: string;
    ttl?: number;
    debug?: boolean;
    cacheKey?: () => string;
    onHit?: (key: string) => void;
    onMiss?: (key: string) => void;
}): <T extends Tool>(tool: T, options?: Omit<CacheOptions, "store">) => CachedTool<T>;

export { type CacheOptions, type CachedTool, cacheTools, cached, createCached };
