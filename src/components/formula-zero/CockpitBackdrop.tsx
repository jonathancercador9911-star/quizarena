/**
 * Escena de fondo del HUD de cabina: grada y trazado desenfocados de fondo,
 * más el morro, los espejos y el parabrisas del monoplaza en primer plano.
 * Trasladado de la hoja "HUD de cabina" del diseño de Fórmula Zero.
 */
export function CockpitBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1920 1080"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "blur(4px)" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="0" y="0" width="1920" height="1080" fill="#07090b" />
        <rect x="0" y="400" width="1920" height="60" fill="#0b1114" />
        <path d="M0 452L260 430L420 438L640 420L800 436L1300 428L1520 414L1700 432L1920 424L1920 456L0 456Z" fill="#0a0f12" />
        <line x1="300" y1="190" x2="300" y2="450" stroke="#151c21" strokeWidth="6" />
        <line x1="620" y1="250" x2="620" y2="450" stroke="#151c21" strokeWidth="5" />
        <line x1="1500" y1="240" x2="1500" y2="450" stroke="#151c21" strokeWidth="5" />
        <line x1="1780" y1="180" x2="1780" y2="450" stroke="#151c21" strokeWidth="6" />
        <circle cx="300" cy="190" r="70" fill="#edf2f3" opacity="0.05" />
        <circle cx="300" cy="190" r="12" fill="#edf2f3" opacity="0.75" />
        <circle cx="620" cy="250" r="50" fill="#edf2f3" opacity="0.05" />
        <circle cx="620" cy="250" r="9" fill="#edf2f3" opacity="0.7" />
        <circle cx="1500" cy="240" r="50" fill="#edf2f3" opacity="0.05" />
        <circle cx="1500" cy="240" r="9" fill="#edf2f3" opacity="0.7" />
        <circle cx="1780" cy="180" r="70" fill="#edf2f3" opacity="0.05" />
        <circle cx="1780" cy="180" r="12" fill="#edf2f3" opacity="0.75" />
        <rect x="884" y="340" width="10" height="112" fill="#11171b" />
        <rect x="1226" y="340" width="10" height="112" fill="#11171b" />
        <rect x="864" y="334" width="392" height="38" fill="#0d1215" stroke="#1d252b" />
        <text x="1060" y="361" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="22" letterSpacing="1" fill="#c6ff3d">FÓRMULA ZERO</text>
        <path d="M-260 1080C460 780 900 540 1050 446L1150 446C1220 520 1600 780 2300 1080Z" fill="#0c1013" />
        <path d="M300 1080C760 780 1010 560 1100 446" fill="none" stroke="#090c0e" strokeWidth="140" />
        <path d="M-260 1080C460 780 900 540 1050 446" fill="none" stroke="#c6ff3d" strokeWidth="14" strokeDasharray="40 30" />
        <path d="M-230 1080C470 790 905 545 1052 448" fill="none" stroke="#edf2f3" strokeWidth="3" opacity="0.45" />
        <path d="M2300 1080C1600 780 1220 520 1150 446" fill="none" stroke="#c6ff3d" strokeWidth="14" strokeDasharray="40 30" />
        <path d="M2270 1080C1590 790 1215 525 1148 448" fill="none" stroke="#edf2f3" strokeWidth="3" opacity="0.45" />
        <path d="M-400 1000C300 760 760 560 1000 452" fill="none" stroke="#1a2228" strokeWidth="10" />
        <path d="M2400 1000C1700 760 1340 560 1200 452" fill="none" stroke="#1a2228" strokeWidth="10" />
        <circle cx="1100" cy="452" r="5" fill="#ff4d63" opacity="0.8" />
        <circle cx="1124" cy="452" r="5" fill="#ff4d63" opacity="0.6" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 52% 42%, rgba(7,9,11,0) 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <svg
        viewBox="0 0 1920 1080"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="-60" y="560" width="340" height="320" rx="90" fill="#040506" stroke="#161c20" strokeWidth="2" />
        <path d="M262 600Q282 720 262 840" fill="none" stroke="#c6ff3d" strokeWidth="3" />
        <rect x="1640" y="560" width="340" height="320" rx="90" fill="#040506" stroke="#161c20" strokeWidth="2" />
        <path d="M1658 600Q1638 720 1658 840" fill="none" stroke="#c6ff3d" strokeWidth="3" />
        <path d="M846 790L936 498L984 498L1074 790Z" fill="#0b0f12" stroke="#1d252b" />
        <line x1="884" y1="790" x2="950" y2="498" stroke="#c6ff3d" strokeWidth="3" />
        <line x1="1036" y1="790" x2="970" y2="498" stroke="#c6ff3d" strokeWidth="3" />
        <path d="M0 1080L0 820Q280 756 600 770L1320 770Q1640 756 1920 820L1920 1080Z" fill="#05070a" />
        <path d="M0 820Q280 756 600 770L1320 770Q1640 756 1920 820" fill="none" stroke="#1d262c" strokeWidth="3" />
        <path d="M944 92L976 92L990 780L930 780Z" fill="#0a0e11" />
        <line x1="944" y1="92" x2="931" y2="780" stroke="#1d262c" strokeWidth="2" />
        <path d="M0 0L1920 0L1920 64Q960 160 0 64Z" fill="#0a0e11" />
        <path d="M0 64Q960 160 1920 64" fill="none" stroke="#1d262c" strokeWidth="3" />
        <rect x="456" y="736" width="156" height="400" rx="64" fill="#050607" stroke="#151b1f" />
        <rect x="1308" y="736" width="156" height="400" rx="64" fill="#050607" stroke="#151b1f" />
        <path d="M610 770Q610 712 670 712L1250 712Q1310 712 1310 770L1330 930Q1340 990 1390 1030L1390 1080L530 1080L530 1030Q580 990 590 930Z" fill="#0b0f12" stroke="#232c33" strokeWidth="2" />
        <path d="M640 734L1280 734" stroke="#161d22" strokeWidth="22" strokeLinecap="round" />
      </svg>
    </div>
  );
}
