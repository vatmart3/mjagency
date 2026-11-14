/** Repères Geist Mono en coin de section : numéro, titre, code. */
export default function SectionMarker({
  index,
  label,
  right,
  dark = false,
  className = "",
}: {
  index: string;
  label: string;
  right?: string;
  dark?: boolean;
  className?: string;
}) {
  const tone = dark ? "text-creme/60" : "text-noir/65";
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <span className={`mono flex items-center gap-2 ${tone}`}>
        <span className={`${dark ? "text-bordeaux-light" : "text-bordeaux"}`} aria-hidden="true">●</span>
        {index} — {label}
      </span>
      {right && <span className={`mono hidden text-right sm:inline ${tone}`}>{right}</span>}
    </div>
  );
}
