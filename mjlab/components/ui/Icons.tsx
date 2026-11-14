/* Icônes dessinées sur mesure — trait 1.6, terminaisons rondes,
   et le point de la marque dès que possible. */
type P = { className?: string; size?: number };

export function ArrowUpRight({ className = "", size = 18 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ className = "", size = 14 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M12 4v15M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeft({ className = "", size = 16 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Croix : deux traits et un point au centre */
export function Close({ className = "", size = 18 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Menu : deux traits inégaux + le point */
export function MenuIcon({ className = "", size = 22 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M3 8h14M3 15h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="19.5" cy="15" r="1.9" fill="var(--bordeaux)" />
    </svg>
  );
}

export function Check({ className = "", size = 18 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Puce : le point de la marque */
export function Dot({ className = "", size = 8 }: P) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill="currentColor" />
    </svg>
  );
}

export function Phone({ className = "", size = 16 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
      <rect x="7" y="2.5" width="10" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" />
    </svg>
  );
}
