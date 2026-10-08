// Jeu d'icônes au trait, dessinées sur une grille de 24, épaisseur 1.75.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { taille?: number };

function Base({ taille = 20, children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

export const IconeCopier = (p: P) => (
  <Base {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2.5" />
    <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
  </Base>
);
export const IconeCoche = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);
export const IconeAppareil = (p: P) => (
  <Base {...p}>
    <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.3l1.4-2h5.6l1.4 2h1.3A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
    <circle cx="12" cy="12.5" r="3.5" />
  </Base>
);
export const IconeGalerie = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9.5" cy="9.5" r="1.5" />
    <path d="m20 15-4.5-4.5L7 19" />
  </Base>
);
export const IconePlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const IconeCroix = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const IconeCorbeille = (p: P) => (
  <Base {...p}>
    <path d="M5 7h14M10 4h4M7 7l.8 11.2A2 2 0 0 0 9.8 20h4.4a2 2 0 0 0 2-1.8L17 7" />
  </Base>
);
export const IconeRelancer = (p: P) => (
  <Base {...p}>
    <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4.5V8h-3.5" />
  </Base>
);
export const IconeChevron = (p: P) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);
export const IconeGauche = (p: P) => (
  <Base {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </Base>
);
export const IconeDroite = (p: P) => (
  <Base {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Base>
);
export const IconePoignee = (p: P) => (
  <Base {...p} strokeWidth={2.4}>
    <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" />
  </Base>
);
export const IconeEtincelle = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5c.6 4.4 2.1 5.9 6.5 6.5-4.4.6-5.9 2.1-6.5 6.5-.6-4.4-2.1-5.9-6.5-6.5 4.4-.6 5.9-2.1 6.5-6.5z" />
    <path d="M18.5 15.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5z" />
  </Base>
);
export const IconeHistorique = (p: P) => (
  <Base {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
    <path d="M4.5 4.5V9H9M12 8v4l2.5 2.5" />
  </Base>
);
export const IconeReglages = (p: P) => (
  <Base {...p}>
    <path d="M5 7h8M17 7h2M5 17h2M11 17h8" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </Base>
);
export const IconeCintre = (p: P) => (
  <Base {...p}>
    <path d="M12 9.5V8.3c0-.7.5-1.1 1-1.3a2 2 0 1 0-2.9-2" />
    <path d="M12 9.5 3.6 15.4c-.8.6-.4 1.6.5 1.6h15.8c.9 0 1.3-1 .5-1.6z" />
  </Base>
);
export const IconeAlerte = (p: P) => (
  <Base {...p}>
    <path d="M12 4 2.8 19.5h18.4z" />
    <path d="M12 10v4.5M12 17.2h.01" />
  </Base>
);
export const IconeEtoile = (p: P) => (
  <Base {...p}>
    <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1 5.2L12 15.8l-4.6 2.5 1-5.2-3.9-3.6 5.2-.6z" />
  </Base>
);
export const IconeSortie = (p: P) => (
  <Base {...p}>
    <path d="M14 5h3.5A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5H14M10 16l4-4-4-4M14 12H4" />
  </Base>
);
