/**
 * Componentes visuais para o site.
 * Tudo em SVG/CSS — zero imagens externas, adapta ao tema.
 */

/** Mini dashboard mockup que parece screenshot real do app */
export function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Glow sutil atrás */}
      <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ background: 'var(--accent)', transform: 'scale(0.9) translateY(20px)' }} />

      {/* Frame do "browser" */}
      <div className="relative rounded-2xl overflow-hidden border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
          </div>
          <div className="flex-1 mx-8">
            <div className="h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>quanto.app/app</span>
            </div>
          </div>
        </div>

        {/* App content mockup */}
        <div className="flex" style={{ height: '320px' }}>
          {/* Sidebar mini */}
          <div className="hidden sm:flex w-[140px] flex-col gap-1.5 p-3 border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
              <div className="w-5 h-5 rounded" style={{ background: 'var(--accent)' }} />
              <div className="h-2.5 w-12 rounded" style={{ background: 'var(--text-primary)', opacity: 0.7 }} />
            </div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                style={{ background: i === 1 ? 'var(--accent-light)' : 'transparent' }}>
                <div className="w-3.5 h-3.5 rounded" style={{ background: i === 1 ? 'var(--accent)' : 'var(--text-muted)', opacity: i === 1 ? 1 : 0.3 }} />
                <div className="h-2 rounded" style={{ width: `${40 + Math.random() * 30}px`, background: i === 1 ? 'var(--accent)' : 'var(--text-muted)', opacity: i === 1 ? 0.8 : 0.2 }} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Title */}
            <div className="flex items-center justify-between mb-4">
              <div><div className="h-3 w-20 rounded mb-1.5" style={{ background: 'var(--text-primary)', opacity: 0.7 }} /><div className="h-2 w-32 rounded" style={{ background: 'var(--text-muted)', opacity: 0.3 }} /></div>
              <div className="h-6 w-20 rounded-lg" style={{ background: 'var(--bg-tertiary)' }} />
            </div>

            {/* 4 stat cards */}
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {[
                { color: '#10b981', label: 'R$ 8.500' },
                { color: '#ef4444', label: 'R$ 3.240' },
                { color: '#8b5cf6', label: 'R$ 1.200' },
                { color: '#10b981', label: 'R$ 4.060' },
              ].map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-1.5 w-10 rounded mb-2" style={{ background: 'var(--text-muted)', opacity: 0.25 }} />
                  <div className="text-[11px] font-bold font-mono" style={{ color: c.color }}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-1.5 w-16 rounded mb-3" style={{ background: 'var(--text-muted)', opacity: 0.25 }} />
                <svg viewBox="0 0 200 80" className="w-full h-[100px]">
                  <defs>
                    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C30,55 50,40 80,35 S130,25 160,20 S190,18 200,15 L200,80 L0,80 Z" fill="url(#mg)" />
                  <path d="M0,60 C30,55 50,40 80,35 S130,25 160,20 S190,18 200,15" fill="none" stroke="#10b981" strokeWidth="1.5" />
                  <path d="M0,65 C30,68 60,55 90,58 S140,48 170,50 S190,45 200,42 L200,80 L0,80 Z" fill="rgba(239,68,68,0.08)" />
                  <path d="M0,65 C30,68 60,55 90,58 S140,48 170,50 S190,45 200,42" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>

              {/* Mini pie */}
              <div className="w-[120px] p-3 rounded-xl hidden md:block" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-1.5 w-12 rounded mb-3" style={{ background: 'var(--text-muted)', opacity: 0.25 }} />
                <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto">
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray="42 96" strokeDashoffset="0" />
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="30 108" strokeDashoffset="-42" />
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="24 114" strokeDashoffset="-72" />
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="42 96" strokeDashoffset="-96" />
                </svg>
                {[{ c: '#f97316', w: 28 }, { c: '#3b82f6', w: 22 }, { c: '#8b5cf6', w: 18 }].map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.c }} />
                    <div className="h-1.5 rounded" style={{ width: `${d.w}px`, background: 'var(--text-muted)', opacity: 0.2 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Abstract geometric pattern for decorative backgrounds */
export function GeometricPattern({ className = '' }) {
  return (
    <svg viewBox="0 0 400 200" className={`w-full ${className}`} style={{ opacity: 0.04 }}>
      <circle cx="50" cy="100" r="40" fill="var(--accent)" />
      <circle cx="350" cy="60" r="25" fill="var(--accent)" />
      <rect x="150" y="30" width="60" height="60" rx="12" fill="var(--accent)" transform="rotate(15 180 60)" />
      <rect x="280" y="120" width="45" height="45" rx="10" fill="var(--accent)" transform="rotate(-10 302 142)" />
      <circle cx="200" cy="160" r="18" fill="var(--accent)" />
    </svg>
  );
}

/** Feature illustration — abstract icon composition */
export function FeatureIllustration({ type = 'dashboard' }) {
  const configs = {
    dashboard: (
      <svg viewBox="0 0 120 80" className="w-full h-full">
        <rect x="5" y="5" width="50" height="30" rx="4" fill="var(--accent)" opacity="0.15" />
        <rect x="60" y="5" width="55" height="30" rx="4" fill="var(--accent)" opacity="0.08" />
        <rect x="5" y="40" width="110" height="35" rx="4" fill="var(--accent)" opacity="0.06" />
        <path d="M15,65 C25,55 40,50 55,52 S75,48 85,42 S100,38 105,35" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="30" cy="18" r="3" fill="var(--accent)" opacity="0.5" />
        <circle cx="85" cy="18" r="3" fill="var(--accent)" opacity="0.3" />
      </svg>
    ),
    security: (
      <svg viewBox="0 0 120 80" className="w-full h-full">
        <path d="M60,8 L95,22 L95,45 C95,62 78,72 60,78 C42,72 25,62 25,45 L25,22 Z" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="1" opacity="0.2" />
        <path d="M48,42 L56,50 L74,32" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
    growth: (
      <svg viewBox="0 0 120 80" className="w-full h-full">
        <path d="M10,65 L35,45 L55,52 L80,25 L110,15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <circle cx="35" cy="45" r="3" fill="var(--accent)" opacity="0.3" />
        <circle cx="55" cy="52" r="3" fill="var(--accent)" opacity="0.3" />
        <circle cx="80" cy="25" r="3" fill="var(--accent)" opacity="0.3" />
        <circle cx="110" cy="15" r="4" fill="var(--accent)" opacity="0.5" />
        <path d="M102,15 L110,15 L110,23" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  };
  return configs[type] || configs.dashboard;
}

/** Floating stats for visual interest */
export function FloatingStats() {
  return (
    <div className="relative h-[200px] flex items-center justify-center">
      {[
        { label: 'Receitas', value: '+R$ 8.5k', color: '#10b981', x: '10%', y: '20%', delay: 0 },
        { label: 'Despesas', value: '-R$ 3.2k', color: '#ef4444', x: '65%', y: '10%', delay: 0.1 },
        { label: 'Guardado', value: 'R$ 1.2k', color: '#8b5cf6', x: '5%', y: '65%', delay: 0.2 },
        { label: 'Disponível', value: 'R$ 4.1k', color: '#0d9488', x: '55%', y: '60%', delay: 0.3 },
        { label: 'Nível 5', value: 'Investidor', color: '#eab308', x: '35%', y: '40%', delay: 0.15 },
      ].map((s, i) => (
        <div key={i} className="absolute card !rounded-xl px-3 py-2 animate-pulse"
          style={{ left: s.x, top: s.y, animationDelay: `${s.delay * 3}s`, animationDuration: '4s' }}>
          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          <p className="text-xs font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

/** Phone frame mockup */
export function PhoneMockup({ children }) {
  return (
    <div className="relative mx-auto" style={{ width: '220px' }}>
      <div className="absolute inset-0 rounded-[28px] blur-2xl opacity-10" style={{ background: 'var(--accent)' }} />
      <div className="relative rounded-[28px] border-[6px] overflow-hidden" style={{ borderColor: 'var(--text-primary)', opacity: 0.9 }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-xl z-10" style={{ background: 'var(--text-primary)', opacity: 0.9 }} />
        <div className="pt-6" style={{ background: 'var(--bg-card)' }}>
          {children || (
            <div className="p-3 space-y-3" style={{ height: '380px' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md" style={{ background: 'var(--accent)' }} />
                <div className="h-2.5 w-14 rounded" style={{ background: 'var(--text-primary)', opacity: 0.6 }} />
              </div>
              {[1, 2].map(i => (
                <div key={i} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-1.5 w-12 rounded mb-2" style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
                  <div className="text-[10px] font-bold font-mono" style={{ color: i === 1 ? '#10b981' : '#ef4444' }}>
                    {i === 1 ? 'R$ 8.500,00' : 'R$ 3.240,00'}
                  </div>
                </div>
              ))}
              <div className="p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <svg viewBox="0 0 160 50" className="w-full">
                  <path d="M0,35 C20,30 40,20 60,22 S100,15 130,10 S150,8 160,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                </svg>
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg" style={{ background: ['#f9731620', '#3b82f620', '#8b5cf620'][i - 1] }} />
                  <div className="flex-1">
                    <div className="h-1.5 w-16 rounded mb-1" style={{ background: 'var(--text-primary)', opacity: 0.5 }} />
                    <div className="h-1 w-10 rounded" style={{ background: 'var(--text-muted)', opacity: 0.2 }} />
                  </div>
                  <div className="h-2 w-12 rounded" style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
