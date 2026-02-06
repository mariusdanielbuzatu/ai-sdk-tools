// src/index.ts
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
var logger = {
  debug: (message, data) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.blue}DEBUG${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
    console.log(`${ts} ${level} ${message}${dataStr}`);
  },
  info: (message, data) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.green}INFO${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
    console.log(`${ts} ${level} ${message}${dataStr}`);
  },
  warn: (message, data) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.yellow}WARN${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
    console.warn(`${ts} ${level} ${message}${dataStr}`);
  },
  error: (message, data) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.red}ERROR${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : "";
    console.error(`${ts} ${level} ${message}${dataStr}`);
  }
};
export {
  createLogger,
  logger
};
//# sourceMappingURL=index.js.map