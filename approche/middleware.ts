import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Protège toute l'app : sans session Supabase valide, retour à /login.
 * En mode démo (Supabase non configuré), tout passe : l'identité est
 * choisie localement sur l'écran de connexion. Ce mode reste réservé au
 * poste de développement : un déploiement Vercel sans Supabase ne s'ouvre pas.
 */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) {
    if (!process.env.VERCEL) return NextResponse.next();
    return new NextResponse("Accès fermé : la connexion Supabase n'est pas configurée sur ce déploiement.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = path.startsWith("/login") || path.startsWith("/api/");

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (user && path.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)"],
};
