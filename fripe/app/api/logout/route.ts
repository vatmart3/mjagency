import { NextResponse } from "next/server";
import { COOKIE_SESSION, origineAutorisee } from "@/lib/auth.ts";

export async function POST(req: Request) {
  if (!origineAutorisee(req)) {
    return NextResponse.json({ erreur: "Origine refusée." }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSION, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
