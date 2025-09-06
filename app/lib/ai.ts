// lib/ai.ts
// Gemini LLM helper (TypeScript)
// Uses @google/generative-ai client (or a small wrapper) to call Gemini for:
// - sentiment analysis
// - entity extraction (phones/emails/requirements)
// - draft reply generation
//
// NOTE: Install the official Google generative AI client or use fetch requests to the Google GenAI endpoint.
// The below assumes a client similar to `@google/generative-ai` that exposes .responses.generate
// Adjust according to the exact SDK you install.

import { logger } from "./logger";
import { extractEmails, extractPhones, detectUrgency } from "./helpers";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
  logger.warn("GEMINI_API_KEY not set. AI functions will fail until provided.");
}

/**
 * Lightweight wrapper type for generated LLM output
 */
type LLMResponse = {
  text: string;
};

/**
 * sendToGemini: minimal wrapper using fetch to call Google's GenAI REST API.
 * Replace endpoint and shape depending on the SDK you use.
 */
async function sendToGemini(prompt: string, maxTokens = 300): Promise<LLMResponse> {
  // This is a generic HTTP wrapper. If you use the official SDK, replace this with SDK calls.
  const apiUrl = process.env.GENAI_API_URL || "https://generativelanguage.googleapis.com/v1/models/gemini-1.0:generateText";
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

  const body = {
    prompt: {
      text: prompt,
    },
    // maxOutputTokens is an example; the actual param name depends on the API
    maxOutputTokens: maxTokens,
  };

  const res = await fetch(apiUrl + `?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    logger.error("Gemini API error:", res.status, txt);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const json = await res.json();
  // shape depends on API. We attempt best-effort extraction.
  const text =
    (json?.candidates && Array.isArray(json.candidates) && json.candidates[0]?.content) ||
    json?.output?.[0]?.content?.[0]?.text ||
    json?.output?.[0]?.content?.[0]?.text || // fallback
    JSON.stringify(json);
  return { text: String(text) };
}

/**
 * analyzeSentiment: returns 'positive'|'neutral'|'negative'
 */
export async function analyzeSentiment(text: string) {
  if (!text) return "neutral";
  const prompt = `Classify the sentiment of the following text as one word: Positive, Neutral, or Negative.\n\nText:\n${text}\n\nAnswer with a single word.`;
  try {
    const resp = await sendToGemini(prompt, 40);
    const out = resp.text.trim().toLowerCase();
    if (out.includes("positive")) return "positive";
    if (out.includes("negative")) return "negative";
    return "neutral";
  } catch (err) {
    logger.error("analyzeSentiment failed:", err);
    return "neutral";
  }
}

/**
 * extractEntities: attempts to extract phone, altEmail, and a short 'requirements' summary
 */
export async function extractEntities(text: string) {
  const phones = extractPhones(text);
  const emails = extractEmails(text);

  const prompt = `Extract a one-sentence summary of the customer's request from the text below, and detect if there are urgency indicators. Output JSON with keys: {"requirements": "...", "urgency": "yes" | "no" }.\n\nText:\n${text}\n\nJSON:`;
  try {
    const resp = await sendToGemini(prompt, 150);
    // Attempt to parse JSON out of output
    const maybe = resp.text.trim();
    let parsed: { requirements?: string; urgency?: string } = {};
    try {
      // try to find JSON substring
      const jsonStart = maybe.indexOf("{");
      const jsonText = jsonStart >= 0 ? maybe.slice(jsonStart) : maybe;
      parsed = JSON.parse(jsonText);
    } catch (e) {
      // If parsing fails, fallback to naive extraction
      parsed.requirements = maybe.split("\n")[0] || "";
      parsed.urgency = detectUrgency(text) ? "yes" : "no";
    }

    return {
      phone: phones[0] || null,
      altEmail: emails.find((e) => !/yourdomain\.com$/i.test(e)) || emails[0] || null,
      requirements: parsed.requirements || "",
      urgency: parsed.urgency === "yes",
    };
  } catch (err) {
    logger.error("extractEntities failed:", err);
    return {
      phone: phones[0] || null,
      altEmail: emails[0] || null,
      requirements: "",
      urgency: detectUrgency(text),
    };
  }
}

/**
 * generateDraftReply: produce an empathetic, professional reply using Gemini.
 * You can pass optional contextual 'kbContext' for RAG if available.
 */
export async function generateDraftReply(params: {
  from?: string;
  subject?: string;
  body: string;
  kbContext?: string; // optional relevant knowledge base text
}) {
  const { from, subject, body, kbContext } = params;
  const header = `You are a professional customer support agent. Write a short (3-6 sentences), empathetic, and action-oriented reply. Mention next steps and expected timelines if applicable. Keep it polite and use a professional tone.`;

  const contextBlock = kbContext ? `Context (KB):\n${kbContext}\n\n` : "";

  const prompt = `${header}\n\n${contextBlock}Customer email subject: ${subject || "(no subject)"}\nFrom: ${from || "(unknown)"}\n\nEmail body:\n${body}\n\nReply:`;

  try {
    const resp = await sendToGemini(prompt, 350);
    const replyText = (resp.text || "").trim();
    return { reply: replyText, model: "gemini-2.0-flash", confidence: 0.9 };
  } catch (err) {
    logger.error("generateDraftReply failed:", err);
    return { reply: "Sorry — we're looking into this and will get back shortly.", model: "gemini", confidence: 0.5 };
  }
}

/**
 * categorizeEmail: classify incoming emails into category + priority
 */
export async function categorizeEmail(text: string) {
  const prompt = `
  Categorize the following email into one of: Support, Billing, Technical, General.
  Also assign a priority: High, Medium, Low.
  
  Email:
  ${text}
  
  Respond in JSON with keys { "category": "...", "priority": "..." }.
  `;

  try {
    const resp = await sendToGemini(prompt, 150);
    let parsed: { category?: string; priority?: string } = {};

    try {
      const maybe = resp.text.trim();
      const jsonStart = maybe.indexOf("{");
      const jsonText = jsonStart >= 0 ? maybe.slice(jsonStart) : maybe;
      parsed = JSON.parse(jsonText);
    } catch {
      parsed = { category: "General", priority: "Low" };
    }

    return {
      category: parsed.category || "General",
      priority: parsed.priority || "Low",
    };
  } catch (err) {
    logger.error("categorizeEmail failed:", err);
    return { category: "General", priority: "Low" };
  }
}

