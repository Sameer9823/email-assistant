import { connectDB } from "@/app/lib/db";
import { Email } from "@/app/models/Email";
import { NextResponse } from "next/server";


interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const email = await Email.findById(params.id);
    if (!email) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: email });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
