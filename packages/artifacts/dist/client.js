"use client";

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

// src/client.ts
var client_exports = {};
__export(client_exports, {
  ArtifactError: () => ArtifactError,
  StreamingArtifact: () => StreamingArtifact,
  artifact: () => artifact,
  getWriter: () => getWriter,
  useArtifact: () => useArtifact,
  useArtifacts: () => useArtifacts
});
module.exports = __toCommonJS(client_exports);

// src/streaming.ts
var StreamingArtifact = class {
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

// src/utils.ts
var import_ai = require("ai");
function generateId() {
  return `artifact_${Date.now()}_${(0, import_ai.generateId)()}`;
}
function getDefaults(schema) {
  try {
    return schema.parse({});
  } catch {
    return {};
  }
}

// src/artifact.ts
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

// src/context.ts
function getWriter(executionOptions) {
  const writer = executionOptions?.experimental_context?.writer;
  if (!writer) {
    throw new Error(
      "Writer not available. Make sure you're passing executionOptions: getWriter(executionOptions)"
    );
  }
  return writer;
}

// src/hooks.ts
var import_store = require("@ai-sdk-tools/store");
var import_react = require("react");
function removeArtifactFromMessage(message, artifactId) {
  if (!message.parts || !Array.isArray(message.parts)) {
    return message;
  }
  const updatedParts = message.parts.filter((part) => {
    if (part.type.startsWith("data-artifact-") && "data" in part) {
      const artifactPart = part;
      if (artifactPart.data?.id === artifactId) {
        return false;
      }
    }
    if (part.type.startsWith("tool-") && "result" in part && part.result) {
      const result = part.result;
      if (typeof result === "object" && result && "parts" in result) {
        const parts = result.parts;
        if (Array.isArray(parts)) {
          const filteredParts = parts.filter((nestedPart) => {
            const part2 = nestedPart;
            if (part2.type?.startsWith("data-artifact-") && part2.data?.id === artifactId) {
              return false;
            }
            return true;
          });
          if (filteredParts.length !== parts.length) {
            const toolPart = part;
            toolPart.result = {
              ...result,
              parts: filteredParts
            };
          }
        }
      }
    }
    return true;
  });
  if (updatedParts.length === 0) {
    return null;
  }
  return {
    ...message,
    parts: updatedParts
  };
}
function useArtifact(artifactDef, options) {
  const messages = (0, import_store.useChatMessages)();
  const { replaceMessageById } = (0, import_store.useChatActions)();
  const { version: versionIndex } = options || {};
  const includeVersions = versionIndex !== void 0;
  const callbacksRef = (0, import_react.useRef)(options);
  (0, import_react.useEffect)(() => {
    callbacksRef.current = options;
  }, [options]);
  const [currentArtifact, setCurrentArtifact] = (0, import_react.useState)(null);
  const allArtifacts = (0, import_react.useMemo)(
    () => extractArtifactsFromMessages(
      messages,
      artifactDef.id
    ),
    [messages, artifactDef.id]
  );
  const latest = allArtifacts[0] || null;
  (0, import_react.useEffect)(() => {
    if (latest && (!currentArtifact || latest.version > currentArtifact.version || latest.version === currentArtifact.version && latest.createdAt > currentArtifact.createdAt)) {
      const prevData = currentArtifact?.payload || null;
      const currentCallbacks = callbacksRef.current;
      if (!includeVersions) {
        if (currentCallbacks && "onUpdate" in currentCallbacks && currentCallbacks.onUpdate && latest.payload !== prevData) {
          currentCallbacks.onUpdate(latest.payload, prevData);
        }
        if (currentCallbacks && "onComplete" in currentCallbacks && currentCallbacks.onComplete && latest.status === "complete" && currentArtifact?.status !== "complete") {
          currentCallbacks.onComplete(latest.payload);
        }
        if (currentCallbacks && "onError" in currentCallbacks && currentCallbacks.onError && latest.status === "error" && currentArtifact?.status !== "error") {
          currentCallbacks.onError(
            latest.error || "Unknown error",
            latest.payload
          );
        }
        if (currentCallbacks && "onProgress" in currentCallbacks && currentCallbacks.onProgress && latest.progress !== currentArtifact?.progress) {
          currentCallbacks.onProgress(latest.progress || 0, latest.payload);
        }
        if (currentCallbacks && "onStatusChange" in currentCallbacks && currentCallbacks.onStatusChange && latest.status !== currentArtifact?.status) {
          currentCallbacks.onStatusChange(
            latest.status,
            currentArtifact?.status || "idle"
          );
        }
      }
      setCurrentArtifact(latest);
    }
  }, [latest, currentArtifact, includeVersions]);
  const emptyVersions = (0, import_react.useMemo)(
    () => [],
    []
  );
  const deleteArtifact = (0, import_react.useCallback)(
    (artifactId) => {
      for (const message of messages) {
        if (!message.parts || !Array.isArray(message.parts)) continue;
        for (const part of message.parts) {
          if (part.type.startsWith("data-artifact-") && "data" in part) {
            const artifactPart = part;
            if (artifactPart.data?.id === artifactId) {
              const updatedMessage = removeArtifactFromMessage(
                message,
                artifactId
              );
              if (updatedMessage) {
                replaceMessageById(message.id, updatedMessage);
              }
              return;
            }
          }
          if (part.type.startsWith("tool-") && "result" in part && part.result) {
            const result = part.result;
            if (typeof result === "object" && result && "parts" in result) {
              const parts = result.parts;
              if (Array.isArray(parts)) {
                const hasArtifact = parts.some((p) => {
                  const part2 = p;
                  return part2.type?.startsWith("data-artifact-") && part2.data?.id === artifactId;
                });
                if (hasArtifact) {
                  const updatedMessage = removeArtifactFromMessage(
                    message,
                    artifactId
                  );
                  if (updatedMessage) {
                    replaceMessageById(message.id, updatedMessage);
                  }
                  return;
                }
              }
            }
          }
        }
      }
    },
    [messages, replaceMessageById]
  );
  const actions = (0, import_react.useMemo)(
    () => ({
      delete: deleteArtifact
    }),
    [deleteArtifact]
  );
  const artifactData = (0, import_react.useMemo)(() => {
    if (includeVersions && versionIndex !== void 0) {
      const clampedIndex = Math.max(
        0,
        Math.min(versionIndex, allArtifacts.length - 1)
      );
      const selectedArtifact = allArtifacts[clampedIndex] || allArtifacts[0] || null;
      const status2 = selectedArtifact?.status || "idle";
      const isActive2 = status2 === "loading" || status2 === "streaming";
      return {
        data: selectedArtifact?.payload || null,
        status: status2,
        progress: selectedArtifact?.progress,
        error: selectedArtifact?.error,
        isActive: isActive2,
        hasData: selectedArtifact !== null,
        versions: allArtifacts,
        currentIndex: clampedIndex
      };
    }
    const status = currentArtifact?.status || "idle";
    const isActive = status === "loading" || status === "streaming";
    return {
      data: currentArtifact?.payload || null,
      status,
      progress: currentArtifact?.progress,
      error: currentArtifact?.error,
      isActive,
      hasData: currentArtifact !== null,
      versions: emptyVersions
    };
  }, [
    includeVersions,
    versionIndex,
    allArtifacts,
    currentArtifact,
    emptyVersions
  ]);
  return [artifactData, actions];
}
function useArtifacts(options = {}) {
  const {
    onData,
    include,
    exclude,
    value: externalValue,
    onChange,
    dismissed: externalDismissed,
    onDismissedChange
  } = options;
  const messages = (0, import_store.useChatMessages)();
  const hadArtifactsRef = (0, import_react.useRef)(false);
  const prevLatestTypeRef = (0, import_react.useRef)(null);
  const valueWasSetRef = (0, import_react.useRef)(false);
  const [internalDismissed, setInternalDismissed] = (0, import_react.useState)(
    /* @__PURE__ */ new Set()
  );
  const [internalValue, setInternalValue] = (0, import_react.useState)(null);
  const dismissedSet = (0, import_react.useMemo)(() => {
    if (externalDismissed) {
      return new Set(externalDismissed);
    }
    return internalDismissed;
  }, [externalDismissed, internalDismissed]);
  const currentValue = (0, import_react.useMemo)(() => {
    if (externalValue !== void 0) {
      return externalValue;
    }
    return internalValue;
  }, [externalValue, internalValue]);
  const setValue = (0, import_react.useCallback)(
    (value) => {
      valueWasSetRef.current = true;
      if (onChange) {
        onChange(value);
      } else {
        setInternalValue(value);
      }
    },
    [onChange]
  );
  const dismiss = (0, import_react.useCallback)(
    (type) => {
      const newDismissed = new Set(dismissedSet);
      newDismissed.add(type);
      if (externalDismissed) {
        onDismissedChange?.(Array.from(newDismissed));
      } else {
        setInternalDismissed(newDismissed);
      }
    },
    [dismissedSet, externalDismissed, onDismissedChange]
  );
  const restore = (0, import_react.useCallback)(
    (type) => {
      const newDismissed = new Set(dismissedSet);
      newDismissed.delete(type);
      if (externalDismissed) {
        onDismissedChange?.(Array.from(newDismissed));
      } else {
        setInternalDismissed(newDismissed);
      }
    },
    [dismissedSet, externalDismissed, onDismissedChange]
  );
  const onDataRef = (0, import_react.useRef)(onData);
  (0, import_react.useEffect)(() => {
    onDataRef.current = onData;
  }, [onData]);
  const artifactsData = (0, import_react.useMemo)(() => {
    const allArtifacts = extractAllArtifactsFromMessages(messages);
    const filteredArtifacts = allArtifacts.filter((artifact2) => {
      if (include && include.length > 0) return include.includes(artifact2.type);
      if (exclude && exclude.length > 0)
        return !exclude.includes(artifact2.type);
      return true;
    });
    const byType = {};
    const latestByType = {};
    for (const artifact2 of filteredArtifacts) {
      if (!byType[artifact2.type]) {
        byType[artifact2.type] = [];
      }
      byType[artifact2.type].push(artifact2);
      if (!latestByType[artifact2.type] || artifact2.version > latestByType[artifact2.type].version || artifact2.version === latestByType[artifact2.type].version && artifact2.createdAt > latestByType[artifact2.type].createdAt) {
        const prevLatest = latestByType[artifact2.type];
        latestByType[artifact2.type] = artifact2;
        const currentOnData = onDataRef.current;
        if (currentOnData && (!prevLatest || artifact2.version > prevLatest.version || artifact2.version === prevLatest.version && artifact2.createdAt > prevLatest.createdAt)) {
          currentOnData(artifact2.type, artifact2);
        }
      }
    }
    for (const type in byType) {
      byType[type].sort((a, b) => b.createdAt - a.createdAt);
    }
    const types = Object.keys(byType).filter(
      (type) => byType[type] && byType[type].length > 0
    );
    const hasArtifacts = types.length > 0;
    const hadArtifacts = hadArtifactsRef.current;
    hadArtifactsRef.current = hasArtifacts;
    let latestArtifact = null;
    for (const type in latestByType) {
      const artifact2 = latestByType[type];
      if (!latestArtifact || artifact2.createdAt > latestArtifact.createdAt) {
        latestArtifact = artifact2;
      }
    }
    const latestArtifactType = latestArtifact ? latestArtifact.type : types[0] || null;
    let activeType = null;
    if (currentValue && types.includes(currentValue)) {
      activeType = currentValue;
    } else if ((currentValue === null || currentValue === void 0) && hasArtifacts && !hadArtifacts && types.length > 0) {
      activeType = latestArtifactType;
    }
    const activeArtifacts = activeType ? byType[activeType] || [] : [];
    const available = types.filter((type) => !dismissedSet.has(type));
    const dismissed = Array.from(dismissedSet).filter(
      (type) => types.includes(type)
    );
    return {
      byType,
      latestByType,
      artifacts: filteredArtifacts,
      current: filteredArtifacts[0] || null,
      activeType,
      activeArtifacts,
      types,
      latestArtifactType,
      available,
      dismissed
    };
  }, [messages, include, exclude, currentValue, dismissedSet]);
  (0, import_react.useEffect)(() => {
    const currentLatestType = artifactsData.latestArtifactType;
    const prevLatestType = prevLatestTypeRef.current;
    prevLatestTypeRef.current = currentLatestType;
    if (!currentLatestType) {
      return;
    }
    if (prevLatestType !== null && currentLatestType !== prevLatestType && artifactsData.types.includes(currentLatestType)) {
      if (onChange) {
        onChange(currentLatestType);
      } else {
        setInternalValue(currentLatestType);
      }
    } else if (prevLatestType === null && currentLatestType !== null && (currentValue === null || currentValue === void 0) && artifactsData.activeType !== null) {
      if (onChange) {
        onChange(currentLatestType);
      } else {
        setInternalValue(currentLatestType);
      }
    }
  }, [
    artifactsData.activeType,
    artifactsData.latestArtifactType,
    artifactsData.types,
    currentValue,
    onChange
  ]);
  (0, import_react.useEffect)(() => {
    if (artifactsData.activeType && dismissedSet.has(artifactsData.activeType)) {
      restore(artifactsData.activeType);
    }
  }, [artifactsData.activeType, dismissedSet, restore]);
  (0, import_react.useEffect)(() => {
    const shouldSkipAutoActivate = externalValue !== void 0 && externalValue === null || externalValue === void 0 && valueWasSetRef.current && currentValue === null;
    if (artifactsData.available.length > 0 && (!artifactsData.activeType || !artifactsData.available.includes(artifactsData.activeType)) && !shouldSkipAutoActivate) {
      setValue(artifactsData.available[0]);
    }
  }, [
    artifactsData.available,
    artifactsData.activeType,
    externalValue,
    currentValue,
    setValue
  ]);
  const actions = (0, import_react.useMemo)(
    () => ({
      setValue,
      dismiss,
      restore
    }),
    [setValue, dismiss, restore]
  );
  return [artifactsData, actions];
}
function extractAllArtifactsFromMessages(messages) {
  const artifacts = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type.startsWith("data-artifact-") && "data" in part) {
          const artifactPart = part;
          if (artifactPart.data) {
            const existing = artifacts.get(artifactPart.data.id);
            if (!existing || artifactPart.data.version > existing.version || artifactPart.data.version === existing.version && artifactPart.data.createdAt > existing.createdAt) {
              artifacts.set(artifactPart.data.id, artifactPart.data);
            }
          }
        }
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = result.parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (nestedPart.type.startsWith("data-artifact-") && nestedPart.data) {
                  const existing = artifacts.get(nestedPart.data.id);
                  if (!existing || nestedPart.data.version > existing.version || nestedPart.data.version === existing.version && nestedPart.data.createdAt > existing.createdAt) {
                    artifacts.set(nestedPart.data.id, nestedPart.data);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return Array.from(artifacts.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}
function extractArtifactsFromMessages(messages, artifactType) {
  const artifacts = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type === `data-artifact-${artifactType}` && "data" in part) {
          const artifactPart = part;
          if (artifactPart.data) {
            const existing = artifacts.get(artifactPart.data.id);
            if (!existing || artifactPart.data.version > existing.version || artifactPart.data.version === existing.version && artifactPart.data.createdAt > existing.createdAt) {
              artifacts.set(artifactPart.data.id, artifactPart.data);
            }
          }
        }
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = result.parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (nestedPart.type === `data-artifact-${artifactType}` && nestedPart.data) {
                  const existing = artifacts.get(nestedPart.data.id);
                  if (!existing || nestedPart.data.version > existing.version || nestedPart.data.version === existing.version && nestedPart.data.createdAt > existing.createdAt) {
                    artifacts.set(nestedPart.data.id, nestedPart.data);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return Array.from(artifacts.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

// src/types.ts
var ArtifactError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "ArtifactError";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArtifactError,
  StreamingArtifact,
  artifact,
  getWriter,
  useArtifact,
  useArtifacts
});
//# sourceMappingURL=client.js.map