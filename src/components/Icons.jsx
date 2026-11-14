/**
 * Библиотека векторных SVG-иконок калькулятора.
 * Все иконки написаны на чистом SVG без внешних картинок.
 */

export function BrandShirtIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 11L10 18L15 31L21 28V55H43V28L49 31L54 18L43 11C40 16 36 18 32 18C28 18 24 16 21 11Z"
        fill="#ffffff"
        stroke="#1d62ed"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M21 11L10 18L15 31L21 28V11Z"
        fill="#4382f6"
        stroke="#1d62ed"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M43 11L54 18L49 31L43 28V11Z"
        fill="#4382f6"
        stroke="#1d62ed"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M21 11C24 16 28 18 32 18C36 18 40 16 43 11"
        stroke="#1d62ed"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FactoryIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 27V13L12 8V13L20 8V13L28 17V27H4Z"
        stroke="#62779c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="7" y="17" width="4" height="4" stroke="#62779c" strokeWidth="1.8" />
      <rect x="15" y="17" width="4" height="4" stroke="#62779c" strokeWidth="1.8" />
      <path d="M22 27V21H25V27" stroke="#62779c" strokeWidth="1.8" />
      <line x1="2" y1="27" x2="30" y2="27" stroke="#62779c" strokeWidth="2" />
    </svg>
  );
}

export function ShirtBadgeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3.5L4 6.5L5.8 11.2L8.5 10V20.5H15.5V10L18.2 11.2L20 6.5L16 3.5C15 5.5 13.5 6.2 12 6.2C10.5 6.2 9 5.5 8 3.5Z"
        fill="#2563eb"
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
      <path d="M8 3.5L4 6.5L5.8 11.2L8.5 10V20.5H15.5V10L18.2 11.2L20 6.5L16 3.5C15 5.5 13.5 6.2 12 6.2C10.5 6.2 9 5.5 8 3.5Z" />
    </svg>
  );
}

export function ScissorsGreenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="3" stroke="#10b981" strokeWidth="2.4" fill="none" />
      <circle cx="6" cy="18" r="3" stroke="#10b981" strokeWidth="2.4" fill="none" />
      <path d="M8.5 8L19 18.5" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8.5 16L19 5.5" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="14" fill="#22c55e" />
      <path
        d="M8.5 14.5L12.5 18.5L20 10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoldCoinsIcon() {
  return (
    <svg width="56" height="52" viewBox="0 0 58 52" fill="none" aria-hidden="true">
      <g transform="translate(2, 20)">
        <path
          d="M0 7C0 3.1 5.37 0 12 0C18.63 0 24 3.1 24 7V13C24 16.9 18.63 20 12 20C5.37 20 0 16.9 0 13V7Z"
          fill="#d97706"
        />
        <path
          d="M0 9C0 12.9 5.37 16 12 16C18.63 16 24 12.9 24 9V13C24 16.9 18.63 20 12 20C5.37 20 0 16.9 0 13V9Z"
          fill="#b45309"
        />
        <ellipse cx="12" cy="7" rx="12" ry="6.5" fill="#f59e0b" />
        <ellipse cx="12" cy="7" rx="10" ry="5.2" fill="#fbbf24" />
        <ellipse cx="12" cy="7" rx="8.5" ry="4.2" fill="#fef08a" />
      </g>
      <g transform="translate(14, 10)">
        <path
          d="M0 7C0 3.1 5.37 0 12 0C18.63 0 24 3.1 24 7V13C24 16.9 18.63 20 12 20C5.37 20 0 16.9 0 13V7Z"
          fill="#d97706"
        />
        <path
          d="M0 9C0 12.9 5.37 16 12 16C18.63 16 24 12.9 24 9V13C24 16.9 18.63 20 12 20C5.37 20 0 16.9 0 13V9Z"
          fill="#b45309"
        />
        <ellipse cx="12" cy="7" rx="12" ry="6.5" fill="#f59e0b" />
        <ellipse cx="12" cy="7" rx="10" ry="5.2" fill="#fbbf24" />
        <ellipse cx="12" cy="7" rx="8.5" ry="4.2" fill="#fef08a" />
      </g>
      <g transform="translate(26, 0)">
        <path
          d="M0 8C0 3.5 5.37 0 12 0C18.63 0 24 3.5 24 8V18C24 22.5 18.63 26 12 26C5.37 26 0 22.5 0 18V8Z"
          fill="#d97706"
        />
        <path
          d="M0 13C0 17.5 5.37 21 12 21C18.63 21 24 17.5 24 13V18C24 22.5 18.63 26 12 26C5.37 26 0 22.5 0 18V13Z"
          fill="#b45309"
        />
        <ellipse cx="12" cy="8" rx="12" ry="7" fill="#f59e0b" />
        <ellipse cx="12" cy="8" rx="10.2" ry="5.8" fill="#fbbf24" />
        <ellipse cx="12" cy="8" rx="8.8" ry="4.8" fill="#fef08a" />
      </g>
    </svg>
  );
}

export function FabricRollIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="6" cy="12" rx="4" ry="7" />
      <path d="M6 5C13 5 20 6.2 20 8.5V15.5C20 17.8 13 19 6 19" />
      <path d="M6 19C13 19 20 17.8 20 15.5" />
    </svg>
  );
}

export function ScissorsBlueIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 20H21" />
      <path d="M5 20V8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V20" />
      <path d="M19 11H12V14" />
      <circle cx="16.5" cy="11" r="1.5" fill="#2563eb" />
    </svg>
  );
}

export function ButtonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9.5" cy="9.5" r="1" fill="#2563eb" />
      <circle cx="14.5" cy="9.5" r="1" fill="#2563eb" />
      <circle cx="9.5" cy="14.5" r="1" fill="#2563eb" />
      <circle cx="14.5" cy="14.5" r="1" fill="#2563eb" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb" stroke="#2563eb" strokeWidth="1" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function LightbulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18H15" />
      <path d="M10 22H14" />
      <path d="M15.09 14C16.9 12.63 18 10.45 18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 10.45 7.1 12.63 8.91 14" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
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
