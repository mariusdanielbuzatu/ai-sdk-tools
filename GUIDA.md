# Guida Completa a ai-sdk-tools (con OCR)

Questa guida e' pensata per darti una panoramica completa e pratica del toolkit `ai-sdk-tools`, con esempi progressivi (base -> avanzato) e focus sull'OCR. Tutti gli esempi sono compatibili con l'ecosistema Vercel AI SDK.

## Indice

- Panoramica e pacchetti
- Installazione
- Import server/client
- Esempio Base (chat con store)
- Store: stato chat ad alte prestazioni
- Artifacts: streaming strutturato
- Agents: orchestrazione multi-agente
- Suggerimenti automatici (prompt suggestions)
- Cache: caching universale dei tool
- Memory: memoria persistente e history
- Devtools: debug UI
- Debug: logger condiviso
- OCR: estrazione documenti
- Esempio Avanzato (pipeline completa)
- Feature integrabili

## Panoramica e pacchetti

`ai-sdk-tools` e' un toolkit modulare. Puoi usare il pacchetto unico o installare singoli moduli.

Pacchetti principali:
- `@ai-sdk-tools/store` stato chat ottimizzato
- `@ai-sdk-tools/artifacts` streaming strutturato
- `@ai-sdk-tools/agents` orchestrazione multi-agente
- `@ai-sdk-tools/cache` caching per tool
- `@ai-sdk-tools/memory` memoria persistente
- `@ai-sdk-tools/devtools` devtools UI
- `@ai-sdk-tools/debug` logger leggero
- `@ai-sdk-tools/ocr` OCR con fallback intelligente

## Installazione

Pacchetto unico:
```bash
npm install ai-sdk-tools
```

Pacchetti singoli:
```bash
npm install @ai-sdk-tools/store
npm install @ai-sdk-tools/artifacts
npm install @ai-sdk-tools/agents
npm install @ai-sdk-tools/cache
npm install @ai-sdk-tools/memory
npm install @ai-sdk-tools/devtools
npm install @ai-sdk-tools/debug
npm install @ai-sdk-tools/ocr
```

Peer dependency tipiche:
```bash
npm install ai @ai-sdk/react react react-dom zod zustand
```

## Import server/client

Export unificato:
- Server API: `ai-sdk-tools`
- Client API: `ai-sdk-tools/client`

Esempio:
```ts
// Server
import { Agent, cached, artifact, InMemoryProvider } from "ai-sdk-tools";

// Client
import { useChat, useArtifact, AIDevtools } from "ai-sdk-tools/client";
```

## Esempio Base: Chat con Store

Cliente React:
```tsx
import { Provider, useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";

function ChatUI() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}

export function App() {
  return (
    <Provider initialMessages={[]}>
      <ChatUI />
    </Provider>
  );
}
```

## Store: stato chat ad alte prestazioni

Cosa risolve:
- re-render minimizzati
- lookup messaggi O(1)
- virtualizzazione

Hook principali:
```tsx
import {
  useChat,
  useChatMessages,
  useMessageById,
  useMessageCount,
  useVirtualMessages,
  useSelector,
} from "@ai-sdk-tools/store";

const chat = useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });
const messages = useChatMessages();
const count = useMessageCount();
const msg = useMessageById("message-id");
const visible = useVirtualMessages(0, 50);

const userCount = useSelector(
  "userMessages",
  (msgs) => msgs.filter((m) => m.role === "user").length,
  [messages.length]
);
```

Debug logging (store):
```bash
DEBUG=true npm run dev
```

## Artifacts: streaming strutturato

Definisci un artifact con schema Zod:
```ts
import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

export const ReportArtifact = artifact(
  "report",
  z.object({
    title: z.string(),
    status: z.enum(["loading", "processing", "complete"]),
    sections: z.array(
      z.object({
        heading: z.string(),
        content: z.string(),
      })
    ),
  })
);
```

Usalo dentro un tool:
```ts
import { tool } from "ai";

const buildReport = tool({
  description: "Genera report",
  parameters: z.object({ topic: z.string() }),
  execute: async ({ topic }) => {
    const report = ReportArtifact.stream({
      title: `Report su ${topic}`,
      status: "loading",
      sections: [],
    });

    await report.update({ status: "processing" });

    await report.complete({
      title: `Report su ${topic}`,
      status: "complete",
      sections: [{ heading: "Sintesi", content: "..." }],
    });

    return "Report pronto";
  },
});
```

Consumo in React:
```tsx
import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { ReportArtifact } from "./artifacts";

function ReportView() {
  const { data, status, progress } = useArtifact(ReportArtifact);

  if (!data) return null;
  return (
    <div>
      <h2>{data.title}</h2>
      <div>Stato: {status}</div>
      {progress != null && <div>Progress: {progress * 100}%</div>}
      {data.sections.map((s) => (
        <section key={s.heading}>
          <h3>{s.heading}</h3>
          <p>{s.content}</p>
        </section>
      ))}
    </div>
  );
}
```

