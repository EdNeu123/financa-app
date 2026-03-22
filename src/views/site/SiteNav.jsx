import Logo from "../../components/Logo";
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = [
  { to: '/', label: 'Início' },
  { to: '/funcionalidades', label: 'Funcionalidades' },
  { to: '/precos', label: 'Preços' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/faq', label: 'FAQ' },
];

export default function SiteNav() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{ borderColor: 'var(--border)', background: theme === 'dark' ? 'rgba(28,28,30,0.88)' : 'rgba(245,245,247,0.88)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="text-lg font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>Quanto</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className="px-3.5 py-2 rounded-lg text-sm transition-colors"
              style={{
                color: location.pathname === l.to ? 'var(--accent)' : 'var(--text-secondary)',
                background: location.pathname === l.to ? 'var(--accent-light)' : 'transparent',
              }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/entrar" className="hidden sm:flex btn-primary !px-5 !py-2 text-sm">Entrar</Link>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-6 py-4 space-y-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          {LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
              {l.label}
            </Link>
          ))}
          <Link to="/entrar" onClick={() => setOpen(false)} className="block btn-primary text-center text-sm mt-2">Entrar</Link>
        </div>
      )}
    </nav>
  );
}
