'use strict';

var ai = require('ai');

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../artifacts/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  ArtifactError: () => ArtifactError,
  StreamingArtifact: () => StreamingArtifact,
  artifact: () => artifact,
  getWriter: () => getWriter
});
function generateId() {
  return `artifact_${Date.now()}_${ai.generateId()}`;
}
function getDefaults(schema) {
  try {
    return schema.parse({});
  } catch {
    return {};
  }
}
function artifact(id, schema) {
  const config = { id, schema };
  return {
    id,
    schema,
    create(data = {}) {
      const defaults = getDefaults(schema);
      const validated = schema.parse({ ...defaults, ...data });
      return {
        id: generateId(),
        type: id,
        status: "idle",
        payload: validated,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    },
    stream(data, writer) {
      const instance = this.create(data);
      instance.status = "loading";
      return new StreamingArtifact(config, instance, writer);
    },
    validate(data) {
      return schema.parse(data);
    },
    isValid(data) {
      try {
        schema.parse(data);
        return true;
      } catch {
        return false;
      }
    }
  };
}
function getWriter(executionOptions) {
  const writer = executionOptions?.experimental_context?.writer;
  if (!writer) {
    throw new Error(
      "Writer not available. Make sure you're passing executionOptions: getWriter(executionOptions)"
    );
  }
  return writer;
}
var StreamingArtifact, ArtifactError;
var init_dist = __esm({
  "../artifacts/dist/index.mjs"() {
    StreamingArtifact = class {
      constructor(config, instance, writer) {
        this.config = config;
        this.instance = instance;
        this.writer = writer;
        this.stream();
      }
      get data() {
        return this.instance.payload;
      }
      get id() {
        return this.instance.id;
      }
      get progress() {
        return this.instance.progress;
      }
      set progress(value) {
        this.instance.progress = value;
        this.instance.updatedAt = Date.now();
        this.stream();
      }
      async update(updates) {
        if ("progress" in updates) {
          this.instance.progress = updates.progress;
          delete updates.progress;
        }
        this.instance.payload = { ...this.instance.payload, ...updates };
        this.instance.status = "streaming";
        this.instance.version++;
        this.instance.updatedAt = Date.now();
        this.stream();
      }
      async complete(finalData) {
        if (finalData) {
          this.instance.payload = finalData;
        }
        this.instance.status = "complete";
        this.instance.progress = 1;
        this.instance.version++;
        this.instance.updatedAt = Date.now();
        this.stream();
      }
      async error(message) {
        this.instance.status = "error";
        this.instance.error = message;
        this.instance.version++;
        this.instance.updatedAt = Date.now();
        this.stream();
      }
      async cancel() {
        this.instance.status = "error";
        this.instance.error = "Artifact was cancelled";
        this.instance.version++;
        this.instance.updatedAt = Date.now();
        this.stream();
      }
      timeout(ms) {
        setTimeout(() => {
          if (this.instance.status === "loading" || this.instance.status === "streaming") {
            this.error(`Artifact timed out after ${ms}ms`);
          }
        }, ms);
      }
      stream() {
        this.writer.write({
          type: `data-artifact-${this.config.id}`,
          id: this.instance.id,
          data: this.instance
        });
      }
    };
    ArtifactError = class extends Error {
      constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "ArtifactError";
      }
    };
  }
});

// src/cache-store.ts
var LRUCacheStore = class {
  constructor(maxSize = 1e3) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.cache.set(key, entry);
    }
    return entry;
  }
  set(key, entry) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, entry);
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  has(key) {
    return this.cache.has(key);
  }
  size() {
    return this.cache.size;
  }
  keys() {
    return Array.from(this.cache.keys());
  }
  getDefaultTTL() {
    return void 0;
  }
};
var SimpleCacheStore = class {
  constructor(maxSize = 1e3) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
  }
  get(key) {
    return this.cache.get(key);
  }
  set(key, entry) {
    if (this.cache.size >= this.maxSize) {
      this.cache.clear();
    }
    this.cache.set(key, entry);
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  has(key) {
    return this.cache.has(key);
  }
  size() {
    return this.cache.size;
  }
  keys() {
    return Array.from(this.cache.keys());
  }
  getDefaultTTL() {
    return void 0;
  }
};

