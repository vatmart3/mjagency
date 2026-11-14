/* Visuels provisoires des projets : compositions dans la charte, toutes
   différentes, en attendant les vraies photos. */
export default function ProjectArt({ seed, title, category }: { seed: number; title: string; category: string }) {
  const v = seed % 4;
  const bg = ["#D7C5B8", "#252326", "#641E32", "#D7C5B8"][v];
  const ink = v === 1 || v === 2 ? "#F5F0E9" : "#252326";
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="400" height="300" fill={bg} />
      {v === 0 && (
        <g>
          <path d="M60 40 A140 140 0 0 0 340 40 L290 40 A90 90 0 0 1 110 40Z" fill="#641E32" />
          <circle cx="200" cy="230" r="12" fill="#252326" />
        </g>
      )}
      {v === 1 && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${80 + i * 52} 230 a26 26 0 0 1 52 0`}
              fill="none"
              stroke={i === 2 ? "#8D3048" : "#F5F0E9"}
              strokeOpacity={i === 2 ? 1 : 0.25}
              strokeWidth="18"
            />
          ))}
        </g>
      )}
      {v === 2 && (
        <g>
          <circle cx="290" cy="130" r="92" fill="none" stroke="#8D3048" strokeWidth="46" />
          <circle cx="290" cy="130" r="14" fill="#F5F0E9" />
        </g>
      )}
      {v === 3 && (
        <g>
          <rect x="70" y="60" width="260" height="170" rx="14" fill="#F5F0E9" />
          <rect x="70" y="60" width="260" height="22" rx="11" fill="#252326" opacity=".12" />
          <rect x="92" y="110" width="120" height="16" rx="4" fill="#252326" />
          <rect x="92" y="136" width="90" height="8" rx="4" fill="#252326" opacity=".25" />
          <rect x="92" y="170" width="70" height="22" rx="11" fill="#641E32" />
          <rect x="236" y="104" width="76" height="106" rx="8" fill="#D7C5B8" />
        </g>
      )}
      <text x="30" y="36" fontFamily="var(--font-geist-mono)" fontSize="8" letterSpacing="1" fill={ink} opacity=".7">
        {category} · {String(seed + 1).padStart(3, "0")}
      </text>
      <text x="30" y="276" fontFamily="var(--font-geist-mono)" fontSize="7" letterSpacing="1" fill={ink} opacity=".55">
        {title.toUpperCase()} — VISUEL PROVISOIRE
      </text>
    </svg>
  );
}
