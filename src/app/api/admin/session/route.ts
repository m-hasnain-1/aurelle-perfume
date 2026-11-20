import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

const schema = z.object({ code: z.string().min(1).max(200) });

function matchesAccessCode(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  return inputBuffer.length === expectedBuffer.length && timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_ACCESS_CODE;
  if (!secret) return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success || !matchesAccessCode(parsed.data.code, secret)) return NextResponse.json({ error: "That access code is not valid." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set("aurelle-admin", secret, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete("aurelle-admin");
  return response;
}
