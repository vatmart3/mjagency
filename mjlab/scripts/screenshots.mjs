// Captures desktop (1440) et mobile (390) de chaque section.
// Usage : npm run build && npm start (port 3000) puis `node scripts/screenshots.mjs [filtre]`
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Playwright préinstallé globalement ou en devDependency
const { chromium } = require("playwright");
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.env.OUT || "screenshots";
const only = process.argv[2];
mkdirSync(OUT, { recursive: true });

const sections = ["top", "manifeste", "activites", "methode", "chiffres", "duo", "projets", "contact", "footer"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const vp of viewports) {
  if (only && !vp.name.startsWith(only) && !sections.includes(only)) continue;
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => localStorage.setItem("mjlab-visited", "1"));
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && console.log(`[${vp.name}] console:`, m.text()));
  page.on("pageerror", (e) => console.log(`[${vp.name}] pageerror:`, e.message));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  for (const id of sections) {
    if (only && sections.includes(only) && id !== only) continue;
    const ok = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      return true;
    }, id);
    if (!ok) continue;
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
  }
  await ctx.close();
}
await browser.close();
console.log("ok");
