import { connectDB } from "@/app/lib/db";
import { getGmailEmails } from "@/app/lib/gmail";
import { Email } from "@/app/models/Email";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();

    const tokens = {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    };

    const emails = await getGmailEmails(tokens);

    await Email.insertMany(emails, { ordered: false }).catch(() => {});

    return NextResponse.json({ success: true, data: emails });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
