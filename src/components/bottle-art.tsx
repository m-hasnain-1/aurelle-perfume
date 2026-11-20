import { useId } from "react";

export function BottleArt({
  tone = "amber",
  className = "",
}: {
  tone?: string;
  className?: string;
}) {
  const key = useId().replace(/:/g, "");
  return (
    <div className={`product-art ${tone} ${className}`} role="img" aria-label="Illustration of an AURELLE fragrance bottle">
      <svg className="bottle-svg" viewBox="0 0 180 260" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${key}-glass`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f4e5c4" stopOpacity=".22" />
            <stop offset=".5" stopColor="#c8b07c" stopOpacity=".08" />
            <stop offset="1" stopColor="#f8e9c8" stopOpacity=".26" />
          </linearGradient>
          <linearGradient id={`${key}-liquid`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d2ae6c" stopOpacity=".38" />
            <stop offset="1" stopColor="#8c6430" stopOpacity=".82" />
          </linearGradient>
          <linearGradient id={`${key}-cap`} x1="0" x2="1">
            <stop stopColor="#8f7547" />
            <stop offset=".45" stopColor="#d2bc8d" />
            <stop offset="1" stopColor="#806941" />
          </linearGradient>
        </defs>
        <ellipse cx="90" cy="241" rx="51" ry="7" fill="#000" opacity=".27" />
        <rect x="76" y="23" width="28" height="37" rx="2" fill={`url(#${key}-cap)`} stroke="#d9c99f" strokeOpacity=".45" />
        <rect x="82" y="54" width="16" height="11" fill="#a88d5b" />
        <path className="bottle-glass" style={{ fill: `url(#${key}-glass)` }} d="M56 65 Q56 61 62 61 H118 Q124 61 124 67 V78 Q143 90 143 109 V218 Q143 232 129 232 H51 Q37 232 37 218 V109 Q37 89 56 78 Z" />
        <path className="bottle-liquid" style={{ fill: `url(#${key}-liquid)` }} d="M42 145 H138 V217 Q138 227 128 227 H52 Q42 227 42 217 Z" />
        <path d="M51 88 V212" stroke="#fff5da" strokeOpacity=".23" strokeWidth="2" />
        <path d="M129 96 V211" stroke="#f8e9c8" strokeOpacity=".12" strokeWidth="1" />
        <rect x="53" y="139" width="74" height="54" fill="#e9ddc3" fillOpacity=".92" />
        <text x="90" y="158" textAnchor="middle" fill="#4a4132" fontSize="7" letterSpacing="2.2" fontFamily="Arial">AURELLE</text>
        <path d="M73 166 H107" stroke="#a48c60" strokeWidth=".6" />
        <text x="90" y="179" textAnchor="middle" fill="#514632" fontSize="8" letterSpacing="1.5" fontFamily="Georgia">PARFUM</text>
      </svg>
    </div>
  );
}
