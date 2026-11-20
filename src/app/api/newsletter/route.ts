import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email().max(254) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  try {
    await prisma.newsletterSubscriber.upsert({ where: { email: parsed.data.email.toLowerCase() }, create: { email: parsed.data.email.toLowerCase() }, update: {} });
    return NextResponse.json({ subscribed: true });
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return NextResponse.json({ error: "We couldn't save your subscription right now." }, { status: 503 });
  }
}
