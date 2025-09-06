import { NextResponse } from "next/server";
import { Email } from "@/app/models/Email";
import { connectDB } from "@/app/lib/db";

export async function GET() {
  try {
    await connectDB();

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const emails = await Email.find({ createdAt: { $gte: last24h } });

    const sentimentStats = {
      positive: emails.filter(e => e.sentiment === "positive").length,
      negative: emails.filter(e => e.sentiment === "negative").length,
      neutral: emails.filter(e => e.sentiment === "neutral").length,
    };

    const priorityStats = {
      urgent: emails.filter(e => e.priority === "high").length,
      normal: emails.filter(e => e.priority === "low").length,
    };

    return NextResponse.json({
      success: true,
      stats: {
        total: emails.length,
        sentimentStats,
        priorityStats,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
