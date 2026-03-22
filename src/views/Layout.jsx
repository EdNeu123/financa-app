import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as AuthController from '../controllers/AuthController';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Tag, Target, LogOut,
  TrendingUp, Menu, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'goals', label: 'Metas', icon: Target },
];

export default function Layout({ activePage, setActivePage, children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '??';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight">Finança</span>
      </div>
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${active ? 'bg-brand-500/15 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon className={`w-[18px] h-[18px] ${active ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-400/60" />}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4 mt-auto">
        <div className="glass-card p-3 flex items-center gap-3">
          {user?.photoURL
            ? <img src={user.photoURL} alt="" className="w-9 h-9 rounded-xl object-cover" referrerPolicy="no-referrer" />
            : <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">{initials}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.displayName || 'Usuário'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={() => AuthController.logout()} title="Sair"
            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-danger-400 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex relative">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <aside className="hidden lg:flex w-[260px] flex-col bg-surface-1/80 backdrop-blur-xl border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-surface-1 border-r border-white/5 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <main className="flex-1 lg:ml-[260px] relative z-10">
        <div className="lg:hidden sticky top-0 z-20 bg-surface-0/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold">{NAV_ITEMS.find(n => n.id === activePage)?.label}</span>
        </div>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
