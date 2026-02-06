import { generateObject } from 'ai';
import { z } from 'zod';

// src/merge.ts
function mergeResults(primary, fallback) {
  const merged = { ...primary };
  for (const key in fallback) {
    const primaryValue = merged[key];
    const fallbackValue = fallback[key];
    if (primaryValue === void 0 || primaryValue === null || primaryValue === "" || typeof primaryValue === "number" && primaryValue === 0) {
      if (fallbackValue !== void 0 && fallbackValue !== null) {
        merged[key] = fallbackValue;
      }
    }
    if (Array.isArray(primaryValue) && primaryValue.length === 0) {
      if (Array.isArray(fallbackValue) && fallbackValue.length > 0) {
        merged[key] = fallbackValue;
      }
    }
  }
  return merged;
}

// src/utils.ts
async function normalizeInput(input) {
  if (Buffer.isBuffer(input)) {
    const base64 = input.toString("base64");
    const mediaType = detectMediaType(input);
    return { data: base64, mediaType };
  }
  if (input instanceof File) {
    const arrayBuffer = await input.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mediaType = input.type || detectMediaType(buffer);
    return { data: base64, mediaType };
  }
  if (typeof input === "string") {
    if (input.startsWith("data:")) {
      const [header, data] = input.split(",");
      const mediaType = header.match(/data:([^;]+)/)?.[1] || "image/png";
      return { data, mediaType };
    }
    if (input.startsWith("http://") || input.startsWith("https://")) {
      const response = await fetch(input);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const contentType = response.headers.get("content-type") || "image/png";
      return { data: base64, mediaType: contentType };
    }
    if (typeof process !== "undefined" && process.versions?.node) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        try {
          await fs.access(input);
          const buffer = await fs.readFile(input);
          const base64 = buffer.toString("base64");
          const ext = path.extname(input).toLowerCase();
          const mediaType = getMediaTypeFromExtension(ext);
          return { data: base64, mediaType };
        } catch {
        }
      } catch {
      }
    }
    return { data: input, mediaType: "image/png" };
  }
  throw new Error("Unsupported input format");
}
function detectMediaType(buffer) {
  if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) {
    return "application/pdf";
  }
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return "image/png";
  }
  if (buffer[0] === 255 && buffer[1] === 216) {
    return "image/jpeg";
  }
  if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70) {
    return "image/gif";
  }
  return "image/png";
}
function getMediaTypeFromExtension(ext) {
  const map = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp"
  };
  return map[ext] || "image/png";
}
async function retryCall(fn, options = {}) {
  const { retries = 3, timeout = 2e4, delay = 1e3 } = options;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const result = await fn();
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        const backoffDelay = delay * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }
  throw lastError || new Error("Retry failed");
}

