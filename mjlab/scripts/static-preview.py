#!/usr/bin/env python3
"""Aperçu statique de MJ LAB, publiable sur n'importe quel hébergeur de fichiers
(ex. page privée claude.ai) — sans serveur, donc sans /api/contact.

Usage : python3 scripts/static-preview.py <dossier_de_sortie>
Produit <sortie>/index.html (page d'entrée) et <sortie>/site/… (le site).
"""
import os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "preview-out"))
PREFIX = "https://mjlab-asset-prefix.invalid"
CONFIG = """import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  distDir: ".next-export",
  images: { unoptimized: true },
  assetPrefix: "%s",
};
export default nextConfig;
""" % PREFIX

cfg = os.path.join(ROOT, "next.config.ts")
api = os.path.join(ROOT, "app", "api")
api_bak = os.path.join(ROOT, ".api-preview-bak")
original = open(cfg).read()
shutil.move(api, api_bak)  # les route handlers ne s'exportent pas
try:
    open(cfg, "w").write(CONFIG)
    env = dict(os.environ, NEXT_PUBLIC_STATIC_PREVIEW="1")
    subprocess.run(["npx", "next", "build"], cwd=ROOT, env=env, check=True)
finally:
    open(cfg, "w").write(original)
    shutil.move(api_bak, api)

site = os.path.join(OUT, "site")
shutil.rmtree(OUT, ignore_errors=True)
shutil.move(os.path.join(ROOT, ".next-export"), site)

# ménage : données RSC (pas de navigation client), pages techniques
for dp, dn, fn in os.walk(site):
    for f in fn:
        if f.endswith(".txt") and f != "robots.txt":
            os.remove(os.path.join(dp, f))
for extra in ["_not-found", "_not-found.html", "404.html", "opengraph-image"]:
    p = os.path.join(site, extra)
    shutil.rmtree(p, ignore_errors=True) if os.path.isdir(p) else (os.path.exists(p) and os.remove(p))

for dp, dn, fn in os.walk(site):
    rel_dir = os.path.relpath(dp, site)
    depth = 0 if rel_dir == "." else len(rel_dir.split(os.sep))
    rel = "../" * depth or "./"
    asset = "." if depth == 0 else "/".join([".."] * depth)
    for f in fn:
        path = os.path.join(dp, f)
        if f.endswith(".html"):
            s = open(path, encoding="utf8").read()
            s = s.replace(PREFIX + "/", rel)
            s = re.sub(r'(["\'(]|\\")/(portraits|icon\.svg)', lambda m: m.group(1) + rel + m.group(2), s)
            inj = '<script>self.__MJ_ROOT=new URL("%s",location.href).href;self.__MJ_ASSET="%s";</script>' % (rel, asset)
            s = s.replace("<head>", "<head>" + inj, 1)
            open(path, "w", encoding="utf8").write(s)
        elif f.endswith(".js"):
            s = open(path, encoding="utf8").read()
            if "\ufffd" in s:  # caractère de remplacement littéral → séquence d'échappement équivalente
                s = s.replace("\ufffd", "\\uFFFD")
                open(path, "w", encoding="utf8").write(s)
            if PREFIX in s:
                # la base des chunks doit être identique aux src des <script> de la page
                s = re.sub(r'"' + re.escape(PREFIX) + r'([^"]*)"', r'(self.__MJ_ASSET+"\1")', s)
                open(path, "w", encoding="utf8").write(s)
        elif f.endswith(".css"):
            s = open(path, encoding="utf8").read()
            if PREFIX in s:
                s = re.sub(re.escape(PREFIX) + r'(/[^)"\'\s]+)',
                           lambda m: os.path.relpath(os.path.join(site, m.group(1).lstrip("/")), dp).replace(os.sep, "/"), s)
                open(path, "w", encoding="utf8").write(s)

open(os.path.join(OUT, "index.html"), "w", encoding="utf8").write("""<title>MJ LAB</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  /* Page d'entrée : une seule identité claire, la charte MJ LAB. */
  :root { --creme: #F5F0E9; --noir: #252326; --bordeaux: #641E32; }
  html, body { height: 100%; }
  body { background: var(--creme); color: var(--noir); font-family: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif; display: grid; place-items: center; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  .mark { margin: 0; font-weight: 700; font-size: clamp(3rem, 14vw, 7rem); letter-spacing: -0.05em; line-height: 1; text-align: center; }
  .mark span { color: var(--bordeaux); }
  a { display: block; margin-top: 24px; text-align: center; color: var(--noir); font: 500 15px/1.4 system-ui, sans-serif; }
  a:focus-visible { outline: 2px solid var(--bordeaux); outline-offset: 4px; }
</style>
<main>
  <p class="mark">MJ<span>.</span></p>
  <a href="site/index.html" id="ouvrir">Ouvrir le site MJ LAB</a>
</main>
<script>location.replace("site/index.html" + (location.hash || ""));</script>
""")
print("Aperçu prêt :", OUT)
