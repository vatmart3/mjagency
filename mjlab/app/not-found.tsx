import Link from "next/link";

export default function NotFound() {
  return (
    <section data-theme="light" className="flex min-h-[100svh] flex-col items-start justify-center bg-creme gutter">
      <p className="mono text-noir/65">ERREUR 404 — EXPÉRIENCE INTROUVABLE</p>
      <h1 className="display-tight mt-6 text-[clamp(3rem,10vw,10rem)]">
        Cette page n&apos;a pas encore pris forme<span className="text-bordeaux">.</span>
      </h1>
      <Link href="/" className="mt-10 rounded-full bg-bordeaux px-6 py-3.5 font-medium text-blanc hover:bg-bordeaux-light">
        Retour au lab
      </Link>
    </section>
  );
}
