/** L'arche dessinée en SVG, le segment i/N mis en avant (mobile, repli, puces). */
export default function SegmentGlyph({
  index,
  count,
  className = "",
  dark = false,
}: {
  index: number;
  count: number;
  className?: string;
  dark?: boolean;
}) {
  const R = 80, r = 20;
  const gap = 0.05;
  const arc = (i: number) => {
    const a0 = Math.PI + (i * Math.PI) / count + gap / 2;
    const a1 = Math.PI + ((i + 1) * Math.PI) / count - gap / 2;
    const p = (a: number, rad: number) => `${(100 + Math.cos(a) * rad).toFixed(2)} ${(10 - Math.sin(a) * rad).toFixed(2)}`;
    return `M ${p(a0, R + r)} A ${R + r} ${R + r} 0 0 0 ${p(a1, R + r)} L ${p(a1, R - r)} A ${R - r} ${R - r} 0 0 1 ${p(a0, R - r)} Z`;
  };
  return (
    <svg viewBox="0 0 200 116" className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={arc(i)}
          fill={i === index ? "var(--bordeaux)" : "none"}
          stroke={i === index ? "var(--bordeaux-light)" : dark ? "rgba(245,240,233,.25)" : "rgba(37,35,38,.25)"}
          strokeWidth="1"
          strokeLinejoin="round"
          transform={i === index ? `translate(${(Math.cos(Math.PI + ((i + 0.5) * Math.PI) / count) * 8).toFixed(2)} ${(-Math.sin(Math.PI + ((i + 0.5) * Math.PI) / count) * 8).toFixed(2)})` : undefined}
        />
      ))}
    </svg>
  );
}