// src/backends/memory.ts
var MemoryCacheStore = class {
  constructor(maxSize = 1e3) {
    this.cache = /* @__PURE__ */ new Map();
    this.accessOrder = /* @__PURE__ */ new Map();
    this.accessCounter = 0;
    this.maxSize = maxSize;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      this.accessOrder.set(key, ++this.accessCounter);
    }
    return entry;
  }
  set(key, entry) {
    if (this.cache.has(key)) {
      this.cache.set(key, entry);
      this.accessOrder.set(key, ++this.accessCounter);
      return;
    }
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessOrder.delete(key);
    }
    return deleted;
  }
  clear() {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
  }
  has(key) {
    return this.cache.has(key);
  }
  size() {
    return this.cache.size;
  }
  keys() {
    return Array.from(this.cache.keys());
  }
  getDefaultTTL() {
    return void 0;
  }
  evictLRU() {
    let oldestKey;
    let oldestAccess = Infinity;
    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: this.cache.size / this.maxSize
    };
  }
  /**
   * Clean up expired entries based on TTL
   */
  cleanup(ttl) {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > ttl) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        cleaned++;
      }
    }
    return cleaned;
  }
};

// src/backends/redis.ts
var RedisCacheStore = class {
  constructor(redisClient, keyPrefix = "ai-tools-cache:") {
    this.redis = redisClient;
    this.keyPrefix = keyPrefix;
  }
  getKey(key) {
    return `${this.keyPrefix}${key}`;
  }
  async get(key) {
    try {
      const data = await this.redis.get(this.getKey(key));
      if (!data) return void 0;
      let jsonString;
      if (typeof data === "string") {
        jsonString = data;
      } else if (typeof data === "object") {
        return {
          result: data.result,
          timestamp: data.timestamp,
          key: data.key
        };
      } else {
        jsonString = String(data);
      }
      const parsed = JSON.parse(jsonString);
      return {
        result: parsed.result,
        timestamp: parsed.timestamp,
        key: parsed.key
      };
    } catch (error) {
      console.warn(`Redis cache get error for key ${key}:`, error);
      return void 0;
    }
  }
  async set(key, entry) {
    try {
      const data = JSON.stringify({
        result: entry.result,
        timestamp: entry.timestamp,
        key: entry.key
      });
      await this.redis.set(this.getKey(key), data);
    } catch (error) {
      console.warn(`Redis cache set error for key ${key}:`, error);
    }
  }
  async setWithTTL(key, entry, ttlSeconds) {
    try {
      const data = JSON.stringify({
        result: entry.result,
        timestamp: entry.timestamp,
        key: entry.key
      });
      await this.redis.setex(this.getKey(key), ttlSeconds, data);
    } catch (error) {
      console.warn(`Redis cache setex error for key ${key}:`, error);
    }
  }
  async delete(key) {
    try {
      const result = await this.redis.del(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.warn(`Redis cache delete error for key ${key}:`, error);
      return false;
    }
  }
  async clear() {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.warn("Redis cache clear error:", error);
    }
  }
  async has(key) {
    try {
      const exists = await this.redis.exists(this.getKey(key));
      return exists > 0;
    } catch (error) {
      console.warn(`Redis cache exists error for key ${key}:`, error);
      return false;
    }
  }
  async size() {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      return keys.length;
    } catch (error) {
      console.warn("Redis cache size error:", error);
      return 0;
    }
  }
  async keys() {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      return keys.map((key) => key.replace(this.keyPrefix, ""));
    } catch (error) {
      console.warn("Redis cache keys error:", error);
      return [];
    }
  }
  getDefaultTTL() {
    return void 0;
  }
};

// src/backends/factory.ts
function createCacheBackend(config) {
  let store;
  switch (config.type) {
    case "memory":
      store = new MemoryCacheStore(config.maxSize);
      break;
    case "lru":
      store = new LRUCacheStore(config.maxSize);
      break;
    case "simple":
      store = new SimpleCacheStore(config.maxSize);
      break;
    case "redis":
      if (!config.redis?.client) {
        throw new Error("Redis client is required for redis cache backend");
      }
      store = new RedisCacheStore(config.redis.client, config.redis.keyPrefix);
      break;
    default:
      throw new Error(`Unknown cache backend type: ${config.type}`);
  }
  if (config.defaultTTL) {
    store.getDefaultTTL = () => config.defaultTTL;
  }
  return store;
}

