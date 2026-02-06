"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// src/context.ts
var context_exports = {};
__export(context_exports, {
  createExecutionContext: () => createExecutionContext,
  getContext: () => getContext
});
function createExecutionContext(options) {
  return {
    ...options.context,
    writer: options.writer,
    metadata: {
      startTime: /* @__PURE__ */ new Date(),
      ...options.metadata
    }
  };
}
function getContext(executionOptions) {
  return executionOptions?.experimental_context;
}
var init_context = __esm({
  "src/context.ts"() {
    "use strict";
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Agent: () => Agent,
  AgentRunContext: () => AgentRunContext,
  AgentsError: () => AgentsError,
  GuardrailExecutionError: () => GuardrailExecutionError,
  HANDOFF_TOOL_NAME: () => HANDOFF_TOOL_NAME,
  InputGuardrailTripwireTriggered: () => InputGuardrailTripwireTriggered,
  MaxTurnsExceededError: () => MaxTurnsExceededError,
  OutputGuardrailTripwireTriggered: () => OutputGuardrailTripwireTriggered,
  ToolCallError: () => ToolCallError,
  ToolPermissionDeniedError: () => ToolPermissionDeniedError,
  checkToolPermission: () => checkToolPermission,
  createExecutionContext: () => createExecutionContext,
  createHandoff: () => createHandoff,
  createHandoffTool: () => createHandoffTool,
  createUsageTracker: () => createUsageTracker,
  extractTextFromMessage: () => extractTextFromMessage,
  findBestMatch: () => findBestMatch,
  getContext: () => getContext,
  getTransferMessage: () => getTransferMessage,
  handoff: () => handoff,
  isHandoffResult: () => isHandoffResult,
  isHandoffTool: () => isHandoffTool,
  matchAgent: () => matchAgent,
  runInputGuardrails: () => runInputGuardrails,
  runOutputGuardrails: () => runOutputGuardrails,
  trackToolCall: () => trackToolCall,
  writeAgentStatus: () => writeAgentStatus,
  writeDataPart: () => writeDataPart,
  writeRateLimit: () => writeRateLimit
});
module.exports = __toCommonJS(index_exports);

// ../debug/dist/index.js
var isDebugEnabled = process.env.DEBUG_AGENTS === "true";
var colors = {
  reset: "\x1B[0m",
  gray: "\x1B[90m",
  blue: "\x1B[34m",
  cyan: "\x1B[36m",
  yellow: "\x1B[33m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  magenta: "\x1B[35m"
};
var timestamp = () => (/* @__PURE__ */ new Date()).toISOString().slice(11, 23);
function createLogger(category) {
  if (!isDebugEnabled) {
    return {
      debug: () => {
      },
      info: () => {
      },
      warn: () => {
      },
      error: () => {
      }
    };
  }
  return {
    debug: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.blue}DEBUG${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    info: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.green}INFO${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    warn: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.yellow}WARN${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.warn(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    error: (message, data) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.red}ERROR${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
      console.error(`${ts} ${level} ${cat} ${message}${dataStr}`);
    }
  };
}

// ../memory/dist/index.js
var DEFAULT_TEMPLATE = `# Working Memory

## Key Facts
- [Important information goes here]

## Current Focus
- [What the user is working on]

## Preferences
- [User preferences and settings]
`;
function formatWorkingMemory(memory) {
  if (!memory?.content) return "";
  return `
## Working Memory

${memory.content}
`;
}
function getWorkingMemoryInstructions(template) {
  return `
## Working Memory

You have access to persistent working memory that stores user preferences, context, and important facts across conversations.

**ALWAYS call updateWorkingMemory when:**
- User shares OR corrects their name, role, company, or preferences
- User provides OR updates important facts you should remember
- User corrects previous information about themselves
- Any new or changed context that should persist for future conversations

**Template structure to follow:**
\`\`\`
${template}
\`\`\`

**Critical:** After calling updateWorkingMemory, respond to the user confirming the update.
`.trim();
}

// src/agent.ts
var import_ai3 = require("ai");
var import_zod2 = require("zod");
init_context();

// src/handoff.ts
var import_ai = require("ai");
var import_zod = require("zod");
function createHandoff(targetAgent, context, reason) {
  const targetName = typeof targetAgent === "string" ? targetAgent : targetAgent.name;
  return {
    targetAgent: targetName,
    context,
    reason
  };
}
function handoff(agent, config) {
  return {
    agent,
    config
  };
}
function getTransferMessage(agent) {
  return JSON.stringify({ assistant: agent.name });
}
function createHandoffTool(availableHandoffs) {
  const agentNames = availableHandoffs.map(
    (h) => "agent" in h ? h.agent.name : h.name
  );
  return (0, import_ai.tool)({
    description: `Transfer the conversation to another specialized agent.
    
Available agents: ${agentNames.join(", ")}`,
    inputSchema: import_zod.z.object({
      targetAgent: import_zod.z.enum(agentNames),
      context: import_zod.z.string().optional().describe("Context or summary to pass to the target agent"),
      reason: import_zod.z.string().optional().describe("Reason for the handoff")
    }),
    execute: async ({ targetAgent, context, reason }) => {
      return createHandoff(targetAgent, context, reason);
    }
  });
}
var HANDOFF_TOOL_NAME = "handoff_to_agent";
function isHandoffTool(toolName) {
  return toolName === HANDOFF_TOOL_NAME;
}
function isHandoffResult(result) {
  return typeof result === "object" && result !== null && "targetAgent" in result && typeof result.targetAgent === "string";
}

// src/handoff-prompt.ts
var RECOMMENDED_PROMPT_PREFIX = `<system_context>
You are part of a multi-agent system called AI SDK Agents, designed to make agent coordination and execution easy. This system uses two primary abstractions: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function, generally named \`handoff_to_agent\`. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.
</system_context>

<tool_calling_guidelines>
When you need to call multiple tools, call them ALL at once using parallel tool calling.
</tool_calling_guidelines>`;
function promptWithHandoffInstructions(prompt) {
  return `${RECOMMENDED_PROMPT_PREFIX}

${prompt}`;
}

// src/run-context.ts
var AgentRunContext = class {
  /**
   * The context object passed to the agent workflow
   */
  context;
  /**
   * Additional metadata for the run
   */
  metadata;
  constructor(context) {
    this.context = context || {};
    this.metadata = {};
  }
  /**
   * Serialize the run context to JSON
   */
  toJSON() {
    return {
      context: this.context,
      metadata: this.metadata
    };
  }
};

// src/streaming.ts
function writeDataPart(writer, type, data, options) {
  writer.write({
    type,
    data,
    ...options
  });
}
function writeAgentStatus(writer, status) {
  writeDataPart(writer, "data-agent-status", status, { transient: true });
}
function writeRateLimit(writer, rateLimit) {
  writeDataPart(writer, "data-rate-limit", rateLimit, { transient: true });
}
function writeSuggestions(writer, prompts) {
  writeDataPart(writer, "data-suggestions", { prompts }, { transient: true });
}

// src/tool-result-extractor.ts
var logger = createLogger("TOOL_EXTRACTOR");
function createDefaultInputFilter() {
  return (input) => {
    logger.debug(`Processing input history with ${input.inputHistory.length} messages`, {
      historyCount: input.inputHistory.length
    });
    logger.debug(`Processing newItems with ${input.newItems.length} items`, {
      newItemsCount: input.newItems.length
    });
    const toolResults = {};
    for (const item of input.newItems) {
      logger.debug(`Processing newItem: ${typeof item}`, { itemType: typeof item });
      if (item && typeof item === "object") {
        if ("toolName" in item && "result" in item) {
          const toolName = item.toolName;
          const result = item.result;
          if (toolName && result) {
            toolResults[toolName] = result;
            logger.debug(`Found tool result in newItems: ${toolName}`, { toolName });
          }
        }
        if ("content" in item && Array.isArray(item.content)) {
          const content = item.content;
          for (const contentItem of content) {
            if (contentItem.type === "tool-result" && contentItem.toolName && contentItem.result) {
              toolResults[contentItem.toolName] = contentItem.result;
              logger.debug(`Found nested tool result: ${contentItem.toolName}`, { toolName: contentItem.toolName });
            }
          }
        }
      }
    }
    logger.debug("Extracted tool results from newItems", { tools: Object.keys(toolResults) });
    if (Object.keys(toolResults).length > 0) {
      const dataSummary = Object.entries(toolResults).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `Available ${key} data: ${value.length} items found`;
        }
        if (typeof value === "object" && value !== null) {
          return `Available ${key} data: ${JSON.stringify(value)}`;
        }
        return `Available ${key} data: ${value}`;
      }).join("\n");
      const dataMessage = {
        role: "system",
        content: `Available data from previous agent:
${dataSummary}

**IMPORTANT**: Only use this data if it's DIRECTLY relevant to the current user question. If the user is asking about something different, ignore this data and call the appropriate tools.`
      };
      const enhancedHistory = [...input.inputHistory];
      if (enhancedHistory.length === 0) {
        enhancedHistory.push({
          role: "user",
          content: "Please help with the request using the available data."
        });
      }
      enhancedHistory.push(dataMessage);
      return {
        ...input,
        inputHistory: enhancedHistory
      };
    }
    return input;
  };
}

