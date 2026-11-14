/* Repli statique : WebGL absent ou « moins d'animations ». Même silhouette
   que l'arche 3D — demi-anneau épais, dégradé bordeaux. */
export default function ArchFallback({
  className = "",
  style,
  variant = "arch",
}: {
  className?: string;
  style?: React.CSSProperties;
  variant?: "arch" | "ring" | "segment";
}) {
  const id = `arch-grad-${variant}`;
  const ro = 500;
  const ri = 297; // (R - r) / (R + r)
  return (
    <svg
      viewBox={variant === "ring" ? "-520 -520 1040 1040" : variant === "segment" ? "-260 330 520 200" : "-520 -10 1040 560"}
      className={className}
      style={style}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8D3048" />
          <stop offset="0.55" stopColor="#641E32" />
          <stop offset="1" stopColor="#4f1727" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="0.3" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#F5F0E9" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#F5F0E9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#252326" stopOpacity="0.28" />
          <stop offset="1" stopColor="#252326" stopOpacity="0" />
        </radialGradient>
      </defs>
      {variant === "ring" ? (
        <>
          <path
            fillRule="evenodd"
            d={`M ${-ro} 0 A ${ro} ${ro} 0 1 0 ${ro} 0 A ${ro} ${ro} 0 1 0 ${-ro} 0 Z M ${-ri} 0 A ${ri} ${ri} 0 1 1 ${ri} 0 A ${ri} ${ri} 0 1 1 ${-ri} 0 Z`}
            fill={`url(#${id})`}
          />
          <circle r="120" fill="#8D3048" />
        </>
      ) : (
        <>
          <ellipse cx="0" cy={ro + 6} rx={ro * 0.9} ry="22" fill={`url(#${id}-shadow)`} />
          <path
            d={`M ${-ro} 0 A ${ro} ${ro} 0 0 0 ${ro} 0 L ${ri} 0 A ${ri} ${ri} 0 0 1 ${-ri} 0 Z`}
            fill={`url(#${id})`}
          />
          <path
            d={`M ${-ro} 0 A ${ro} ${ro} 0 0 0 ${ro} 0 L ${ri} 0 A ${ri} ${ri} 0 0 1 ${-ri} 0 Z`}
            fill={`url(#${id}-sheen)`}
          />
        </>
      )}
    </svg>
  );
}
