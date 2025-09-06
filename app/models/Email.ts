import mongoose, { Schema, Document } from "mongoose";

export interface IEmail extends Document {
  gmailId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  snippet: string;
  date: string;
  threadId?: string;
  sentiment?: "positive" | "neutral" | "negative";
  priority?: "high" | "low";
}

const EmailSchema = new Schema<IEmail>(
  {
    gmailId: { type: String, required: true, unique: true },
    from: String,
    to: String,
    subject: String,
    body: String,
    snippet: String,
    date: String,
    threadId: String,
    sentiment: { type: String, enum: ["positive", "neutral", "negative"] },
    priority: { type: String, enum: ["high", "low"] },
  },
  { timestamps: true }
);

export const Email =
  mongoose.models.Email || mongoose.model<IEmail>("Email", EmailSchema);
