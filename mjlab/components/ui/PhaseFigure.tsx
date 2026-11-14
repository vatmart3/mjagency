/* Illustrations du protocole — SVG animés sur mesure, dans l'esprit du logo :
   traits fins noirs, un seul élément bordeaux (le point). */
type Kind = "observe" | "design" | "launch" | "grow";

export default function PhaseFigure({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={`phase-fig ${className}`} aria-hidden="true" fill="none">
      <style>{`
        .phase-fig .ln{stroke:var(--noir);stroke-width:1.2;stroke-linecap:round}
        .phase-fig .lt{stroke:var(--noir);stroke-opacity:.22;stroke-width:1}
        .phase-fig .pt{fill:var(--bordeaux)}
        @keyframes pf-scan{0%,100%{transform:translate(-18px,-6px)}50%{transform:translate(18px,6px)}}
        @keyframes pf-draw{0%{stroke-dashoffset:190}55%,100%{stroke-dashoffset:0}}
        @keyframes pf-fly{0%{offset-distance:0%}70%,100%{offset-distance:100%}}
        @keyframes pf-ring{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.6);opacity:0}}
        @keyframes pf-bar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
        .phase-fig .scan{animation:pf-scan 4.5s cubic-bezier(.22,1,.36,1) infinite}
        .phase-fig .draw{stroke-dasharray:190;animation:pf-draw 4s cubic-bezier(.22,1,.36,1) infinite alternate}
        .phase-fig .fly{offset-path:path('M20 96 Q 80 -10 140 70');animation:pf-fly 3.2s cubic-bezier(.22,1,.36,1) infinite}
        .phase-fig .ring{transform-box:fill-box;transform-origin:center;animation:pf-ring 3s cubic-bezier(.22,1,.36,1) infinite}
        .phase-fig .bar{transform-box:fill-box;transform-origin:bottom;animation:pf-bar 3.4s cubic-bezier(.22,1,.36,1) infinite}
      `}</style>
      {kind === "observe" && (
        <g>
          <circle cx="80" cy="60" r="44" className="lt" />
          <circle cx="80" cy="60" r="28" className="ln" />
          <path d="M80 8v16M80 96v16M28 60h16M116 60h16" className="ln" />
          <g className="scan">
            <circle cx="80" cy="60" r="10" className="ln" />
            <circle cx="80" cy="60" r="3.6" className="pt" />
          </g>
        </g>
      )}
      {kind === "design" && (
        <g>
          {[30, 50, 70, 90, 110, 130].map((x) => (
            <path key={x} d={`M${x} 14v92`} className="lt" />
          ))}
          {[24, 44, 64, 84, 104].map((y) => (
            <path key={y} d={`M20 ${y}h120`} className="lt" />
          ))}
          <path d="M34 30 A46 46 0 0 0 126 30" className="ln draw" strokeWidth="9" stroke="var(--noir)" strokeOpacity=".9" />
          <circle cx="126" cy="30" r="4" className="pt" />
          <text x="22" y="114" fontFamily="var(--font-geist-mono)" fontSize="7" fill="var(--noir)" opacity=".6">R = 46</text>
        </g>
      )}
      {kind === "launch" && (
        <g>
          <path d="M20 96 Q 80 -10 140 70" className="ln" strokeDasharray="2 4" />
          <path d="M14 104h132" className="ln" />
          <path d="M14 104l6-8 6 8" className="ln" />
          <circle r="5" className="pt fly" />
          <path d="M136 66l8 8M144 66l-8 8" className="ln" />
        </g>
      )}
      {kind === "grow" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={26 + i * 20} y={46} width="10" height="56" rx="2" fill="var(--noir)" opacity={0.15 + i * 0.12} className="bar" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
          <path d="M14 104h132" className="ln" />
          <circle cx="126" cy="44" r="16" className="ln ring" />
          <circle cx="126" cy="44" r="16" className="ln ring" style={{ animationDelay: "1.5s" }} />
          <circle cx="126" cy="44" r="4.5" className="pt" />
        </g>
      )}
    </svg>
  );
}
