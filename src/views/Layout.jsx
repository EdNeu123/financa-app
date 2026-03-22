import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import * as AuthController from '../controllers/AuthController';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Tag, Target, Shield,
  Trophy, BookOpen, LineChart, LogOut, TrendingUp, Menu,
  ChevronRight, Sun, Moon, X, Bell, Sparkles,
} from 'lucide-react';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações',     icon: ArrowLeftRight },
  { id: 'categories',   label: 'Categorias',     icon: Tag },
  { id: 'goals',        label: 'Metas',          icon: Target },
  { id: 'budgets',      label: 'Orçamentos',     icon: Shield },
  { id: 'insights',     label: 'Insights',       icon: Sparkles },
  { id: 'achievements', label: 'Conquistas',     icon: Trophy },
  { id: 'education',    label: 'Aprender',       icon: BookOpen },
  { id: 'market',       label: 'Mercado',        icon: LineChart },
];

export default function Layout({ activePage, setActivePage, children, alerts }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '??';

  const activeAlerts = alerts?.filter(a => a.triggered)?.length || 0;

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <span className="text-white font-extrabold text-xs font-display">Q</span>
        </div>
        <span className="text-lg font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>Quanto</span>
      </div>

      <nav className="flex-1 px-3 mt-1 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = activePage === item.id;
          return (
            <button key={item.id}
              onClick={() => { setActivePage(item.id); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group relative"
              style={{
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
              }}>
              <item.icon className="w-[17px] h-[17px]" style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
              {item.label}
              {item.id === 'budgets' && activeAlerts > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: 'var(--danger)' }}>{activeAlerts}</span>
              )}
              {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'var(--accent)', opacity: 0.5 }} />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-2">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all"
          style={{ color: 'var(--text-muted)' }}>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        </button>

        <div className="card p-3 flex items-center gap-3 !rounded-xl">
          {user?.photoURL
            ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
            : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{initials}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.displayName || 'Usuário'}</p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <button onClick={() => AuthController.logout()} title="Sair"
            className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[240px] flex-col border-r fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <Sidebar />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[240px] border-r z-50 lg:hidden"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-[240px]">
        <div className="lg:hidden sticky top-0 z-20 backdrop-blur-xl border-b px-4 py-3 flex items-center gap-3"
          style={{ background: theme === 'dark' ? 'rgba(11,15,25,0.8)' : 'rgba(255,255,255,0.8)', borderColor: 'var(--border)' }}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl" style={{ color: 'var(--text-primary)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {NAV.find(n => n.id === activePage)?.label}
          </span>
          <button onClick={toggle} className="ml-auto p-2 rounded-xl" style={{ color: 'var(--text-muted)' }}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
