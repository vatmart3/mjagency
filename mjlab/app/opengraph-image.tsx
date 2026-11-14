import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image OG aux couleurs de la charte : l'arche, le titre, le point. */
export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F5F0E9", padding: 64, position: "relative", fontFamily: "sans-serif" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8D3048" />
              <stop offset="1" stopColor="#641E32" />
            </linearGradient>
          </defs>
          <path d="M 520 -40 A 380 380 0 0 0 1280 -40 L 1130 -40 A 230 230 0 0 1 670 -40 Z" fill="url(#g)" />
        </svg>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "#252326", letterSpacing: -2 }}>
          MJ LAB<span style={{ color: "#641E32" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 800, color: "#252326", letterSpacing: -7, lineHeight: 0.92 }}>Des idées qui</div>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 800, color: "#252326", letterSpacing: -7, lineHeight: 0.92 }}>
            prennent forme<span style={{ color: "#641E32" }}>.</span>
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 22, color: "#252326", opacity: 0.7, letterSpacing: 2 }}>
            UNE VISION · PLUSIEURS POSSIBILITÉS — SÈTE · FRONTIGNAN
          </div>
        </div>
      </div>
    ),
    size
  );
}
