import { RedisClientType } from 'redis';
import { d as MemoryProvider, e as MemoryScope, W as WorkingMemory, C as ConversationMessage, U as UIMessage, a as ChatSession } from '../types-CTmklkd-.cjs';

/**
 * ioredis client interface
 */
interface IORedisClient {
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<string>;
    rpush(key: string, ...values: string[]): Promise<number>;
    ltrim(key: string, start: number, stop: number): Promise<string>;
    expire(key: string, seconds: number): Promise<number>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    hset(key: string, data: Record<string, unknown>): Promise<number>;
    hgetall(key: string): Promise<Record<string, string> | null>;
    zadd(key: string, ...args: Array<{
        score: number;
        member: string;
    }>): Promise<number>;
    zrange(key: string, start: number, stop: number): Promise<string[]>;
    zrevrange(key: string, start: number, stop: number): Promise<string[]>;
    keys(pattern: string): Promise<string[]>;
    del(key: string): Promise<number>;
    zrem(key: string, member: string): Promise<number>;
}
/**
 * redis package (v4+) client interface
 */
interface RedisPackageClient {
    get(key: string): Promise<string | null>;
    setEx(key: string, seconds: number, value: string): Promise<string>;
    rPush(key: string, ...values: string[]): Promise<number>;
    lTrim(key: string, start: number, stop: number): Promise<string>;
    expire(key: string, seconds: number): Promise<number>;
    lRange(key: string, start: number, stop: number): Promise<string[]>;
    hSet(key: string, data: Record<string, unknown>): Promise<number>;
    hGetAll(key: string): Promise<Record<string, string> | null>;
    zAdd(key: string, ...args: Array<{
        score: number;
        value: string;
    }>): Promise<number>;
    zRange(key: string, start: number, stop: number): Promise<string[]>;
    zRevRange(key: string, start: number, stop: number): Promise<string[]>;
    keys(pattern: string): Promise<string[]>;
    del(key: string): Promise<number>;
    zRem(key: string, member: string): Promise<number>;
}
/**
 * Supported Redis client types (ioredis or redis package)
 */
type RedisClient = IORedisClient | RedisPackageClient | RedisClientType;
/**
 * Configuration options for RedisProvider
 */
interface RedisProviderOptions {
    /** Key prefix for all Redis keys (default: "memory:") */
    prefix?: string;
    /** TTL in seconds for message lists (default: no expiration) */
    messageTtl?: number;
}
/**
 * Redis provider - standard Redis client (ioredis or redis package)
 *
 * Supports both `ioredis` and `redis` npm packages for traditional Redis instances.
 * Use this provider when you have a self-hosted Redis server or Redis Cloud instance.
 *
 * @example With ioredis
 * ```typescript
 * import Redis from "ioredis";
 * import { RedisProvider } from "@ai-sdk-tools/memory/redis";
 *
 * const redis = new Redis(process.env.REDIS_URL);
 * const memory = new RedisProvider(redis);
 * ```
 *
 * @example With redis package and custom options
 * ```typescript
 * import { createClient } from "redis";
 * import { RedisProvider } from "@ai-sdk-tools/memory/redis";
 *
 * const redis = createClient({ url: process.env.REDIS_URL });
 * await redis.connect();
 * const memory = new RedisProvider(redis, {
 *   prefix: "my-app:memory:",
 *   messageTtl: 60 * 60 * 24 * 30, // 30 days (optional, default: no expiration)
 * });
 * ```
 */
declare class RedisProvider implements MemoryProvider {
    private readonly isRedisPackage;
    private readonly ioredis;
    private readonly redisPkg;
    private readonly messageTtl?;
    private readonly prefix;
    constructor(redis: RedisClient, options?: RedisProviderOptions);
    private setex;
    private rpush;
    private ltrim;
    private lrange;
    private hset;
    private hgetall;
    private zadd;
    private zrange;
    private zrevrange;
    private get;
    private expire;
    private keys;
    private del;
    private zrem;
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

export { RedisProvider, type RedisProviderOptions };