// src/providers/gemini.ts
var geminiProvider;
async function getGeminiProvider(config) {
  if (!geminiProvider) {
    try {
      const google = await import('@ai-sdk/google');
      geminiProvider = google.google;
    } catch {
      throw new Error(
        "@ai-sdk/google is not installed. Install it with: npm install @ai-sdk/google"
      );
    }
  }
  const apiKey = config?.apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google API key is required. Set GOOGLE_GENERATIVE_AI_API_KEY or provide apiKey in config"
    );
  }
  const model = config?.model || "gemini-1.5-pro";
  return geminiProvider(model, { apiKey });
}
async function extractWithGemini(options, config) {
  const startTime = Date.now();
  try {
    const model = await getGeminiProvider(config);
    const dataUri = `data:${options.input.mediaType};base64,${options.input.data}`;
    const result = await retryCall(
      () => generateObject({
        model,
        schema: options.schema,
        temperature: 0.1,
        abortSignal: AbortSignal.timeout(options.timeout || 2e4),
        messages: [
          {
            role: "system",
            content: options.prompt
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: dataUri
              }
            ]
          }
        ]
      }),
      {
        retries: options.retries || 3,
        timeout: options.timeout || 2e4
      }
    );
    return {
      success: true,
      result: result.object,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      duration: Date.now() - startTime
    };
  }
}
var mistralProvider;
async function getMistralProvider(config) {
  if (!mistralProvider) {
    try {
      const mistral = await import('@ai-sdk/mistral');
      mistralProvider = mistral.mistral;
    } catch {
      throw new Error(
        "@ai-sdk/mistral is not installed. Install it with: npm install @ai-sdk/mistral"
      );
    }
  }
  const apiKey = config?.apiKey || process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Mistral API key is required. Set MISTRAL_API_KEY or provide apiKey in config"
    );
  }
  const model = config?.model || "mistral-medium-latest";
  return mistralProvider(model, { apiKey });
}
async function extractWithMistral(options, config) {
  const startTime = Date.now();
  try {
    const model = await getMistralProvider(config);
    const result = await retryCall(
      () => generateObject({
        model,
        schema: options.schema,
        temperature: 0.1,
        abortSignal: AbortSignal.timeout(options.timeout || 2e4),
        messages: [
          {
            role: "system",
            content: options.prompt
          },
          {
            role: "user",
            content: [
              {
                type: "file",
                data: options.input.data,
                mediaType: options.input.mediaType
              }
            ]
          }
        ],
        providerOptions: {
          mistral: {
            documentPageLimit: 10
          }
        }
      }),
      {
        retries: options.retries || 3,
        timeout: options.timeout || 2e4
      }
    );
    return {
      success: true,
      result: result.object,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      duration: Date.now() - startTime
    };
  }
}
var unpdfModule;
async function extractTextFromPDF(buffer) {
  if (!unpdfModule) {
    try {
      unpdfModule = await import('unpdf');
    } catch {
      throw new Error(
        "unpdf is not installed. Install it with: npm install unpdf"
      );
    }
  }
  const { getDocumentProxy, extractText } = unpdfModule;
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });
  return text.replaceAll("\0", "");
}
async function extractWithOCRFallback(options, config) {
  const startTime = Date.now();
  try {
    const buffer = Buffer.from(options.input.data, "base64");
    let text;
    if (options.input.mediaType === "application/pdf") {
      text = await extractTextFromPDF(buffer);
    } else {
      return {
        success: false,
        error: new Error("OCR fallback is only available for PDF documents"),
        duration: Date.now() - startTime
      };
    }
    const textPrompt = `${options.prompt}

Extract structured data from the following OCR text:`;
    const result = await retryCall(
      async () => {
        const mistral = await import('@ai-sdk/mistral');
        const model = config?.model || "mistral-medium-latest";
        const apiKey = config?.apiKey || process.env.MISTRAL_API_KEY;
        if (!apiKey) {
          throw new Error(
            "Mistral API key is required. Set MISTRAL_API_KEY or provide apiKey in config"
          );
        }
        const mistralModel = mistral.mistral(model, { apiKey });
        return generateObject({
          model: mistralModel,
          schema: options.schema,
          temperature: 0.1,
          abortSignal: AbortSignal.timeout(options.timeout || 2e4),
          messages: [
            {
              role: "system",
              content: textPrompt
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text
                }
              ]
            }
          ]
        });
      },
      {
        retries: options.retries || 3,
        timeout: options.timeout || 2e4
      }
    );
    return {
      success: true,
      result: result.object,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      duration: Date.now() - startTime
    };
  }
}

// src/quality.ts
function validateQuality(result, schema, threshold) {
  const defaultThreshold = {
    requireTotal: true,
    requireCurrency: true,
    requireVendor: true,
    requireDate: true
  };
  const config = { ...defaultThreshold, ...threshold };
  const parsed = schema.safeParse(result);
  if (!parsed.success) {
    return false;
  }
  const data = parsed.data;
  if (config.requireTotal) {
    const total = data.total_amount;
    if (!total || typeof total === "number" && total <= 0) {
      return false;
    }
  }
  if (config.requireCurrency) {
    const currency = data.currency;
    if (!currency || typeof currency !== "string" || currency.trim() === "") {
      return false;
    }
  }
  if (config.requireVendor) {
    const vendor = data.vendor_name;
    if (!vendor || typeof vendor !== "string" || vendor.trim() === "") {
      return false;
    }
  }
  if (config.requireDate) {
    const invoiceDate = data.invoice_date;
    const dueDate = data.due_date;
    const date = data.date;
    if ((!invoiceDate || typeof invoiceDate === "string" && invoiceDate.trim() === "") && (!dueDate || typeof dueDate === "string" && dueDate.trim() === "") && (!date || typeof date === "string" && date.trim() === "")) {
      return false;
    }
  }
  return true;
}
var lineItemSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().optional(),
  unit_price: z.number().optional(),
  total: z.number().optional()
});
var invoiceSchema = z.object({
  total_amount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  invoice_date: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  invoice_number: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  vendor_address: z.string().nullable().optional(),
  customer_address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  tax_amount: z.number().nullable().optional(),
  tax_rate: z.number().nullable().optional(),
  tax_type: z.string().nullable().optional(),
  payment_instructions: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  line_items: z.array(lineItemSchema).optional()
});
var receiptSchema = z.object({
  total_amount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  transaction_id: z.string().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  items: z.array(lineItemSchema).optional(),
  tax_amount: z.number().nullable().optional(),
  tax_rate: z.number().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  tip: z.number().nullable().optional(),
  notes: z.string().nullable().optional()
});

