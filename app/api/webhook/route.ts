import { connectDB } from "@/app/lib/db";
import { Email } from "@/app/models/Email";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();

    // Example: Store webhook data
    const email = new Email(payload);
    await email.save();

    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
