// lib/gmail.ts
import { google } from "googleapis";
import { logger } from "./logger";
import { snippet } from "./helpers";

const { OAuth2 } = google.auth;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
];

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  logger.warn("⚠️ Gmail client credentials not fully configured.");
}

export function createOAuth2Client(tokens?: { access_token?: string; refresh_token?: string }) {
  const oAuth2Client = new OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
  if (tokens) {
    oAuth2Client.setCredentials(tokens);
  }
  return oAuth2Client;
}

export function generateAuthUrl() {
  const oAuth2Client = createOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent",
  });
}

export async function getTokensFromCode(code: string) {
  const oAuth2Client = createOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

/**
 * Fetch unread messages from Gmail
 */
export async function fetchUnreadMessages(tokens: any, maxResults = 10) {
  const auth = createOAuth2Client(tokens);
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread subject:(support OR query OR request OR help)",
    maxResults,
  });

  const messages = res.data.messages || [];
  const out: any[] = [];

  for (const m of messages) {
    try {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: m.id!,
        format: "full",
      });

      const payload = msg.data.payload!;
      const headers = payload.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

      const from = getHeader("From");
      const to = getHeader("To");
      const subject = getHeader("Subject");
      const date = getHeader("Date");

      let body = "";
      function walkParts(part: any) {
        if (!part) return;
        if (part.mimeType === "text/plain" && part.body?.data) {
          body += Buffer.from(part.body.data, "base64").toString("utf-8");
        } else if (part.parts && Array.isArray(part.parts)) {
          for (const p of part.parts) walkParts(p);
        } else if (part.mimeType === "text/html" && part.body?.data && !body) {
          body += Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }
      walkParts(payload);

      const snippetText = msg.data.snippet || snippet(body || "");

      out.push({
        gmailId: m.id!,
        threadId: m.threadId ?? undefined,
        snippet: snippetText,
        body,
        from,
        to,
        subject,
        date,
      });
    } catch (err) {
      logger.error("❌ Failed to fetch message", m.id, err);
    }
  }

  return out;
}

export async function sendMessage(
  tokens: any,
  to: string,
  subject: string,
  bodyText: string,
  inReplyToMessageId?: string
) {
  const auth = createOAuth2Client(tokens);
  const gmail = google.gmail({ version: "v1", auth });

  let str = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    ``,
    bodyText,
  ].join("\r\n");

  if (inReplyToMessageId) {
    str = `In-Reply-To: ${inReplyToMessageId}\r\n${str}`;
  }

  const raw = Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return res.data;
}

// 👇 Alias so you can still import getGmailEmails
export { fetchUnreadMessages as getGmailEmails };
