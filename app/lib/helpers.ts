// lib/helpers.ts
// Misc helpers: parsing, extraction, simple utilities (TypeScript)
export function extractEmails(text: string): string[] {
  if (!text) return [];
  const re = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const matches = text.match(re);
  return matches || [];
}

export function extractPhones(text: string): string[] {
  if (!text) return [];
  // simple international/US-friendly phone regex; tweak as needed
  const re = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d-.\s]{6,14}\d/g;
  const matches = text.match(re);
  return matches || [];
}

export function snippet(text: string, len = 200) {
  if (!text) return "";
  return text.length <= len ? text : text.slice(0, len).trim() + "...";
}

export function detectUrgency(text: string): boolean {
  if (!text) return false;
  return /urgent|immediately|asap|as soon as possible|critical|blocked|down/i.test(
    text
  );
}
