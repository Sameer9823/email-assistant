import { categorizeEmail } from "@/app/lib/ai";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { emailBody } = await req.json();

    const result = await categorizeEmail(emailBody);

    return NextResponse.json({ success: true, category: result.category, priority: result.priority });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
