import { site } from "@/content/site";

/** Badge circulaire : « MJ. » au centre, signature sur un textPath qui tourne. */
export default function Submark({
  size = 132,
  dark = false,
  className = "",
  text = site.submarkText,
}: {
  size?: number;
  dark?: boolean;
  className?: string;
  text?: string;
}) {
  const ink = dark ? "var(--creme)" : "var(--noir)";
  const dot = dark ? "var(--bordeaux-light)" : "var(--bordeaux)";
  const id = `submark-${dark ? "d" : "l"}`;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`MJ LAB — ${text.replace(/·/g, "").trim()}`}
    >
      <defs>
        <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
      </defs>
      <circle cx="100" cy="100" r="97" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="100" cy="100" r="52" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1" />
      <g className="spin-slow">
        <text
          fill={ink}
          style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13.2, letterSpacing: "0.18em" }}
        >
          <textPath href={`#${id}`} textLength="460" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      <text
        x="96"
        y="113"
        textAnchor="middle"
        fill={ink}
        style={{ fontFamily: "var(--font-poppins)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.04em" }}
      >
        MJ<tspan fill={dot}>.</tspan>
      </text>
    </svg>
  );
}
