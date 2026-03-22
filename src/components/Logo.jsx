/** Logo component — teal gradient with chart line through Q */
export default function Logo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`lg-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#lg-${size})`} />
      <path d="M10 22 L14 14 L18 18 L24 8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="8" r="1.5" fill="rgba(255,255,255,0.4)" />
      <text x="16" y="23" textAnchor="middle" fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="17">Q</text>
    </svg>
  );
}

/** Full logo with text */
export function LogoFull({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={size} />
      <span className="font-bold font-display tracking-tight" style={{ fontSize: size * 0.6, color: 'var(--text-primary)' }}>Quanto</span>
    </div>
  );
}
