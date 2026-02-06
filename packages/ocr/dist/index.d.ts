import { z } from 'zod';

type DocumentType = "invoice" | "receipt";
interface MistralConfig {
    model?: string;
    apiKey?: string;
}
interface GeminiConfig {
    model?: string;
    apiKey?: string;
}
interface ProviderConfig {
    mistral?: MistralConfig;
    gemini?: GeminiConfig;
}
interface OCROptions {
    providers?: ProviderConfig;
    timeout?: number;
    retries?: number;
    qualityThreshold?: QualityThreshold;
}
interface QualityThreshold {
    requireTotal?: boolean;
    requireCurrency?: boolean;
    requireVendor?: boolean;
    requireDate?: boolean;
}
interface ProviderAttempt {
    provider: "mistral" | "gemini" | "ocr-fallback";
    success: boolean;
    error?: Error;
    result?: unknown;
    duration?: number;
}
declare class OCRError extends Error {
    attempts: ProviderAttempt[];
    finalError?: Error | undefined;
    constructor(message: string, attempts: ProviderAttempt[], finalError?: Error | undefined);
}
type OCRInput = Buffer | string | File;

declare function ocr<T extends Record<string, unknown>>(input: OCRInput, typeOrSchema: "invoice" | "receipt" | z.ZodSchema<T>, options?: OCROptions): Promise<T>;

declare const invoiceSchema: z.ZodObject<{
    total_amount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vendor_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    invoice_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    due_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    invoice_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    customer_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vendor_address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    customer_address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tax_amount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tax_rate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tax_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payment_instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    language: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodOptional<z.ZodNumber>;
        unit_price: z.ZodOptional<z.ZodNumber>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
declare const receiptSchema: z.ZodObject<{
    total_amount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vendor_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transaction_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    payment_method: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodOptional<z.ZodNumber>;
        unit_price: z.ZodOptional<z.ZodNumber>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    tax_amount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tax_rate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    subtotal: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tip: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type InvoiceData = z.infer<typeof invoiceSchema>;
type ReceiptData = z.infer<typeof receiptSchema>;

export { type DocumentType, type GeminiConfig, type InvoiceData, type MistralConfig, OCRError, type OCRInput, type OCROptions, type ProviderConfig, type QualityThreshold, type ReceiptData, invoiceSchema, ocr, receiptSchema };
