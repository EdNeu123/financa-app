import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="py-10 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="text-white font-extrabold text-xs font-display">Q</span>
              </div>
              <span className="font-bold font-display" style={{ color: 'var(--text-primary)' }}>Quanto</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Cada real no lugar certo.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Produto</p>
            <div className="space-y-2">
              <Link to="/funcionalidades" className="block text-sm" style={{ color: 'var(--text-secondary)' }}>Funcionalidades</Link>
              <Link to="/precos" className="block text-sm" style={{ color: 'var(--text-secondary)' }}>Preços</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Empresa</p>
            <div className="space-y-2">
              <Link to="/sobre" className="block text-sm" style={{ color: 'var(--text-secondary)' }}>Sobre nós</Link>
              <Link to="/faq" className="block text-sm" style={{ color: 'var(--text-secondary)' }}>FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Legal</p>
            <div className="space-y-2">
              <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>Privacidade</span>
              <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>Termos de uso</span>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Quanto. Todos os direitos reservados.</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Feito com propósito no Brasil.</p>
        </div>
      </div>
    </footer>
  );
}
