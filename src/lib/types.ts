import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bank: z.string(),
  type: z.enum(['personal','education','vehicle','home','credit_line','debt_consolidation']),
  rate_apr: z.number(),
  min_income: z.number(),
  min_credit_score: z.number(),
  tenure_min_months: z.number().default(6),
  tenure_max_months: z.number().default(60),
  processing_fee_pct: z.number().default(0),
  
  
  prepayment_allowed: z.boolean().default(true),
  disbursal_speed: z.string().default('standard'),
  docs_level: z.string().default('standard'),
  
  summary: z.string().nullable(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional().default([]),
  terms: z.record(z.string(), z.any()).optional().default({}), 
});


export type Product = z.infer<typeof ProductSchema>;


export const ChatRequestSchema = z.object({
  productId: z.string().uuid(),
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  }))
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// chat message waala yha laga dunga
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};