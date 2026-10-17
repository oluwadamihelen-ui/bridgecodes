/**
 * Illustrative software interfaces (NOT product screenshots). Built from SVG/CSS so
 * it is crisp at any size. Uses abstract shapes instead of numbers, so no metrics are implied.
 */
export function HeroVisual() {
  return (
    <figure className="hero-visual">
      <svg viewBox="0 0 640 460" role="img" aria-labelledby="hv-title hv-desc" className="hero-visual__svg">
        <title id="hv-title">Illustrative software interfaces</title>
        <desc id="hv-desc">
          A stylised business dashboard with charts, a workflow diagram and a mobile app screen. Illustration only.
        </desc>
        <defs>
          <linearGradient id="hv-line" x1="0" x2="1">
            <stop offset="0" stopColor="#356DF3" />
            <stop offset="1" stopColor="#7FA3FF" />
          </linearGradient>
          <linearGradient id="hv-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#356DF3" stopOpacity=".35" />
            <stop offset="1" stopColor="#356DF3" stopOpacity="0" />
          </linearGradient>
          <filter id="hv-shadow" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity=".35" />
          </filter>
        </defs>

        {/* Dashboard window */}
        <g filter="url(#hv-shadow)">
          <rect x="20" y="30" width="430" height="300" rx="14" fill="#fff" />
        </g>
        <path d="M20 44a14 14 0 0 1 14-14h402a14 14 0 0 1 14 14v22H20Z" fill="#F2F4F7" />
        <circle cx="40" cy="48" r="4.500" fill="#F97066" />
        <circle cx="55" cy="48" r="4.500" fill="#FDB022" />
        <circle cx="70" cy="48" r="4.500" fill="#32D583" />
        <rect x="130" y="41" width="190" height="14" rx="7" fill="#E4E7EC" />
        <rect x="20" y="66" width="86" height="264" fill="#F8FAFC" />
        <rect x="32" y="82" width="22" height="22" rx="6" fill="#356DF3" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="32" y={118 + i * 26} width={i === 0 ? 62 : 50 + ((i * 7) % 12)} height="9" rx="4.500" fill={i === 0 ? "#BFD1FF" : "#E4E7EC"} />
        ))}
        {/* KPI tiles */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={122 + i * 108} y="80" width="98" height="58" rx="9" fill="#fff" stroke="#E4E7EC" />
            <rect x={132 + i * 108} y="92" width="36" height="7" rx="3.500" fill="#D0D5DD" />
            <rect x={132 + i * 108} y="108" width="56" height="14" rx="5" fill={i === 0 ? "#356DF3" : "#1D2939"} opacity={i === 0 ? 1 : 0.85} />
          </g>
        ))}
        {/* Chart */}
        <rect x="122" y="150" width="218" height="164" rx="9" fill="#fff" stroke="#E4E7EC" />
        <rect x="134" y="162" width="64" height="8" rx="4" fill="#D0D5DD" />
        <path d="M134 290 L134 260 C160 250 170 226 196 232 S238 262 262 214 S310 200 328 188 L328 290 Z" fill="url(#hv-area)" />
        <path d="M134 260 C160 250 170 226 196 232 S238 262 262 214 S310 200 328 188" fill="none" stroke="url(#hv-line)" strokeWidth="3" strokeLinecap="round" />
        {[0, 1, 2].map((i) => <line key={i} x1="134" x2="328" y1={206 + i * 28} y2={206 + i * 28} stroke="#F2F4F7" />)}
        {/* Bar chart */}
        <rect x="350" y="150" width="90" height="164" rx="9" fill="#fff" stroke="#E4E7EC" />
        {[34, 62, 46, 84, 70].map((h, i) => (
          <rect key={i} x={360 + i * 16} y={300 - h} width="10" height={h} rx="3" fill={i === 3 ? "#356DF3" : "#BFD1FF"} />
        ))}

        {/* Workflow card */}
        <g filter="url(#hv-shadow)">
          <rect x="300" y="268" width="320" height="168" rx="14" fill="#101828" stroke="#344054" />
        </g>
        <rect x="320" y="286" width="70" height="8" rx="4" fill="#475467" />
        <g stroke="#475467" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M376 340h30" /><path d="M468 340h30" /><path d="M550 340h20" />
          <path d="M437 358v22M437 380h-40" />
        </g>
        <rect x="320" y="320" width="56" height="40" rx="9" fill="#1D2939" stroke="#475467" />
        <rect x="406" y="320" width="62" height="40" rx="9" fill="#356DF3" />
        <rect x="498" y="320" width="52" height="40" rx="9" fill="#1D2939" stroke="#475467" />
        <rect x="570" y="326" width="28" height="28" rx="14" fill="#12B76A" />
        <path d="m578 340 5 5 9-10" fill="none" stroke="#fff" strokeWidth="2.500" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="332" y="334" width="32" height="6" rx="3" fill="#667085" />
        <rect x="332" y="346" width="20" height="6" rx="3" fill="#475467" />
        <rect x="418" y="334" width="38" height="6" rx="3" fill="#fff" opacity=".9" />
        <rect x="418" y="346" width="24" height="6" rx="3" fill="#fff" opacity=".5" />
        <rect x="508" y="334" width="30" height="6" rx="3" fill="#667085" />
        <rect x="340" y="372" width="58" height="34" rx="9" fill="#1D2939" stroke="#475467" />
        <rect x="350" y="385" width="38" height="6" rx="3" fill="#667085" />
        <rect x="420" y="388" width="170" height="8" rx="4" fill="#344054" />
        <rect x="420" y="404" width="110" height="8" rx="4" fill="#344054" />

        {/* Mobile screen */}
        <g filter="url(#hv-shadow)">
          <rect x="478" y="56" width="132" height="236" rx="22" fill="#0B1220" stroke="#344054" strokeWidth="2" />
        </g>
        <rect x="528" y="64" width="32" height="6" rx="3" fill="#344054" />
        <rect x="492" y="86" width="104" height="52" rx="12" fill="#356DF3" />
        <rect x="502" y="98" width="46" height="7" rx="3.500" fill="#fff" opacity=".85" />
        <rect x="502" y="114" width="70" height="12" rx="5" fill="#fff" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="492" y={150 + i * 40} width="104" height="32" rx="9" fill="#1D2939" />
            <circle cx="508" cy={166 + i * 40} r="8" fill={i === 1 ? "#12B76A" : "#356DF3"} opacity=".9" />
            <rect x="524" y={158 + i * 40} width={52 - i * 6} height="6" rx="3" fill="#D0D5DD" />
            <rect x="524" y={170 + i * 40} width="34" height="5" rx="2.500" fill="#667085" />
          </g>
        ))}
      </svg>
      <figcaption className="hero-visual__caption">Illustrative interfaces — not screenshots of a released product.</figcaption>
    </figure>
  );
}