## Agents: orchestrazione multi-agente

Agente singolo:
```ts
import { Agent } from "@ai-sdk-tools/agents";
import { openai } from "@ai-sdk/openai";

const assistant = new Agent({
  name: "Assistant",
  model: openai("gpt-4o"),
  instructions: "Sei un assistente utile.",
});

const result = await assistant.generate({ prompt: "Quanto fa 2+2?" });
console.log(result.text);
```

Handoff tra agenti:
```ts
const math = new Agent({
  name: "Math",
  model: openai("gpt-4o"),
  instructions: "Risolvi problemi matematici.",
});

const history = new Agent({
  name: "History",
  model: openai("gpt-4o"),
  instructions: "Rispondi a domande storiche.",
});

const router = new Agent({
  name: "Router",
  model: openai("gpt-4o-mini"),
  instructions: "Scegli lo specialista giusto.",
  handoffs: [math, history],
});

const res = await router.generate({ prompt: "Formula risolutiva?" });
```

Routing con pattern:
```ts
const routingAgent = new Agent({
  name: "SmartRouter",
  model: openai("gpt-4o-mini"),
  instructions: "Instrada richieste.",
  handoffs: [math, history],
  matchOn: ["math", "equation", /\d+\s*[\+\-\*\/]\s*\d+/],
});
```

## Suggerimenti automatici (prompt suggestions)

`@ai-sdk-tools/agents` include la generazione automatica di suggerimenti contestuali. I suggerimenti:
- vengono generati alla fine della risposta
- sono basati sul contesto recente della conversazione
- vengono emessi come data part `data-suggestions` (transient, non salvata in history)
- funzionano solo con `agent.toUIMessageStream(...)`

### Configurazione server

Per attivare le suggestion serve un `memory.provider` (anche solo InMemory) e la sezione `memory.chats.generateSuggestions`:

```ts
import { Agent } from "@ai-sdk-tools/agents";
import { InMemoryProvider } from "@ai-sdk-tools/memory";
import { openai } from "@ai-sdk/openai";

const agent = new Agent({
  name: "Assistant",
  model: openai("gpt-4o"),
  instructions: "Sei un assistente utile.",
  memory: {
    provider: new InMemoryProvider(),
    chats: {
      enabled: true,
      generateSuggestions: {
        enabled: true,
        limit: 5,
        minResponseLength: 120,
        contextWindow: 1,
        model: openai("gpt-4o-mini"),
        // instructions: "Istruzioni custom (opzionale)"
      },
    },
  },
});
```

Opzioni principali:
- `enabled`: boolean o funzione `(params) => boolean | Promise<boolean>`
- `limit`: numero massimo di suggerimenti
- `minResponseLength`: lunghezza minima della risposta prima di generare
- `contextWindow`: numero di scambi recenti (user+assistant) usati per il contesto
- `model`: modello da usare per generare le suggestion
- `instructions`: prompt custom per controllare lo stile delle suggestion

### Consumo client (useChat)

Le suggestion arrivano nello stream come `data-suggestions`. Puoi intercettarle con `onData`:

```tsx
import { useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";

function ChatWithSuggestions() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onData: (data) => {
      if (data.type === "data-suggestions") {
        console.log(data.data.prompts); // string[]
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
```

Se vuoi mostrarle in UI, puoi salvarle in uno stato locale e renderizzarle come quick-reply.

## Cache: caching universale dei tool

Base LRU:
```ts
import { createCached } from "@ai-sdk-tools/cache";
import { tool } from "ai";
import { z } from "zod";

const expensiveTool = tool({
  description: "Chiamata costosa",
  parameters: z.object({ id: z.string() }),
  execute: async ({ id }) => fetch(`/api/data/${id}`).then((r) => r.json()),
});

const cached = createCached();
const cachedTool = cached(expensiveTool);
```

Con Redis:
```ts
import { Redis } from "@upstash/redis";
import { createCached } from "@ai-sdk-tools/cache";

const cached = createCached({
  cache: Redis.fromEnv(),
  ttl: 30 * 60 * 1000,
});
```

Cache con contesto utente:
```ts
const cachedTool = cached(expensiveTool, {
  cacheKey: () => {
    const user = getCurrentUser();
    return `team:${user.teamId}:user:${user.id}`;
  },
});
```

## Memory: memoria persistente e history

InMemory provider:
```ts
import { InMemoryProvider } from "@ai-sdk-tools/memory";

const memory = new InMemoryProvider();
```

Redis provider:
```ts
import { createClient } from "redis";
import { RedisProvider } from "@ai-sdk-tools/memory/redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const memory = new RedisProvider(redis, {
  prefix: "my-app:memory:",
  messageTtl: 60 * 60 * 24 * 30,
});
```

