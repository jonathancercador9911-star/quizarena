interface CarLiverySideProps {
  className?: string;
}

/** Monoplaza FZ-0, vista lateral — trasladado de la hoja de librea del diseño. */
export function CarLiverySide({ className }: CarLiverySideProps) {
  return (
    <svg
      viewBox="0 0 1300 380"
      role="img"
      aria-label="Monoplaza Fórmula Zero en vista lateral"
      className={className}
    >
      <ellipse cx="650" cy="334" rx="580" ry="9" fill="#000" />
      <line x1="40" y1="334" x2="1260" y2="334" stroke="#141a1e" strokeWidth="1" />
      <path d="M118 236L210 232L210 246L118 250Z" fill="#0d1215" stroke="#232c33" />
      <path d="M105 86L152 86L168 282L122 292Z" fill="#0d1215" stroke="#232c33" />
      <path d="M96 90L212 82L212 104L96 114Z" fill="#0f1418" stroke="#232c33" />
      <line x1="96" y1="90" x2="212" y2="82" stroke="#c6ff3d" strokeWidth="3" />
      <text x="137" y="200" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="38" fill="#c6ff3d">0</text>
      <path d="M466 132L240 210L392 198Z" fill="#0b0f12" stroke="#1f272d" />
      <line x1="340" y1="246" x2="270" y2="262" stroke="#2a343b" strokeWidth="3" />
      <line x1="340" y1="270" x2="270" y2="262" stroke="#2a343b" strokeWidth="3" />
      <line x1="900" y1="238" x2="990" y2="266" stroke="#2a343b" strokeWidth="3" />
      <line x1="900" y1="264" x2="990" y2="266" stroke="#2a343b" strokeWidth="3" />
      <path d="M170 298L1100 292L1100 302L170 308Z" fill="#05070a" stroke="#1a2126" />
      <path
        d="M150 292L160 240Q170 214 210 210L380 196Q430 160 470 128L520 120Q545 120 560 140L600 176L700 184Q760 190 820 206L1120 252Q1152 258 1140 274L1060 282L880 286L720 288L170 296Z"
        fill="#0d1215"
        stroke="#232c33"
        strokeWidth="1.5"
      />
      <path d="M215 214L380 200Q430 164 470 134L520 126" fill="none" stroke="#1d252b" strokeWidth="2" />
      <path d="M300 214L318 212L296 238L278 240Z" fill="#c6ff3d" />
      <path d="M328 211L346 209L324 235L306 237Z" fill="#c6ff3d" />
      <path d="M356 208L374 206L352 232L334 234Z" fill="#c6ff3d" />
      <path d="M440 286L450 236Q455 222 470 220L700 214Q730 214 736 236L740 286Z" fill="#10161a" stroke="#252f36" strokeWidth="1.5" />
      <path d="M708 220L734 222L738 252L710 252Z" fill="#020304" />
      <path d="M186 254L450 250L736 246L1112 262" fill="none" stroke="#c6ff3d" strokeWidth="5" />
      <path d="M206 266L450 262L736 258L1062 274" fill="none" stroke="#c6ff3d" strokeWidth="2" />
      <rect x="546" y="221" width="64" height="62" fill="#10161a" />
      <text x="578" y="276" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="66" fill="#c6ff3d">0</text>
      <rect x="1040" y="246" width="34" height="34" fill="#0d1215" />
      <text x="1057" y="276" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="36" fill="#c6ff3d">0</text>
      <path d="M600 176Q640 166 700 184L700 190L600 182Z" fill="#020304" />
      <circle cx="642" cy="164" r="20" fill="#11171b" stroke="#2a343b" strokeWidth="1.5" />
      <path d="M648 156Q664 158 662 170L648 168Z" fill="#c6ff3d" />
      <path d="M588 154Q650 126 722 174" fill="none" stroke="#1a2228" strokeWidth="8" strokeLinecap="round" />
      <line x1="720" y1="172" x2="728" y2="194" stroke="#1a2228" strokeWidth="6" />
      <rect x="752" y="186" width="22" height="8" rx="2" fill="#0f1418" stroke="#2a343b" />
      <path d="M1036 296L1192 290L1196 304L1036 310Z" fill="#0f1418" stroke="#232c33" />
      <path d="M1168 260L1196 260L1202 306L1172 308Z" fill="#0d1215" stroke="#232c33" />
      <line x1="1036" y1="296" x2="1192" y2="290" stroke="#c6ff3d" strokeWidth="2" />
      <circle cx="270" cy="262" r="70" fill="#050607" stroke="#1b2227" strokeWidth="2" />
      <circle cx="270" cy="262" r="54" fill="none" stroke="#c6ff3d" strokeWidth="2" />
      <circle cx="270" cy="262" r="42" fill="#0e1317" stroke="#1f272d" />
      <circle cx="270" cy="262" r="9" fill="#2a343b" />
      <circle cx="990" cy="266" r="66" fill="#050607" stroke="#1b2227" strokeWidth="2" />
      <circle cx="990" cy="266" r="50" fill="none" stroke="#c6ff3d" strokeWidth="2" />
      <circle cx="990" cy="266" r="38" fill="#0e1317" stroke="#1f272d" />
      <circle cx="990" cy="266" r="9" fill="#2a343b" />
    </svg>
  );
}
