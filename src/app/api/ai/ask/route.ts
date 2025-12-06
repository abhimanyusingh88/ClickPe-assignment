import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";
import { ChatRequestSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { productId, message } = validation.data;

    // Fetch product
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // GROQ Init
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `
You are a helpful financial assistant for ClickPE.

PRODUCT DETAILS:
Name: ${product.name}
Bank: ${product.bank}
Type: ${product.type}
Interest Rate (APR): ${product.rate_apr}%
Min Income: ₹${product.min_income}
Min Credit Score: ${product.min_credit_score}
Tenure: ${product.tenure_min_months} to ${product.tenure_max_months} months
Processing Fee: ${product.processing_fee_pct}%
Prepayment Allowed: ${product.prepayment_allowed ? "Yes" : "No"}
Disbursal Speed: ${product.disbursal_speed}
Summary: ${product.summary}

RULES:
1. Base answers ONLY on the product data.
2. If missing, say “I don't have that information.”
3. Use simple, clear, friendly language.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const text = completion.choices[0]?.message?.content || "No answer.";

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("AI Error:", err);
    return NextResponse.json(
      { error: "AI service failed." },
      { status: 500 }
    );
  }
}