// src/cache.ts
function defaultKeyGenerator(params, context) {
  const paramsKey = serializeValue(params);
  if (context) {
    return `${paramsKey}|${context}`;
  }
  return paramsKey;
}
function serializeValue(value) {
  if (value === null || value === void 0) {
    return "null";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return `[${value.map(serializeValue).join(",")}]`;
  }
  if (typeof value === "object") {
    const sortedKeys = Object.keys(value).sort();
    const pairs = sortedKeys.map(
      (key) => `${key}:${serializeValue(value[key])}`
    );
    return `{${pairs.join(",")}}`;
  }
  return String(value);
}
function createStreamingCachedTool(tool, options) {
  const {
    ttl = 5 * 60 * 1e3,
    maxSize = 1e3,
    store,
    keyGenerator = defaultKeyGenerator,
    cacheKey,
    shouldCache = () => true,
    onHit,
    onMiss,
    debug = false
  } = options;
  const cacheStore = store || new LRUCacheStore(maxSize);
  let hits = 0;
  let misses = 0;
  return {
    ...tool,
    execute: async function* (...args) {
      const [params, executionOptions] = args;
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const now = Date.now();
      const cached2 = await cacheStore.get(key);
      if (cached2 && now - cached2.timestamp < ttl) {
        hits++;
        onHit?.(key);
        const result = cached2.result;
        if (debug) {
          const yields = result?.streamResults?.length || 0;
          const artifacts = result?.messages?.length || 0;
          const hasReturn = result?.returnValue !== void 0;
          console.log(`
\u{1F3AF} Cache HIT - Streaming Tool`);
          console.log(
            `\u250C\u2500 Key: ${key.slice(0, 60)}${key.length > 60 ? "..." : ""}`
          );
          console.log(`\u251C\u2500 Streaming yields: ${yields}`);
          console.log(`\u251C\u2500 Artifact messages: ${artifacts}`);
          console.log(`\u251C\u2500 Return value: ${hasReturn ? "yes" : "no"}`);
          console.log(`\u2514\u2500 Restoring cached results...
`);
        }
        if (result?.messages?.length > 0) {
          let writer2 = executionOptions?.writer || executionOptions?.experimental_context?.writer;
          if (!writer2) {
            try {
              const { getWriter: getWriter2 } = await Promise.resolve().then(() => (init_dist(), dist_exports));
              writer2 = getWriter2(executionOptions);
            } catch {
            }
          }
          if (writer2) {
            if (debug)
              console.log(
                `   Replaying ${result.messages.length} artifact messages...`
              );
            for (const msg of result.messages) {
              writer2.write(msg);
            }
            if (debug) console.log(`   Artifacts restored`);
          }
        }
        if (result?.streamResults) {
          if (debug)
            console.log(
              `   Replaying ${result.streamResults.length} streaming yields...`
            );
          for (const item of result.streamResults) {
            yield item;
          }
          if (debug) console.log(`   Streaming content restored`);
        }
        return result.returnValue;
      }
      misses++;
      onMiss?.(key);
      if (debug) {
        console.log(`
\u{1F504} Cache MISS - Streaming Tool`);
        console.log(
          `\u250C\u2500 Key: ${key.slice(0, 60)}${key.length > 60 ? "..." : ""}`
        );
        console.log(
          `\u251C\u2500 Will capture: streaming yields + artifact messages + return value`
        );
        console.log(`\u2514\u2500 Executing tool and capturing results...
`);
      }
      let writer = executionOptions?.writer || executionOptions?.experimental_context?.writer;
      if (!writer) {
        try {
          const { getWriter: getWriter2 } = await Promise.resolve().then(() => (init_dist(), dist_exports));
          writer = getWriter2(executionOptions);
        } catch {
        }
      }
      const capturedMessages = [];
      if (writer) {
        const originalWrite = writer.write;
        writer.write = (data) => {
          capturedMessages.push(data);
          return originalWrite.call(writer, data);
        };
      }
      const originalResult = await tool.execute?.(params, executionOptions);
      let lastChunk = null;
      let finalReturnValue;
      let chunkCount = 0;
      if (originalResult && typeof originalResult[Symbol.asyncIterator] === "function") {
        const iterator = originalResult[Symbol.asyncIterator]();
        let iterResult = await iterator.next();
        while (!iterResult.done) {
          lastChunk = iterResult.value;
          chunkCount++;
          if (debug && chunkCount <= 3) {
            console.log(
              `   Capturing yield #${chunkCount}:`,
              `${lastChunk?.text?.slice(0, 40)}...`
            );
          }
          yield iterResult.value;
          iterResult = await iterator.next();
        }
        finalReturnValue = iterResult.value;
      }
      queueMicrotask(() => {
        queueMicrotask(async () => {
          try {
            const completeResult = {
              streamResults: lastChunk ? [lastChunk] : [],
              // Only final chunk
              messages: capturedMessages,
              returnValue: finalReturnValue,
              type: "streaming"
            };
            if (shouldCache(params, completeResult)) {
              await cacheStore.set(key, {
                result: completeResult,
                timestamp: now,
                key
              });
              if (debug) {
                const cacheItems = typeof cacheStore.size === "function" ? await cacheStore.size() : "unknown";
                const estimatedSize = JSON.stringify(completeResult).length;
                const sizeKB = Math.round(estimatedSize / 1024 * 100) / 100;
                console.log(`
\u{1F4BE} Cache STORED - Streaming Tool`);
                console.log(`\u250C\u2500 Streaming yields: ${chunkCount}`);
                console.log(`\u251C\u2500 Artifact messages: ${capturedMessages.length}`);
                console.log(
                  `\u251C\u2500 Return value: ${finalReturnValue !== void 0 ? "yes" : "no"}`
                );
                console.log(`\u251C\u2500 Entry size: ~${sizeKB}KB`);
                console.log(`\u251C\u2500 Cache items: ${cacheItems}/${maxSize}`);
                console.log(`\u2514\u2500 Ready for instant replay!
`);
              }
            }
          } catch (error) {
            if (debug) console.log(`[Cache] Microtask caching failed:`, error);
          }
        });
      });
      return finalReturnValue;
    },
    getStats() {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
        size: typeof cacheStore.size === "function" ? cacheStore.size() : 0,
        maxSize
      };
    },
    clearCache(key) {
      if (key) {
        cacheStore.delete(key);
      } else {
        cacheStore.clear();
      }
    },
    async isCached(params) {
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const cached2 = await cacheStore.get(key);
      if (!cached2) return false;
      const now = Date.now();
      const isValid = now - cached2.timestamp < ttl;
      if (!isValid) {
        await cacheStore.delete(key);
        return false;
      }
      return true;
    },
    getCacheKey(params) {
      const context = cacheKey?.();
      return keyGenerator(params, context);
    }
  };
}
function cached(tool, options) {
  if (tool.execute?.constructor?.name === "AsyncGeneratorFunction") {
    return createStreamingCachedTool(tool, options || {});
  }
  const {
    ttl = 5 * 60 * 1e3,
    maxSize = 1e3,
    store,
    keyGenerator = defaultKeyGenerator,
    cacheKey,
    shouldCache = () => true,
    onHit,
    onMiss,
    debug = false
  } = options || {};
  const cacheStore = store || new LRUCacheStore(maxSize);
  const effectiveTTL = ttl ?? cacheStore.getDefaultTTL?.() ?? 5 * 60 * 1e3;
  let hits = 0;
  let misses = 0;
  const log = debug ? console.log : () => {
  };
  const cacheApi = {
    getStats() {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
        size: typeof cacheStore.size === "function" ? cacheStore.size() : 0,
        maxSize
      };
    },
    clearCache(key) {
      if (key) {
        cacheStore.delete(key);
      } else {
        cacheStore.clear();
      }
    },
    async isCached(params) {
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const cached2 = await cacheStore.get(key);
      if (!cached2) return false;
      const now = Date.now();
      const isValid = now - cached2.timestamp < effectiveTTL;
      if (!isValid) {
        await cacheStore.delete(key);
        return false;
      }
      return true;
    },
    getCacheKey(params) {
      const context = cacheKey?.();
      return keyGenerator(params, context);
    }
  };
  const cachedTool = new Proxy(tool, {
    get(target, prop) {
      if (prop === "execute") {
        if (target.execute?.constructor?.name === "AsyncGeneratorFunction") {
          return async function* (...args) {
            const [params, executionOptions] = args;
            const context = cacheKey?.();
            const key = keyGenerator(params, context);
            const now = Date.now();
            const cached2 = await cacheStore.get(key);
            if (cached2 && now - cached2.timestamp < effectiveTTL) {
              hits++;
              onHit?.(key);
              log(`[Cache] HIT`);
              const result2 = cached2.result;
              if (target.execute?.constructor?.name === "AsyncGeneratorFunction") {
                if (result2?.messages?.length > 0) {
                  const writer2 = executionOptions?.writer || executionOptions?.experimental_context?.writer;
                  if (writer2) {
                    log(`[Cache] Replaying ${result2.messages.length} messages`);
                    for (const msg of result2.messages) {
                      writer2.write(msg);
                    }
                  }
                }
                return (async function* () {
                  if (result2?.streamResults) {
                    for (const item of result2.streamResults) {
                      yield item;
                    }
                  } else if (Array.isArray(result2)) {
                    for (const item of result2) {
                      yield item;
                    }
                  } else {
                    yield result2;
                  }
                })();
              }
              return result2;
            }
            misses++;
            onMiss?.(key);
            log(`[Cache] MISS`);
            const writer = executionOptions?.writer || executionOptions?.experimental_context?.writer;
            const capturedMessages = [];
            if (writer) {
              const originalWrite = writer.write;
              writer.write = (data) => {
                capturedMessages.push(data);
                return originalWrite.call(writer, data);
              };
            }
            const result = await target.execute?.(params, executionOptions);
            if (result && typeof result[Symbol.asyncIterator] === "function") {
              let lastChunk = null;
              const streamGenerator = (async function* () {
                for await (const chunk of result) {
                  lastChunk = chunk;
                  yield chunk;
                }
                queueMicrotask(async () => {
                  const completeResult = {
                    streamResults: lastChunk ? [lastChunk] : [],
                    // Only store final chunk
                    messages: capturedMessages,
                    type: "streaming"
                  };
                  if (shouldCache(params, completeResult)) {
                    await cacheStore.set(key, {
                      result: completeResult,
                      timestamp: now,
                      key
                    });
                    log(
                      `[Cache] STORED streaming result with ${capturedMessages.length} messages`
                    );
                  }
                });
              })();
              return streamGenerator;
            }
            if (shouldCache(params, result)) {
              await cacheStore.set(key, {
                result,
                timestamp: now,
                key
              });
              log(`[Cache] STORED result`);
            }
            return result;
          };
        } else {
          return async (...args) => {
            const [params, executionOptions] = args;
            const context = cacheKey?.();
            const key = keyGenerator(params, context);
            const now = Date.now();
            const cached2 = await cacheStore.get(key);
            if (cached2 && now - cached2.timestamp < effectiveTTL) {
              hits++;
              onHit?.(key);
              log(`[Cache] HIT`);
              return cached2.result;
            }
            misses++;
            onMiss?.(key);
            log(`[Cache] MISS`);
            const result = await target.execute?.(params, executionOptions);
            if (shouldCache(params, result)) {
              await cacheStore.set(key, {
                result,
                timestamp: now,
                key
              });
              log(`[Cache] STORED result`);
            }
            return result;
          };
        }
      }
      if (prop in cacheApi) {
        return cacheApi[prop];
      }
      return target[prop];
    }
  });
  return cachedTool;
}
function createCachedFunction(store, defaultOptions = {}) {
  return (tool, options = {}) => {
    return cached(tool, { ...defaultOptions, ...options, store });
  };
}
function cacheTools(tools, options = {}) {
  const cachedTools = {};
  for (const [name, tool] of Object.entries(tools)) {
    cachedTools[name] = cached(tool, options);
  }
  return cachedTools;
}
function createCached(options = {}) {
  if (!options.cache) {
    const lruStore = createCacheBackend({
      type: "lru",
      maxSize: 100,
      defaultTTL: options.ttl || 10 * 60 * 1e3
      // 10 minutes default
    });
    return createCachedFunction(lruStore, {
      debug: options.debug || false,
      cacheKey: options.cacheKey,
      onHit: options.onHit,
      onMiss: options.onMiss
    });
  }
  const redisStore = createCacheBackend({
    type: "redis",
    defaultTTL: options.ttl || 30 * 60 * 1e3,
    // 30 minutes default
    redis: {
      client: options.cache,
      // Pass user's Redis client directly
      keyPrefix: options.keyPrefix || "ai-tools-cache:"
    }
  });
  return createCachedFunction(redisStore, {
    debug: options.debug || false,
    cacheKey: options.cacheKey,
    onHit: options.onHit,
    onMiss: options.onMiss
  });
}

exports.cacheTools = cacheTools;
exports.cached = cached;
exports.createCached = createCached;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map