// src/utils.ts
var import_ai2 = require("ai");
function extractTextFromMessage(message) {
  if (!message?.content) return "";
  const { content } = message;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.filter(
      (part) => typeof part === "object" && part !== null && part.type === "text"
    ).map((part) => part.text).join("");
  }
  return "";
}
function stripMetadata(messages) {
  return messages.map((msg) => ({
    ...msg,
    parts: msg.parts?.map((part) => {
      const sanitizedPart = { ...part };
      if ("providerMetadata" in sanitizedPart) {
        sanitizedPart.providerMetadata = void 0;
      }
      if ((0, import_ai2.isToolUIPart)(sanitizedPart) && "callProviderMetadata" in sanitizedPart) {
        sanitizedPart.callProviderMetadata = void 0;
      }
      return sanitizedPart;
    })
  }));
}

// src/agent.ts
var logger2 = createLogger("AGENT");
var Agent = class _Agent {
  name;
  instructions;
  matchOn;
  onEvent;
  inputGuardrails;
  outputGuardrails;
  permissions;
  lastMessages;
  memory;
  model;
  aiAgent;
  handoffAgents;
  configuredTools;
  modelSettings;
  // Cache for system prompt construction
  _cachedSystemPrompt;
  _cacheKey;
  constructor(config) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.matchOn = config.matchOn;
    this.onEvent = config.onEvent;
    this.inputGuardrails = config.inputGuardrails;
    this.outputGuardrails = config.outputGuardrails;
    this.permissions = config.permissions;
    this.lastMessages = config.lastMessages;
    this.memory = config.memory;
    this.model = config.model;
    this.handoffAgents = config.handoffs || [];
    this.modelSettings = config.modelSettings;
    this.configuredTools = config.tools || {};
    const { toolChoice, ...otherModelSettings } = config.modelSettings || {};
    this.aiAgent = new import_ai3.ToolLoopAgent({
      model: config.model,
      instructions: "",
      // Will be overridden per-request with resolved instructions
      tools: {},
      // Will be overridden per-request with resolved tools
      stopWhen: (0, import_ai3.stepCountIs)(config.maxTurns || 10),
      temperature: config.temperature,
      toolChoice,
      // Pass toolChoice as top-level param
      ...otherModelSettings
    });
  }
  async generate(options) {
    const startTime = /* @__PURE__ */ new Date();
    try {
      const result = options.messages && options.messages.length > 0 ? await this.aiAgent.generate({
        messages: [
          ...options.messages,
          { role: "user", content: options.prompt || "Continue" }
        ]
      }) : await this.aiAgent.generate({
        prompt: options.prompt
      });
      const endTime = /* @__PURE__ */ new Date();
      const handoffs = [];
      if (result.steps) {
        for (const step of result.steps) {
          if (step.toolResults) {
            for (const toolResult of step.toolResults) {
              if (isHandoffResult(toolResult.output)) {
                handoffs.push(toolResult.output);
              }
            }
          }
        }
      }
      return {
        text: result.text || "",
        finalAgent: this.name,
        finalOutput: result.text || "",
        handoffs,
        metadata: {
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime()
        },
        steps: result.steps,
        finishReason: result.finishReason,
        usage: result.usage,
        toolCalls: result.toolCalls?.map((tc) => ({
          toolCallId: tc.toolCallId,
          toolName: tc.toolName,
          args: "args" in tc ? tc.args : void 0
        }))
      };
    } catch (error) {
      throw new Error(
        `Agent ${this.name} failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  stream(options) {
    logger2.debug(`${this.name} stream called`, { name: this.name });
    const executionContext = options.executionContext;
    const maxSteps = options.maxSteps;
    const onStepFinish = options.onStepFinish;
    const toolChoice = options.toolChoice;
    const resolvedInstructions = typeof this.instructions === "function" ? this.instructions(executionContext) : this.instructions;
    const extendedContext = executionContext;
    const memoryAddition = extendedContext._memoryAddition || "";
    const cacheKey = `${typeof this.instructions === "string" ? this.instructions : "dynamic"}_${this.handoffAgents.length}_${this.memory?.workingMemory?.enabled || false}`;
    let systemPrompt;
    if (this._cacheKey === cacheKey && this._cachedSystemPrompt && !memoryAddition) {
      systemPrompt = this._cachedSystemPrompt;
    } else {
      let basePrompt = this.handoffAgents.length > 0 ? promptWithHandoffInstructions(resolvedInstructions) : resolvedInstructions;
      if (this.memory?.workingMemory?.enabled) {
        const workingMemoryInstructions = getWorkingMemoryInstructions(
          this.memory.workingMemory.template || DEFAULT_TEMPLATE
        );
        basePrompt += `

${workingMemoryInstructions}`;
      }
      if (typeof this.instructions === "string" && !memoryAddition) {
        this._cachedSystemPrompt = basePrompt;
        this._cacheKey = cacheKey;
      }
      systemPrompt = basePrompt + memoryAddition;
    }
    const resolvedTools = typeof this.configuredTools === "function" ? this.configuredTools(executionContext) : { ...this.configuredTools };
    if (this.handoffAgents.length > 0) {
      resolvedTools[HANDOFF_TOOL_NAME] = createHandoffTool(this.handoffAgents);
    }
    const hasOtherTools = Object.keys(resolvedTools).some(
      (key) => key !== HANDOFF_TOOL_NAME
    );
    const isPureOrchestrator = this.handoffAgents.length > 0 && !hasOtherTools;
    if (this.memory?.workingMemory?.enabled && !isPureOrchestrator) {
      resolvedTools.updateWorkingMemory = this.createWorkingMemoryTool();
    }
    const { toolChoice: configuredToolChoice, ...otherSettings } = this.modelSettings || {};
    const effectiveToolChoice = toolChoice ? { type: "tool", toolName: toolChoice } : configuredToolChoice;
    const additionalOptions = {
      system: systemPrompt,
      // Override system prompt per call
      tools: resolvedTools,
      // Add resolved tools here
      toolChoice: effectiveToolChoice,
      // Pass toolChoice as top-level param
      ...otherSettings
      // Include other model settings
    };
    if (executionContext) {
      additionalOptions.experimental_context = executionContext;
    }
    if (maxSteps) additionalOptions.maxSteps = maxSteps;
    if (onStepFinish) additionalOptions.onStepFinish = onStepFinish;
    if ("messages" in options && !("prompt" in options) && options.messages) {
      logger2.debug(`Stream with messages only`, {
        messageCount: options.messages.length
      });
      return this.aiAgent.stream({
        messages: options.messages,
        ...additionalOptions
      });
    }
    const opts = options;
    logger2.debug(`Stream options for ${this.name}`, {
      hasPrompt: !!opts.prompt,
      messageCount: opts.messages?.length || 0
    });
    if (!opts.prompt && (!opts.messages || opts.messages.length === 0)) {
      throw new Error("No prompt or messages provided to stream method");
    }
    if (opts.messages && opts.messages.length > 0 && opts.prompt) {
      return this.aiAgent.stream({
        messages: [...opts.messages, { role: "user", content: opts.prompt }],
        ...additionalOptions
      });
    }
    if (opts.prompt) {
      return this.aiAgent.stream({
        prompt: opts.prompt,
        ...additionalOptions
      });
    }
    throw new Error("No valid options provided to stream method");
  }
  getHandoffs() {
    return this.handoffAgents.map((h) => "agent" in h ? h.agent : h);
  }
  getConfiguredHandoffs() {
    return this.handoffAgents.map((h) => "agent" in h ? h : { agent: h });
  }
  /**
   * Convert agent execution to UI Message Stream Response
   * High-level API for Next.js route handlers
   *
   * This follows the working pattern from the route.ts reference code
   */
  toUIMessageStream(options) {
    const {
      message,
      strategy = "auto",
      maxRounds = 5,
      maxSteps = 10,
      context,
      agentChoice,
      toolChoice,
      beforeStream,
      onEvent,
      // AI SDK createUIMessageStream options
      onFinish,
      onError,
      generateId,
      // AI SDK toUIMessageStream options
      sendReasoning,
      sendSources,
      sendFinish,
      sendStart,
      messageMetadata,
      // Response options
      status,
      statusText,
      headers
    } = options;
    let existingChatForSave = null;
    const wrappedOnFinish = async (event) => {
      if (this.memory?.history?.enabled && context) {
        const { chatId, userId } = this.extractMemoryIdentifiers(
          context
        );
        if (!chatId) {
          logger2.warn("Cannot save messages: chatId is missing from context");
        } else {
          try {
            const userMsg = event.messages[event.messages.length - 2];
            const assistantMsg = event.messages[event.messages.length - 1];
            let userMsgToSave = userMsg;
            if (userMsg && Array.isArray(userMsg.content)) {
              const filteredContent = userMsg.content.filter(
                (part) => part.type !== "file"
              );
              userMsgToSave = {
                ...userMsg,
                content: filteredContent.length > 0 ? filteredContent : ""
              };
            }
            logger2.debug(`Saving messages (files excluded from storage)`);
            await this.saveConversation(
              chatId,
              userId,
              JSON.stringify(userMsgToSave),
              JSON.stringify(assistantMsg),
              existingChatForSave
            );
          } catch (err) {
            logger2.error("Failed to save conversation", { error: err });
          }
        }
      }
      await onFinish?.(event);
    };
    const stream = (0, import_ai3.createUIMessageStream)({
      originalMessages: [message],
      onFinish: wrappedOnFinish,
      onError,
      generateId,
      execute: async ({ writer }) => {
        const [messages, memoryAddition] = await Promise.all([
          this.loadMessagesWithHistory(message, context),
          context && this.memory?.workingMemory?.enabled ? this.loadWorkingMemory(context) : Promise.resolve("")
        ]);
        const { chatId } = this.extractMemoryIdentifiers(context);
        if (this.memory?.chats?.enabled && chatId) {
          existingChatForSave = await this.memory.provider?.getChat?.(chatId);
        }
        const lastMessage = messages[messages.length - 1];
        const input = extractTextFromMessage(lastMessage);
        await this.maybeGenerateChatTitle(
          context,
          input,
          writer,
          existingChatForSave
        );
        const runContext = new AgentRunContext(context || {});
        runContext.metadata = {
          agent: this.name,
          requestId: `req_${Date.now()}_${Math.random().toString(36).substring(7)}`
        };
        const executionContext = createExecutionContext({
          context: context || {},
          writer,
          metadata: {
            agent: this.name,
            requestId: runContext.metadata.requestId
          }
        });
        executionContext.runContext = runContext;
        if (memoryAddition) {
          const extendedExecContext = executionContext;
          extendedExecContext._memoryAddition = memoryAddition;
        }
        try {
          if (beforeStream) {
            const shouldContinue = await beforeStream({ writer });
            if (shouldContinue === false) {
              writer.write({ type: "finish" });
              return;
            }
          }
          const conversationMessages = [...messages];
          const specialists = this.getHandoffs();
          writeAgentStatus(writer, {
            status: "routing",
            agent: this.name
          });
          if (onEvent) {
            await onEvent({
              type: "agent-start",
              agent: this.name,
              round: 0
            });
          }
          let currentAgent = this;
          if (agentChoice && specialists.length > 0) {
            const chosenAgent = specialists.find(
              (agent) => agent.name === agentChoice
            );
            if (chosenAgent) {
              currentAgent = chosenAgent;
              logger2.debug(`Explicit agent choice: ${currentAgent.name}`, {
                agent: currentAgent.name
              });
              writeAgentStatus(writer, {
                status: "completing",
                agent: this.name
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-finish",
                  agent: this.name,
                  round: 0
                });
              }
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: chosenAgent.name,
                  reason: "User selected agent",
                  routingStrategy: "explicit"
                },
                transient: true
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: chosenAgent.name,
                  reason: "User selected agent"
                });
              }
            }
          } else if (toolChoice && specialists.length > 0) {
            const agentWithTool = specialists.find((agent) => {
              const agentImpl = agent;
              return agentImpl.configuredTools && toolChoice in agentImpl.configuredTools;
            });
            if (agentWithTool) {
              currentAgent = agentWithTool;
              logger2.debug(
                `Tool choice routing: ${toolChoice} \u2192 ${currentAgent.name}`,
                { toolChoice, agent: currentAgent.name }
              );
              writeAgentStatus(writer, {
                status: "completing",
                agent: this.name
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-finish",
                  agent: this.name,
                  round: 0
                });
              }
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: agentWithTool.name,
                  reason: `User requested tool: ${toolChoice}`,
                  routingStrategy: "tool-choice",
                  preferredTool: toolChoice
                },
                transient: true
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: agentWithTool.name,
                  reason: `User requested tool: ${toolChoice}`
                });
              }
            }
          } else if (strategy === "auto" && specialists.length > 0) {
            const matchedAgent = specialists.find((agent) => {
              if (!agent.matchOn) return false;
              if (typeof agent.matchOn === "function") {
                return agent.matchOn(input);
              }
              if (Array.isArray(agent.matchOn)) {
                return agent.matchOn.some((pattern) => {
                  if (typeof pattern === "string") {
                    return input.toLowerCase().includes(pattern.toLowerCase());
                  }
                  if (pattern instanceof RegExp) {
                    return pattern.test(input);
                  }
                  return false;
                });
              }
              return false;
            });
            if (matchedAgent) {
              currentAgent = matchedAgent;
              logger2.debug(`Programmatic match: ${currentAgent.name}`, {
                agent: currentAgent.name
              });
              writeAgentStatus(writer, {
                status: "completing",
                agent: this.name
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-finish",
                  agent: this.name,
                  round: 0
                });
              }
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: matchedAgent.name,
                  reason: "Programmatic routing match",
                  routingStrategy: "programmatic"
                },
                transient: true
              });
              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: matchedAgent.name,
                  reason: "Programmatic routing match"
                });
              }
            }
          }
          let round = 0;
          const usedSpecialists = /* @__PURE__ */ new Set();
          if (currentAgent !== this) {
            usedSpecialists.add(currentAgent.name);
          }
          while (round++ < maxRounds) {
            writeAgentStatus(writer, {
              status: "executing",
              agent: currentAgent.name
            });
            const defaultLastMessages = currentAgent.getHandoffs().length > 0 ? 10 : 5;
            const lastMessages = currentAgent.lastMessages ?? defaultLastMessages;
            let messagesToSend = conversationMessages.slice(-lastMessages);
            if (messagesToSend.length === 0 && messages.length > 0) {
              messagesToSend = messages.slice(-1);
            }
            if (onEvent) {
              await onEvent({
                type: "agent-start",
                agent: currentAgent.name,
                round
              });
            }
            const result = currentAgent.stream({
              messages: messagesToSend,
              executionContext,
              maxSteps,
              // Limit tool calls per round
              onStepFinish: async (step) => {
                if (onEvent) {
                  await onEvent({
                    type: "agent-step",
                    agent: currentAgent.name,
                    step
                  });
                }
              }
            });
            const uiStream = result.toUIMessageStream({
              sendReasoning,
              sendSources,
              sendFinish,
              sendStart,
              messageMetadata
            });
            let textAccumulated = "";
            let handoffData = null;
            const toolCallNames = /* @__PURE__ */ new Map();
            const toolResults = /* @__PURE__ */ new Map();
            let hasStartedContent = false;
            const handoffToolNames = /* @__PURE__ */ new Set([HANDOFF_TOOL_NAME]);
            for await (const chunk of uiStream) {
              if (!chunk) {
                logger2.warn("Received null/undefined chunk from uiStream");
                continue;
              }
              if (chunk.type === "tool-input-start") {
                toolCallNames.set(chunk.toolCallId, chunk.toolName);
                logger2.debug(
                  `Tool call started: ${chunk.toolName} (${chunk.toolCallId})`,
                  {
                    toolName: chunk.toolName,
                    toolCallId: chunk.toolCallId,
                    agent: currentAgent.name,
                    round
                  }
                );
              }
              let isHandoffChunk = false;
              if (chunk.type === "tool-input-start") {
                isHandoffChunk = handoffToolNames.has(chunk.toolName);
              } else if (chunk.type === "tool-input-delta" || chunk.type === "tool-input-available") {
                const toolName = toolCallNames.get(chunk.toolCallId);
                isHandoffChunk = toolName ? handoffToolNames.has(toolName) : false;
              } else if (chunk.type === "tool-output-available") {
                const toolName = toolCallNames.get(chunk.toolCallId);
                isHandoffChunk = toolName ? handoffToolNames.has(toolName) : false;
              }
              if (!hasStartedContent && (chunk.type === "text-delta" || chunk.type === "tool-input-start" && !isHandoffChunk)) {
                hasStartedContent = true;
              }
              if (chunk.type === "error") {
                logger2.error("Stream error", {
                  error: chunk.errorText || chunk.error || chunk
                });
              }
              if (chunk.type === "tool-output-available") {
                const toolName = toolCallNames.get(chunk.toolCallId);
                if (toolName) {
                  toolResults.set(toolName, chunk.output);
                  logger2.debug(`Captured ${toolName}`, {
                    toolName,
                    outputType: typeof chunk.output
                  });
                  if (handoffToolNames.has(toolName)) {
                    handoffData = chunk.output;
                    logger2.debug("Handoff detected", handoffData);
                  }
                }
              }
              if (!isHandoffChunk) {
                try {
                  writer.write(chunk);
                } catch (error) {
                  logger2.error("Failed to write chunk to stream", {
                    chunkType: chunk.type,
                    error
                  });
                }
              }
              if (chunk.type === "text-delta") {
                textAccumulated += chunk.delta;
              }
            }
            if (textAccumulated && !handoffData) {
              conversationMessages.push({
                role: "assistant",
                content: textAccumulated
              });
            } else if (textAccumulated && handoffData) {
              logger2.debug("Skipping intermediate text due to handoff", {
                textLength: textAccumulated.length,
                handoffTarget: handoffData.targetAgent
              });
            }
            if (onEvent) {
              await onEvent({
                type: "agent-finish",
                agent: currentAgent.name,
                round
              });
            }
            if (currentAgent === this) {
              if (handoffData) {
                if (usedSpecialists.has(handoffData.targetAgent)) {
                  break;
                }
                writeAgentStatus(writer, {
                  status: "routing",
                  agent: this.name
                });
                usedSpecialists.add(handoffData.targetAgent);
                const nextAgent = specialists.find(
                  (a) => a.name === handoffData.targetAgent
                );
                if (nextAgent) {
                  const configuredHandoffs = this.getConfiguredHandoffs();
                  const configuredHandoff = configuredHandoffs.find(
                    (ch) => ch.agent.name === handoffData.targetAgent
                  );
                  const inputFilter = configuredHandoff?.config?.inputFilter;
                  if (inputFilter) {
                    try {
                      const handoffInputData = {
                        inputHistory: conversationMessages,
                        preHandoffItems: [],
                        newItems: Array.from(toolResults.entries()).map(
                          ([name, result2]) => ({
                            toolName: name,
                            result: result2
                          })
                        ),
                        runContext
                      };
                      const filteredData = inputFilter(handoffInputData);
                      conversationMessages.length = 0;
                      conversationMessages.push(...filteredData.inputHistory);
                    } catch (error) {
                      logger2.error("Error applying handoff input filter", {
                        error
                      });
                    }
                  } else {
                    logger2.debug("Applying default input filter for", {
                      targetAgent: handoffData.targetAgent
                    });
                    const defaultFilter = createDefaultInputFilter();
                    const handoffInputData = {
                      inputHistory: conversationMessages,
                      preHandoffItems: [],
                      newItems: Array.from(toolResults.entries()).map(
                        ([name, result2]) => ({
                          toolName: name,
                          result: result2
                        })
                      ),
                      runContext
                    };
                    logger2.debug("Input history length", {
                      length: handoffInputData.inputHistory.length
                    });
                    logger2.debug("Input history messages", {
                      messages: handoffInputData.inputHistory.map((m) => ({
                        role: m.role,
                        contentType: typeof m.content
                      }))
                    });
                    const filteredData = defaultFilter(handoffInputData);
                    logger2.debug("Filtered history length", {
                      length: filteredData.inputHistory.length
                    });
                    conversationMessages.length = 0;
                    conversationMessages.push(...filteredData.inputHistory);
                    logger2.debug("Updated conversation messages length", {
                      length: conversationMessages.length
                    });
                  }
                  if (configuredHandoff?.config?.onHandoff) {
                    try {
                      await configuredHandoff.config.onHandoff(runContext);
                    } catch (error) {
                      logger2.error("Error in onHandoff callback", { error });
                    }
                  }
                  currentAgent = nextAgent;
                  writer.write({
                    type: "data-agent-handoff",
                    data: {
                      from: this.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                      routingStrategy: "llm"
                    },
                    transient: true
                  });
                  if (onEvent) {
                    await onEvent({
                      type: "agent-handoff",
                      from: this.name,
                      to: nextAgent.name,
                      reason: handoffData.reason
                    });
                  }
                }
              } else {
                break;
              }
            } else {
              if (handoffData) {
                if (usedSpecialists.has(handoffData.targetAgent)) {
                  break;
                }
                usedSpecialists.add(handoffData.targetAgent);
                const nextAgent = specialists.find(
                  (a) => a.name === handoffData.targetAgent
                );
                if (nextAgent) {
                  const configuredHandoffs = this.getConfiguredHandoffs();
                  const configuredHandoff = configuredHandoffs.find(
                    (ch) => ch.agent.name === handoffData.targetAgent
                  );
                  if (configuredHandoff?.config?.inputFilter) {
                    try {
                      const handoffInputData = {
                        inputHistory: conversationMessages.slice(0, -1),
                        // All messages except the last assistant message
                        preHandoffItems: [],
                        // No pre-handoff items for specialist-to-specialist
                        newItems: conversationMessages.slice(-1),
                        // The last assistant message
                        runContext
                      };
                      const filteredData = configuredHandoff.config.inputFilter(handoffInputData);
                      conversationMessages.length = 0;
                      conversationMessages.push(
                        ...filteredData.inputHistory,
                        ...filteredData.newItems
                      );
                    } catch (error) {
                      logger2.error("Error applying handoff input filter", {
                        error
                      });
                    }
                  }
                  if (configuredHandoff?.config?.onHandoff) {
                    try {
                      await configuredHandoff.config.onHandoff(runContext);
                    } catch (error) {
                      logger2.error("Error in onHandoff callback", { error });
                    }
                  }
                  const previousAgent = currentAgent;
                  currentAgent = nextAgent;
                  writer.write({
                    type: "data-agent-handoff",
                    data: {
                      from: previousAgent.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                      routingStrategy: "llm"
                    },
                    transient: true
                  });
                  if (onEvent) {
                    await onEvent({
                      type: "agent-handoff",
                      from: previousAgent.name,
                      to: nextAgent.name,
                      reason: handoffData.reason
                    });
                  }
                }
              } else {
                break;
              }
            }
          }
          if (onEvent) {
            await onEvent({
              type: "agent-complete",
              totalRounds: round
            });
          }
          const config = this.memory?.chats?.generateSuggestions;
          const minLength = typeof config === "object" && config.minResponseLength ? config.minResponseLength : 100;
          const assistantMessages = conversationMessages.filter(
            (m) => m.role === "assistant"
          );
          const totalTextLength = assistantMessages.reduce((sum, m) => {
            return sum + (typeof m.content === "string" ? m.content.length : 0);
          }, 0);
          if (totalTextLength >= minLength) {
            const contextWindow = typeof config === "object" && config.contextWindow ? config.contextWindow : 1;
            const recentMessages = conversationMessages.slice(
              -(contextWindow * 2)
            );
            const conversationContext = recentMessages.map((msg) => {
              const role = msg.role === "user" ? "User" : "Assistant";
              return `${role}: ${typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}`;
            }).join("\n\n");
            await this.generateSuggestions(
              conversationContext,
              conversationMessages,
              writer,
              context
            ).catch(
              (err) => logger2.error("Suggestion generation error", { error: err })
            );
          }
          writer.write({ type: "finish" });
        } catch (error) {
          logger2.error("Error in toUIMessageStream", { error });
          if (onEvent) {
            await onEvent({
              type: "agent-error",
              error: error instanceof Error ? error : new Error(String(error))
            });
          }
          writer.write({
            type: "error",
            error: error instanceof Error ? error.message : String(error)
          });
          writer.write({ type: "finish" });
        }
      }
    });
    const response = (0, import_ai3.createUIMessageStreamResponse)({
      stream,
      status,
      statusText,
      headers
    });
    return response;
  }
  /**
   * Extract chatId and userId from context for memory operations
   */
  extractMemoryIdentifiers(context) {
    const ctx = context;
    const chatId = ctx.chatId || ctx.metadata?.chatId;
    const userId = ctx.userId || ctx.metadata?.userId;
    return { chatId, userId };
  }
  /**
   * Generate a title for the chat based on the first user message
   */
  async generateChatTitle(chatId, userMessage, writer, _context) {
    if (!this.memory?.chats?.generateTitle) return;
    const config = this.memory.chats.generateTitle;
    const model = typeof config === "object" ? config.model : this.model;
    const instructions = typeof config === "object" && config.instructions ? config.instructions : `<task_context>
You are a helpful assistant that can generate titles for conversations.
</task_context>

<rules>
Find the most concise title that captures what the user is asking for.
Titles should be at most 30 characters.
Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
</rules>

<task>
Generate a title for the conversation.
</task>

<output_format>
Return only the title.
</output_format>`;
    try {
      const { text } = await (0, import_ai3.generateText)({
        model,
        system: instructions,
        prompt: userMessage,
        temperature: 0
      });
      await this.memory.provider?.updateChatTitle?.(chatId, text);
      writer.write({
        type: "data-chat-title",
        data: { chatId, title: text }
      });
      logger2.debug(`Generated title for ${chatId}`, { chatId, title: text });
    } catch (err) {
      logger2.error("Title generation failed", { error: err });
    }
  }
  /**
   * Build capabilities description from available tools and agents
   */
  buildCapabilitiesDescription(context) {
    const capabilities = [];
    if (this.configuredTools) {
      const resolvedTools = typeof this.configuredTools === "function" && context ? this.configuredTools(context) : typeof this.configuredTools === "object" ? this.configuredTools : {};
      const toolNames = Object.keys(resolvedTools).filter(
        (name) => name !== "handoff_to_agent" && name !== "updateWorkingMemory"
      );
      if (toolNames.length > 0) {
        capabilities.push("Available tools:");
        for (const toolName of toolNames) {
          const tool3 = resolvedTools[toolName];
          const description = tool3?.spec?.description || toolName;
          capabilities.push(`- ${toolName}: ${description}`);
        }
      }
    }
    const handoffs = this.getHandoffs();
    if (handoffs.length > 0) {
      if (capabilities.length > 0) capabilities.push("");
      capabilities.push("Can route to specialist agents:");
      for (const agent of handoffs) {
        const description = agent.handoffDescription || `${agent.name} agent`;
        capabilities.push(`- ${agent.name}: ${description}`);
      }
    }
    return capabilities.join("\n");
  }
  /**
   * Generate contextual prompt suggestions after agent response
   */
  async generateSuggestions(conversationContext, conversationMessages, writer, context) {
    const config = this.memory?.chats?.generateSuggestions;
    if (!config) return;
    let enabled;
    if (typeof config === "boolean") {
      enabled = config;
    } else if (typeof config.enabled === "function") {
      enabled = await config.enabled({
        messages: conversationMessages,
        context
      });
    } else {
      enabled = config.enabled;
    }
    if (!enabled) return;
    const model = typeof config === "object" && config.model ? config.model : this.model;
    const limit = typeof config === "object" && config.limit ? config.limit : 5;
    const defaultInstructions = `Generate ${limit} contextual follow-up suggestions based on what was JUST discussed.

${this.buildCapabilitiesDescription(context)}

Guidelines:
1. Analyze what the assistant just showed/discussed (data, analysis, insights)
2. Suggest logical NEXT STEPS that build on this specific response
3. Keep suggestions ultra-brief (2-3 words ideal, max 5 words)
4. Use action verbs ("Show", "Compare", "Analyze", "Check", "List", "Explore")
5. Make suggestions specific to the context, not generic
6. Focus on available capabilities that provide value

Good suggestions are:
- Specific to what was just discussed
- Actionable using available capabilities
- Brief and clear (2-3 words)
- Natural next steps, not repetitive`;
    const instructions = typeof config === "object" && config.instructions ? config.instructions : defaultInstructions;
    try {
      const suggestionsSchema = import_zod2.z.object({
        prompts: import_zod2.z.array(import_zod2.z.string().max(40)).min(3).max(limit).describe(`Array of prompt suggestions (2-5 words each)`)
      });
      const { object } = await (0, import_ai3.generateObject)({
        model,
        system: instructions,
        prompt: conversationContext,
        schema: suggestionsSchema
      });
      const { prompts } = object;
      writeSuggestions(writer, prompts);
    } catch (err) {
      logger2.error("Suggestion generation failed", { error: err });
    }
  }
  /**
   * Create the updateWorkingMemory tool
   */
  createWorkingMemoryTool() {
    const scope = this.memory?.workingMemory?.scope || "chat";
    const memory = this.memory;
    const extractMemoryIdentifiers = this.extractMemoryIdentifiers.bind(this);
    return (0, import_ai3.tool)({
      description: `Save user information to persistent memory for future conversations.`,
      inputSchema: import_zod2.z.object({
        content: import_zod2.z.string().describe(
          "Updated working memory content in markdown format. Include user preferences and any important facts to remember."
        )
      }),
      execute: async ({ content }, options) => {
        logger2.debug("updateWorkingMemory tool called", {
          contentLength: content.length
        });
        if (!memory?.provider) {
          logger2.warn("Memory provider not configured");
          return "Memory system not configured";
        }
        const { getContext: getContext2 } = await Promise.resolve().then(() => (init_context(), context_exports));
        const ctx = getContext2(
          options
        );
        const contextData = ctx;
        if (!contextData) {
          logger2.warn("Context not available for working memory update");
          return "Context not available";
        }
        const { chatId, userId } = extractMemoryIdentifiers(contextData);
        logger2.debug("Updating working memory", { chatId, userId, scope });
        try {
          await memory.provider.updateWorkingMemory({
            chatId,
            userId,
            scope,
            content
          });
          logger2.debug("Working memory updated successfully");
          return "success";
        } catch (error) {
          logger2.error("Failed to update working memory", {
            error: error instanceof Error ? error.message : error
          });
          return "error";
        }
      }
    });
  }
  /**
   * Load working memory and inject into system prompt
   */
  async loadWorkingMemory(context) {
    if (!this.memory?.workingMemory?.enabled || !this.memory?.provider) {
      return "";
    }
    const { chatId, userId } = this.extractMemoryIdentifiers(context);
    const scope = this.memory.workingMemory.scope;
    try {
      const memory = await this.memory.provider.getWorkingMemory({
        chatId,
        userId,
        scope
      });
      if (!memory) return "";
      return formatWorkingMemory(memory);
    } catch (error) {
      logger2.error("Failed to load working memory", {
        error: error instanceof Error ? error.message : error
      });
      return "";
    }
  }
  /**
   * Load message history from memory and prepend to the current message.
   * Falls back to just the current message if history is disabled or unavailable.
   *
   * @param message - The current user message
   * @param context - Execution context containing chatId
   * @returns Array of ModelMessages including history + current message
   */
  async loadMessagesWithHistory(message, context) {
    if (!this.memory?.history?.enabled || !context) {
      logger2.debug(
        "History disabled or no context - using single message only"
      );
      return await (0, import_ai3.convertToModelMessages)([message]);
    }
    const { chatId } = this.extractMemoryIdentifiers(context);
    if (!chatId) {
      logger2.warn("Cannot load history: chatId missing from context");
      return await (0, import_ai3.convertToModelMessages)([message]);
    }
    if (!this.memory.provider) {
      logger2.warn("No memory provider configured - using single message only");
      return await (0, import_ai3.convertToModelMessages)([message]);
    }
    try {
      const previousMessages = await this.memory.provider.getMessages?.({
        chatId,
        limit: this.memory.history.limit
      }) || [];
      logger2.debug(`Loading history for chatId=${chatId}`, {
        chatId,
        count: previousMessages.length
      });
      if (previousMessages.length === 0) {
        logger2.debug("No previous messages found - starting new conversation");
        return (0, import_ai3.convertToModelMessages)([message]);
      }
      const historyMessages = await (0, import_ai3.convertToModelMessages)(
        stripMetadata(previousMessages)
      );
      logger2.debug(
        `Loaded ${historyMessages.length} history messages for context`,
        {
          count: historyMessages.length
        }
      );
      return [...historyMessages, ...await (0, import_ai3.convertToModelMessages)([message])];
    } catch (err) {
      logger2.error(`Load history failed for chatId=${chatId}`, {
        chatId,
        error: err
      });
      return await (0, import_ai3.convertToModelMessages)([message]);
    }
  }
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
  async saveConversation(chatId, userId, userMessage, assistantMessage, existingChat) {
    if (!this.memory?.provider || !this.memory?.history?.enabled) return;
    logger2.debug(`Saving conversation for chatId=${chatId}`, {
      chatId,
      userLength: userMessage.length,
      assistantLength: assistantMessage.length
    });
    try {
      const savePromises = [
        this.memory.provider.saveMessage?.({
          chatId,
          userId,
          role: "user",
          content: userMessage,
          timestamp: /* @__PURE__ */ new Date()
        })
      ];
      if (assistantMessage && assistantMessage.length > 0) {
        logger2.debug(`Will save assistant message`, {
          length: assistantMessage.length
        });
        savePromises.push(
          this.memory.provider.saveMessage?.({
            chatId,
            userId,
            role: "assistant",
            content: assistantMessage,
            timestamp: /* @__PURE__ */ new Date()
          })
        );
      } else {
        logger2.warn(`Skipping assistant message save - empty or undefined`);
      }
      if (this.memory?.chats?.enabled) {
        const messageCount = savePromises.length;
        savePromises.push(
          this.memory.provider.saveChat?.({
            ...existingChat || { chatId, userId, createdAt: /* @__PURE__ */ new Date() },
            messageCount: (existingChat?.messageCount || 0) + messageCount,
            updatedAt: /* @__PURE__ */ new Date()
          })
        );
      }
      await Promise.all(savePromises);
      logger2.debug(`Successfully saved ${savePromises.length} items`, {
        chatId,
        count: savePromises.length
      });
    } catch (error) {
      logger2.error(`Failed to save messages for chatId=${chatId}`, {
        chatId,
        error
      });
      throw error;
    }
  }
  /**
   * Generate a chat title if this is the first message.
   * Runs asynchronously without blocking the response.
   *
   * @param context - Execution context containing chatId
   * @param userMessage - The user's message to generate title from
   * @param writer - Stream writer for sending title update
   * @param existingChat - Pre-loaded chat object to avoid duplicate queries
   */
  async maybeGenerateChatTitle(context, userMessage, writer, existingChat) {
    if (!this.memory?.chats?.enabled || !this.memory?.chats?.generateTitle || !context) {
      return;
    }
    const { chatId } = this.extractMemoryIdentifiers(context);
    if (!chatId) {
      logger2.warn("Cannot generate title: chatId missing from context");
      return;
    }
    const isFirstMessage = !existingChat || existingChat.messageCount === 0;
    if (isFirstMessage) {
      this.generateChatTitle(chatId, userMessage, writer, context).catch(
        (err) => logger2.error("Title generation error", { error: err })
      );
    }
  }
  static create(config) {
    return new _Agent(config);
  }
};

// src/index.ts
init_context();

// src/guardrails.ts
var AgentsError = class extends Error {
  constructor(message, state) {
    super(message);
    this.state = state;
    this.name = "AgentsError";
  }
};
var InputGuardrailTripwireTriggered = class extends AgentsError {
  constructor(guardrailName, outputInfo, state) {
    super(`Input guardrail tripwire triggered: ${guardrailName}`, state);
    this.guardrailName = guardrailName;
    this.outputInfo = outputInfo;
    this.name = "InputGuardrailTripwireTriggered";
  }
};
var OutputGuardrailTripwireTriggered = class extends AgentsError {
  constructor(guardrailName, outputInfo, state) {
    super(`Output guardrail tripwire triggered: ${guardrailName}`, state);
    this.guardrailName = guardrailName;
    this.outputInfo = outputInfo;
    this.name = "OutputGuardrailTripwireTriggered";
  }
};
var GuardrailExecutionError = class extends AgentsError {
  constructor(guardrailName, originalError, state) {
    super(
      `Guardrail execution failed: ${guardrailName} - ${originalError.message}`,
      state
    );
    this.guardrailName = guardrailName;
    this.originalError = originalError;
    this.name = "GuardrailExecutionError";
  }
};
var MaxTurnsExceededError = class extends AgentsError {
  constructor(currentTurns, maxTurns, state) {
    super(`Maximum turns exceeded: ${currentTurns}/${maxTurns}`, state);
    this.currentTurns = currentTurns;
    this.maxTurns = maxTurns;
    this.name = "MaxTurnsExceededError";
  }
};
var ToolCallError = class extends AgentsError {
  constructor(toolName, originalError, state) {
    super(`Tool call failed: ${toolName} - ${originalError.message}`, state);
    this.toolName = toolName;
    this.originalError = originalError;
    this.name = "ToolCallError";
  }
};
var ToolPermissionDeniedError = class extends AgentsError {
  constructor(toolName, reason, state) {
    super(`Tool permission denied: ${toolName} - ${reason}`, state);
    this.toolName = toolName;
    this.reason = reason;
    this.name = "ToolPermissionDeniedError";
  }
};
async function runInputGuardrails(guardrails, input, context) {
  if (!guardrails || guardrails.length === 0) return;
  const results = await Promise.allSettled(
    guardrails.map(async (guardrail) => {
      try {
        const result = await guardrail.execute({ input, context });
        if (result.tripwireTriggered) {
          throw new InputGuardrailTripwireTriggered(
            guardrail.name,
            result.outputInfo
          );
        }
        return result;
      } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
          throw error;
        }
        throw new GuardrailExecutionError(
          guardrail.name,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    })
  );
  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }
}
async function runOutputGuardrails(guardrails, agentOutput, context) {
  if (!guardrails || guardrails.length === 0) return;
  const results = await Promise.allSettled(
    guardrails.map(async (guardrail) => {
      try {
        const result = await guardrail.execute({ agentOutput, context });
        if (result.tripwireTriggered) {
          throw new OutputGuardrailTripwireTriggered(
            guardrail.name,
            result.outputInfo
          );
        }
        return result;
      } catch (error) {
        if (error instanceof OutputGuardrailTripwireTriggered) {
          throw error;
        }
        throw new GuardrailExecutionError(
          guardrail.name,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    })
  );
  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }
}

// src/permissions.ts
async function checkToolPermission(permissions, toolName, args, context) {
  if (!permissions) return;
  try {
    const result = await permissions.check({ toolName, args, context });
    if (!result.allowed) {
      throw new ToolPermissionDeniedError(
        toolName,
        result.reason || "Permission denied"
      );
    }
  } catch (error) {
    if (error instanceof ToolPermissionDeniedError) {
      throw error;
    }
    throw error;
  }
}
function createUsageTracker() {
  return {
    toolCalls: {},
    tokens: 0
  };
}
function trackToolCall(usage, toolName) {
  usage.toolCalls[toolName] = (usage.toolCalls[toolName] || 0) + 1;
}

// src/routing.ts
var logger3 = createLogger("ROUTING");
function normalizeText(text) {
  return text.toLowerCase().trim().replace(/\d+/g, "").replace(/\s+/g, " ").trim();
}
function matchAgent(agent, message, matchOn) {
  if (!matchOn) {
    return { matched: false, score: 0 };
  }
  const normalizedMessage = normalizeText(message);
  let score = 0;
  if (typeof matchOn === "function") {
    try {
      const result = matchOn(message);
      return { matched: result, score: result ? 10 : 0 };
    } catch (error) {
      logger3.error(`Error in matchOn function for ${agent.name}`, {
        agent: agent.name,
        error
      });
      return { matched: false, score: 0 };
    }
  }
  for (const pattern of matchOn) {
    if (typeof pattern === "string") {
      const normalizedPattern = normalizeText(pattern);
      if (normalizedMessage.includes(normalizedPattern)) {
        const weight = normalizedPattern.split(" ").length;
        score += weight;
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(normalizedMessage)) {
        score += 2;
      }
    }
  }
  return { matched: score > 0, score };
}
function findBestMatch(agents, message, getMatchOn) {
  const scores = [];
  for (const agent of agents) {
    const matchOn = getMatchOn ? getMatchOn(agent) : void 0;
    const { matched, score } = matchAgent(agent, message, matchOn);
    if (matched && score > 0) {
      scores.push({ agent, score });
    }
  }
  if (scores.length === 0) {
    return null;
  }
  scores.sort((a, b) => b.score - a.score);
  return scores[0].agent;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Agent,
  AgentRunContext,
  AgentsError,
  GuardrailExecutionError,
  HANDOFF_TOOL_NAME,
  InputGuardrailTripwireTriggered,
  MaxTurnsExceededError,
  OutputGuardrailTripwireTriggered,
  ToolCallError,
  ToolPermissionDeniedError,
  checkToolPermission,
  createExecutionContext,
  createHandoff,
  createHandoffTool,
  createUsageTracker,
  extractTextFromMessage,
  findBestMatch,
  getContext,
  getTransferMessage,
  handoff,
  isHandoffResult,
  isHandoffTool,
  matchAgent,
  runInputGuardrails,
  runOutputGuardrails,
  trackToolCall,
  writeAgentStatus,
  writeDataPart,
  writeRateLimit
});
//# sourceMappingURL=index.cjs.map