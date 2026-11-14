import Link from "next/link";

type Props = { variant?: "mono" | "full"; className?: string; dark?: boolean; href?: string | null };

/** « MJ. » ou « MJ LAB. » — Poppins Bold, point final bordeaux. */
export function Wordmark({ variant = "mono", className = "", dark = false }: Omit<Props, "href">) {
  return (
    <span
      className={`font-display font-bold tracking-[-0.04em] leading-none ${dark ? "text-creme" : "text-noir"} ${className}`}
    >
      {variant === "mono" ? "MJ" : "MJ LAB"}
      <span className={dark ? "text-bordeaux-light" : "text-bordeaux"}>.</span>
    </span>
  );
}

export default function Logo({ variant = "mono", className = "", dark = false, href = "/" }: Props) {
  const mark = <Wordmark variant={variant} className={className} dark={dark} />;
  if (href === null) return mark;
  return (
    <Link href={href} aria-label="MJ LAB — accueil" data-cursor="↗" className="inline-flex items-center">
      {mark}
    </Link>
  );
}
