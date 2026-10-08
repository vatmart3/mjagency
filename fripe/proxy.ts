import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSION, jetonValide } from "./lib/auth.ts";

// Tout est fermé par défaut ; seuls la page de connexion et ce dont le
// navigateur a besoin pour installer la PWA restent publics.
const PUBLICS = new Set(["/login", "/api/login", "/manifest.webmanifest", "/sw.js", "/offline.html"]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLICS.has(pathname)) return NextResponse.next();

  if (await jetonValide(req.cookies.get(COOKIE_SESSION)?.value)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ erreur: "Session expirée. Reconnecte-toi.", code: "auth" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Les fichiers statiques de Next et les icônes ne passent pas par ici.
  matcher: ["/((?!_next/static|_next/image|icons/|favicon.ico|robots.txt).*)"],
};
