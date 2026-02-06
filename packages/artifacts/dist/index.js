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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ArtifactError: () => ArtifactError,
  StreamingArtifact: () => StreamingArtifact,
  artifact: () => artifact,
  getWriter: () => getWriter
});
module.exports = __toCommonJS(index_exports);

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
  getWriter
});
//# sourceMappingURL=index.js.map