// src/types.ts
var OCRError = class extends Error {
  constructor(message, attempts, finalError) {
    super(message);
    this.attempts = attempts;
    this.finalError = finalError;
    this.name = "OCRError";
  }
};

// src/ocr.ts
var INVOICE_PROMPT = `Extract structured data from this invoice document. Extract all relevant fields including vendor information, dates, amounts, line items, tax information, and payment details. Be accurate and complete.`;
var RECEIPT_PROMPT = `Extract structured data from this receipt document. Extract all relevant fields including vendor/merchant name, date, total amount, items purchased, payment method, and transaction details. Be accurate and complete.`;
function getSchemaAndPrompt(typeOrSchema) {
  if (typeof typeOrSchema === "string") {
    if (typeOrSchema === "invoice") {
      return { schema: invoiceSchema, prompt: INVOICE_PROMPT };
    }
    if (typeOrSchema === "receipt") {
      return { schema: receiptSchema, prompt: RECEIPT_PROMPT };
    }
  }
  return {
    schema: typeOrSchema,
    prompt: "Extract structured data from this document according to the provided schema. Be accurate and complete."
  };
}
async function ocr(input, typeOrSchema, options = {}) {
  const attempts = [];
  const { schema, prompt } = getSchemaAndPrompt(typeOrSchema);
  const normalizedInput = await normalizeInput(input);
  const extractOptions = {
    schema,
    input: normalizedInput,
    prompt,
    timeout: options.timeout || 2e4,
    retries: options.retries ?? 3
  };
  let primaryResult;
  let primaryError;
  try {
    const mistralResult = await extractWithMistral(
      extractOptions,
      options.providers?.mistral
    );
    attempts.push({
      provider: "mistral",
      success: mistralResult.success,
      error: mistralResult.error,
      result: mistralResult.result,
      duration: mistralResult.duration
    });
    if (mistralResult.success && mistralResult.result) {
      primaryResult = mistralResult.result;
      const isQualityGood = validateQuality(
        primaryResult,
        schema,
        options.qualityThreshold
      );
      if (isQualityGood) {
        return primaryResult;
      }
    } else {
      primaryError = mistralResult.error;
    }
  } catch (error) {
    primaryError = error instanceof Error ? error : new Error(String(error));
    attempts.push({
      provider: "mistral",
      success: false,
      error: primaryError
    });
  }
  let fallbackResult;
  let fallbackError;
  try {
    const geminiResult = await extractWithGemini(
      extractOptions,
      options.providers?.gemini
    );
    attempts.push({
      provider: "gemini",
      success: geminiResult.success,
      error: geminiResult.error,
      result: geminiResult.result,
      duration: geminiResult.duration
    });
    if (geminiResult.success && geminiResult.result) {
      fallbackResult = geminiResult.result;
      if (primaryResult) {
        return mergeResults(primaryResult, fallbackResult);
      }
      const isQualityGood = validateQuality(
        fallbackResult,
        schema,
        options.qualityThreshold
      );
      if (isQualityGood) {
        return fallbackResult;
      }
    } else {
      fallbackError = geminiResult.error;
    }
  } catch (error) {
    fallbackError = error instanceof Error ? error : new Error(String(error));
    attempts.push({
      provider: "gemini",
      success: false,
      error: fallbackError
    });
  }
  if (normalizedInput.mediaType === "application/pdf") {
    try {
      const ocrResult = await extractWithOCRFallback(
        extractOptions,
        options.providers?.mistral
      );
      attempts.push({
        provider: "ocr-fallback",
        success: ocrResult.success,
        error: ocrResult.error,
        result: ocrResult.result,
        duration: ocrResult.duration
      });
      if (ocrResult.success && ocrResult.result) {
        const ocrData = ocrResult.result;
        if (primaryResult) {
          return mergeResults(primaryResult, ocrData);
        }
        if (fallbackResult) {
          return mergeResults(fallbackResult, ocrData);
        }
        return ocrData;
      }
    } catch (error) {
      attempts.push({
        provider: "ocr-fallback",
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }
  if (primaryResult) {
    return primaryResult;
  }
  if (fallbackResult) {
    return fallbackResult;
  }
  const finalError = primaryError || fallbackError || new Error("All OCR providers failed");
  throw new OCRError(
    `Failed to extract data from document: ${finalError.message}`,
    attempts,
    finalError
  );
}

export { OCRError, invoiceSchema, ocr, receiptSchema };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map