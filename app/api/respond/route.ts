import { generateDraftReply } from "@/app/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { emailBody, sentiment } = await req.json();

    // Call the AI draft generator
    const draft = await generateDraftReply({
      body: emailBody,
    });

    return NextResponse.json({ success: true, draft });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
