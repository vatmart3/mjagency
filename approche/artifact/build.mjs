/**
 * Construit APPROCHE en une seule page HTML autonome (artefact claude.ai, Safari…).
 *   npm run build:artifact  →  artifact/dist/approche.html
 * Mode démo forcé : pas de Supabase, pas d'API, données dans le navigateur.
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "artifact/dist");
mkdirSync(dist, { recursive: true });

const shims = {
  "next/link": "artifact/shims/next-link.tsx",
  "next/navigation": "artifact/shims/next-navigation.ts",
  "next/dynamic": "artifact/shims/next-dynamic.tsx",
  "@supabase/ssr": "artifact/shims/supabase-stub.ts",
};

const result = await build({
  entryPoints: [resolve(root, "artifact/main.tsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["safari15", "chrome100"],
  minify: true,
  jsx: "automatic",
  legalComments: "none",
  write: false,
  logLevel: "warning",
  tsconfig: resolve(root, "tsconfig.json"),
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_SUPABASE_URL": '""',
    "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": '""',
    "process.env.NEXT_PUBLIC_TARGET": '"artifact"',
  },
  plugins: [
    {
      name: "shims",
      setup(b) {
        const filter = new RegExp(`^(${Object.keys(shims).map((k) => k.replace(/[/.]/g, "\\$&")).join("|")})$`);
        b.onResolve({ filter }, (a) => ({ path: resolve(root, shims[a.path]) }));
      },
    },
  ],
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

execFileSync(resolve(root, "node_modules/.bin/tailwindcss"), ["-i", "app/globals.css", "-o", "artifact/dist/app.css", "--minify"], { cwd: root, stdio: "inherit" });
const css = readFileSync(resolve(dist, "app.css"), "utf8");

const html = `<title>APPROCHE</title>
<meta name="description" content="L'outil de prospection de MJAGENCY — version de démonstration.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<style>:root{--font-geist-sans:"Geist";--font-geist-mono:"Geist Mono"}${css}</style>
<div id="approche"></div>
<script>${js}</script>
`;
const out = resolve(dist, "approche.html");
writeFileSync(out, html);
console.log(`artifact/dist/approche.html — ${(statSync(out).size / 1024 / 1024).toFixed(2)} Mo`);