Upstash provider:
```ts
import { Redis } from "@upstash/redis";
import { UpstashProvider } from "@ai-sdk-tools/memory/upstash";

const memory = new UpstashProvider(Redis.fromEnv(), {
  prefix: "my-app:memory:",
});
```

Configurazione memoria negli agenti:
```ts
const agent = new Agent({
  name: "Assistant",
  model: openai("gpt-4o"),
  instructions: "Ricorda preferenze utente.",
  memory: {
    provider: memory,
    workingMemory: {
      enabled: true,
      scope: "chat",
    },
    history: {
      enabled: true,
      limit: 10,
    },
  },
});
```

## Devtools: debug UI

Uso base:
```tsx
import { AIDevtools } from "@ai-sdk-tools/devtools";

function App() {
  return (
    <>
      <YourUI />
      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </>
  );
}
```

Uso avanzato:
```tsx
<AIDevtools
  enabled={true}
  maxEvents={1000}
  modelId="gpt-4o"
  config={{
    position: "bottom",
    height: 400,
    streamCapture: { enabled: true, endpoint: "/api/chat", autoConnect: true },
    throttle: { enabled: true, interval: 100, includeTypes: ["text-delta"] },
  }}
/>
```

## Debug: logger condiviso

```ts
import { createLogger } from "@ai-sdk-tools/debug";

const logger = createLogger("AGENT");
logger.info("Avvio", { step: "start" });
logger.warn("Attenzione", { reason: "timeout" });
```

## OCR: estrazione documenti

Uso base:
```ts
import { ocr } from "@ai-sdk-tools/ocr";

const invoice = await ocr(imageBuffer, "invoice");
const receipt = await ocr("https://example.com/receipt.jpg", "receipt");
```

Con schema personalizzato:
```ts
import { ocr } from "@ai-sdk-tools/ocr";
import { z } from "zod";

const schema = z.object({
  supplier: z.string(),
  total: z.number(),
  date: z.string(),
});

const result = await ocr(file, schema);
```

Con opzioni provider:
```ts
const result = await ocr(imageBuffer, "invoice", {
  providers: {
    mistral: { model: "mistral-medium-latest" },
    gemini: { model: "gemini-1.5-pro" },
  },
  retries: 3,
  timeout: 20000,
});
```

Gestione errori:
```ts
import { OCRError } from "@ai-sdk-tools/ocr";

try {
  const data = await ocr(file, "receipt");
} catch (err) {
  if (err instanceof OCRError) {
    console.error(err.message);
    console.error(err.attempts);
  }
}
```

Note pratiche:
- Per usare Mistral o Gemini devi installare i rispettivi SDK e configurare le API key secondo le loro guide.
- Il supporto PDF puo' usare `unpdf` (dipendenza opzionale) per fallback.

## Esempio Avanzato: pipeline completa

Scenario: agente che usa tool con cache, memoria persistente e artifacts.

```ts
import { Agent } from "@ai-sdk-tools/agents";
import { createCached } from "@ai-sdk-tools/cache";
import { InMemoryProvider } from "@ai-sdk-tools/memory";
import { artifact } from "@ai-sdk-tools/artifacts";
import { tool } from "ai";
import { z } from "zod";

const AnalysisArtifact = artifact(
  "analysis",
  z.object({
    title: z.string(),
    status: z.enum(["loading", "complete"]),
    insights: z.array(z.string()),
  })
);

const expensiveTool = tool({
  description: "Analisi costosa",
  parameters: z.object({ topic: z.string() }),
  execute: async ({ topic }) => {
    const a = AnalysisArtifact.stream({
      title: `Analisi ${topic}`,
      status: "loading",
      insights: [],
    });

    await a.complete({
      title: `Analisi ${topic}`,
      status: "complete",
      insights: ["Insight 1", "Insight 2"],
    });

    return "Done";
  },
});

const cached = createCached();
const cachedTool = cached(expensiveTool);

const agent = new Agent({
  name: "Analyst",
  model: openai("gpt-4o"),
  instructions: "Analizza in modo chiaro e sintetico.",
  tools: { analyze: cachedTool },
  memory: {
    provider: new InMemoryProvider(),
    workingMemory: { enabled: true, scope: "chat" },
    history: { enabled: true, limit: 10 },
  },
});
```

## Feature integrabili

- Store: sostituzione diretta di `@ai-sdk/react` con performance superiori.
- Artifacts: UI avanzate con streaming strutturato e progress.
- Agents: workflow multi-agente, routing e handoff.
- Suggestions: prompt suggeriti contestuali via `data-suggestions`.
- Cache: riduzione costi e latenza per tool ripetitivi.
- Memory: contesto persistente tra sessioni.
- Devtools: ispezione streaming, tool call e performance in runtime.
- Debug: logging leggero per diagnosi.
- OCR: estrazione automatica da invoice/receipt con fallback.
