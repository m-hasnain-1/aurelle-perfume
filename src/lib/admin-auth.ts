import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

export async function isAdmin() {
  const secret = process.env.ADMIN_ACCESS_CODE;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get("aurelle-admin")?.value;
  if (!token) return false;
  const tokenBuffer = Buffer.from(token);
  const secretBuffer = Buffer.from(secret);
  return tokenBuffer.length === secretBuffer.length && timingSafeEqual(tokenBuffer, secretBuffer);
}
