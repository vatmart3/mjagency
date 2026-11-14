import type { Activity } from "@/content/site";

/* Visuels de remplacement, dessinés dans la charte, en attendant les
   vraies images (voir README › Remplacer les placeholders). */
export default function Mockup({ kind, label, className = "" }: { kind: Activity["mockup"]; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-creme text-noir ${className}`} role="img" aria-label={`Visuel provisoire — ${label}`}>
      {kind === "browser" && <Browser label={label} />}
      {kind === "shop" && <Shop />}
      {kind === "box" && <Box />}
      {kind === "app" && <App />}
      {kind === "live" && <Live />}
      <span className="mono absolute bottom-2.5 right-3 text-[9px] text-noir/45">VISUEL PROVISOIRE</span>
    </div>
  );
}

function Chrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-beige px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-beige" />
      <span className="h-2 w-2 rounded-full bg-beige" />
      <span className="h-2 w-2 rounded-full bg-bordeaux" />
      <span className="ml-3 h-3 flex-1 rounded-full bg-beige/50" />
    </div>
  );
}

function Browser({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col">
      <Chrome />
      <div className="grid flex-1 grid-cols-5 gap-3 p-4">
        <div className="col-span-3 flex flex-col justify-end gap-2">
          <span className="font-display text-[1.6em] font-extrabold leading-[0.9] tracking-[-0.05em]">
            {label.split(" ")[0]}
            <span className="text-bordeaux">.</span>
          </span>
          <span className="h-1.5 w-4/5 rounded bg-noir/15" />
          <span className="h-1.5 w-3/5 rounded bg-noir/15" />
          <span className="mt-2 h-5 w-20 rounded-full bg-bordeaux" />
        </div>
        <div className="col-span-2 rounded-xl bg-beige" />
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div className="flex h-full flex-col">
      <Chrome />
      <div className="grid flex-1 grid-cols-3 gap-2.5 p-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className={`flex-1 rounded-lg ${i === 1 ? "bg-bordeaux" : "bg-beige"}`} />
            <span className="h-1.5 w-3/4 rounded bg-noir/15" />
            <span className="mono text-[8px] text-noir/60">{["29 €", "49 €", "19 €", "39 €", "59 €", "24 €"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Box() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
      <rect width="200" height="140" fill="#F5F0E9" />
      <g transform="translate(100 74)">
        <path d="M-46 -12 0 -34 46 -12 0 10Z" fill="#D7C5B8" />
        <path d="M-46 -12 0 10 0 50 -46 28Z" fill="#8D3048" />
        <path d="M46 -12 0 10 0 50 46 28Z" fill="#641E32" />
        <path d="M-23 -23 23 -1" stroke="#F5F0E9" strokeWidth="5" />
      </g>
      <g fontFamily="var(--font-geist-mono)" fontSize="7" fill="#252326" opacity=".6">
        <text x="12" y="20">ACHAT 01</text>
        <text x="146" y="20">REVENTE</text>
      </g>
      <path d="M40 20 h96" stroke="#252326" strokeOpacity=".25" strokeDasharray="2 3" />
      <circle cx="140" cy="20" r="2.5" fill="#641E32" />
    </svg>
  );
}

function App() {
  return (
    <div className="flex h-full items-center justify-center gap-4 p-4">
      <div className="flex h-[88%] w-[34%] flex-col gap-1.5 rounded-[14px] border-[3px] border-noir bg-creme p-2">
        <span className="mx-auto h-1 w-6 rounded-full bg-noir/30" />
        <span className="mt-1 h-8 rounded-md bg-bordeaux" />
        <span className="h-1.5 w-4/5 rounded bg-noir/15" />
        <span className="h-1.5 w-3/5 rounded bg-noir/15" />
        <span className="mt-auto flex gap-1">
          <span className="h-4 flex-1 rounded bg-beige" />
          <span className="h-4 flex-1 rounded bg-beige" />
        </span>
      </div>
      <div className="flex w-[46%] flex-col gap-2">
        <span className="mono text-[8px] text-noir/60">AGENT-IA / RUN 042</span>
        <span className="rounded-lg rounded-bl-sm bg-beige px-2 py-1.5 text-[9px] leading-tight">Analyse des commandes du jour…</span>
        <span className="self-end rounded-lg rounded-br-sm bg-noir px-2 py-1.5 text-[9px] leading-tight text-creme">Résumé envoyé.</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bordeaux" />
          <span className="h-1.5 w-1.5 rounded-full bg-bordeaux/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-bordeaux/25" />
        </span>
      </div>
    </div>
  );
}

function Live() {
  return (
    <div className="relative h-full bg-noir">
      <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 95 C40 70 60 100 100 78 S160 60 200 72 V120 H0Z" fill="#641E32" opacity=".9" />
        <path d="M0 105 C50 90 80 112 120 96 S180 88 200 92 V120 H0Z" fill="#8D3048" opacity=".7" />
        <circle cx="150" cy="38" r="14" fill="#F5F0E9" opacity=".9" />
      </svg>
      <span className="mono absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-bordeaux px-2 py-0.5 text-[9px] text-blanc">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-creme" /> LIVE
      </span>
      <span className="mono absolute right-3 top-3 text-[9px] text-creme/70">TWITCH · TIKTOK</span>
      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
        <span className="w-fit rounded bg-creme/90 px-1.5 py-0.5 text-[8px]">gg !</span>
        <span className="w-fit rounded bg-creme/90 px-1.5 py-0.5 text-[8px]">un conseil pour lancer sa boutique ?</span>
      </div>
    </div>
  );
}
