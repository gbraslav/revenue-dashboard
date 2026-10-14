import { cookies } from "next/headers";
import { SITE_ACCESS_COOKIE } from "@/lib/auth";

export async function POST() {
  (await cookies()).delete(SITE_ACCESS_COOKIE);
  return Response.json({ ok: true });
}
