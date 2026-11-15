/**
 * Современная минималистичная библиотека векторных SVG-иконок
 * Все иконки выполнены в едином лаконичном стиле (2px stroke, скругленные сочленения)
 */

export function BrandShirtIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#eff6ff" stroke="#dbeafe" strokeWidth="1.5" />
      <path
        d="M33 13L39 17L36 24L32 22V35C32 36.1 31.1 37 30 37H18C16.9 37 16 36.1 16 35V22L12 24L9 17L15 13C17 16 20 17 24 17C28 17 31 16 33 13Z"
        fill="#ffffff"
        stroke="#1d62ed"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M20 13C21.2 15 22.5 15.8 24 15.8C25.5 15.8 26.8 15 28 13"
        stroke="#1d62ed"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FactoryIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d62ed"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 20h20" />
      <path d="M5 20V9l5 3V9l5 3V9l5 3v8" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
    </svg>
  );
}

export function ShirtBadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 3.5L20 6L18.5 10L16 9V19.5C16 20.1 15.6 20.5 15 20.5H9C8.4 20.5 8 20.1 8 19.5V9L5.5 10L4 6L7.5 3.5C9 5 10.5 5.5 12 5.5C13.5 5.5 15 5 16.5 3.5Z"
        stroke="#1d62ed"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#eff6ff"
      />
    </svg>
  );
}

export function MiniShirtIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 3.5L20 6L18.5 10L16 9V19.5C16 20.1 15.6 20.5 15 20.5H9C8.4 20.5 8 20.1 8 19.5V9L5.5 10L4 6L7.5 3.5C9 5 10.5 5.5 12 5.5C13.5 5.5 15 5 16.5 3.5Z" />
    </svg>
  );
}

export function ScissorsGreenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
      <path
        d="M8 12L11 15L16 9"
        stroke="#16a34a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FabricRollIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d62ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="6" cy="12" rx="3.5" ry="6.5" />
      <path d="M6 5.5C13 5.5 19 6.8 19 9V15C19 17.2 13 18.5 6 18.5" />
      <path d="M6 18.5C13 18.5 19 17.2 19 15" />
    </svg>
  );
}

export function ScissorsBlueIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d62ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

export function SewingMachineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d62ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 19h18" />
      <path d="M6 19V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3H12v4" />
      <circle cx="16" cy="10" r="1.5" fill="#1d62ed" />
      <path d="M12 14v5" />
    </svg>
  );
}

export function ButtonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d62ed" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9.5" cy="9.5" r="1.2" fill="#1d62ed" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="#1d62ed" />
      <circle cx="9.5" cy="14.5" r="1.2" fill="#1d62ed" />
      <circle cx="14.5" cy="14.5" r="1.2" fill="#1d62ed" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#eff6ff" stroke="#1d62ed" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function LightbulbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d62ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15 14c1.5-1.1 2.5-2.9 2.5-5 0-3.3-2.7-6-6-6s-6 2.7-6 6c0 2.1 1 3.9 2.5 5" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function SkylineGraphic({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 64"
      preserveAspectRatio="none"
      fill="#bdd6fa"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,64 L15,64 L15,48 L22,48 L22,40 L32,40 L32,64 L44,64 L44,32 L54,32 L54,22 L59,16 L64,22 L64,32 L72,32 L72,64 L86,64 L86,44 L96,44 L96,64 L112,64 L112,36 L120,36 L120,26 L128,26 L128,36 L138,36 L138,64 L152,64 L152,50 L164,50 L164,64 L178,64 L178,30 L190,30 L190,64 L208,64 L208,42 L218,42 L218,64 L234,64 L234,24 L238,24 L238,14 L242,10 L246,14 L246,24 L252,24 L252,64 L264,64 L264,34 L276,34 L276,64 L294,64 L294,46 L308,46 L308,64 L324,64 L324,20 L336,20 L336,64 L348,64 L348,38 L358,38 L358,64 L374,64 L374,26 L386,26 L386,64 L398,64 L398,42 L412,42 L412,64 L428,64 L428,32 L440,32 L440,64 L460,64 L460,40 L475,40 L475,64 L500,64 Z"
        opacity="0.8"
      />
      <path
        d="M20,64 L35,64 L35,52 L48,52 L48,64 L66,64 L66,38 L80,38 L80,64 L106,64 L106,48 L122,48 L122,64 L146,64 L146,42 L160,42 L160,64 L185,64 L185,46 L200,46 L200,64 L226,64 L226,34 L238,34 L238,64 L260,64 L260,48 L275,48 L275,64 L315,64 L315,38 L330,38 L330,64 L365,64 L365,42 L380,42 L380,64 L420,64 L420,50 L445,50 L445,64 Z"
        opacity="0.45"
      />
    </svg>
  );
}
