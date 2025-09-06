// models/Response.ts
// Mongoose schema for Response history (TypeScript)
import mongoose, { Document, Schema } from "mongoose";

export interface IResponse extends Document {
  emailId: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId | string | null;
  replyText: string;
  sentAt?: Date;
  edited?: boolean;
  source?: "auto" | "human";
}

const ResponseSchema = new Schema<IResponse>(
  {
    emailId: { type: Schema.Types.ObjectId, ref: "Email", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    replyText: { type: String, required: true },
    sentAt: { type: Date, default: () => new Date() },
    edited: { type: Boolean, default: false },
    source: { type: String, enum: ["auto", "human"], default: "auto" },
  },
  { timestamps: true }
);

export const Response = mongoose.models.Response || mongoose.model<IResponse>("Response", ResponseSchema);
