import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, BellOff, BellRing } from 'lucide-react';
import { generateInAppNotifications, requestNotificationPermission, checkAndNotify, scheduleDailyReminder } from '../utils/notifications';

const TYPE_COLORS = { success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: 'var(--accent)' };

export default function NotificationCenter({ transactions, budgets, goals, gamification }) {
  const [open, setOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState('default');
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quanto_dismissed_notifs') || '[]'); } catch { return []; }
  });
  const ref = useRef(null);

  const allNotifs = generateInAppNotifications(transactions || [], budgets || [], goals || [], gamification);
  const notifs = allNotifs.filter(n => !dismissed.includes(n.id));
  const count = notifs.length;

  // Check push permission status
  useEffect(() => {
    if ('Notification' in window) setPushStatus(Notification.permission);
  }, []);

  // Send contextual push notifications
  useEffect(() => {
    if (pushStatus === 'granted' && transactions?.length > 0) {
      checkAndNotify(transactions, budgets, gamification);
      scheduleDailyReminder();
    }
  }, [pushStatus, transactions, budgets, gamification]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('quanto_dismissed_notifs', JSON.stringify(updated));
  };

  const enablePush = async () => {
    const result = await requestNotificationPermission();
    setPushStatus(result);
    if (result === 'granted') {
      scheduleDailyReminder();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)', background: open ? 'var(--bg-tertiary)' : 'transparent' }}>
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: '#ef4444', minWidth: '18px', height: '18px' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-[340px] max-h-[480px] overflow-y-auto rounded-2xl border z-50"
            style={{ background: 'var(--bg-card-solid, var(--bg-card))', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>

            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-solid, var(--bg-card))' }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notificações</h3>
                {count > 0 && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{count} {count === 1 ? 'nova' : 'novas'}</p>}
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Push permission prompt */}
            {pushStatus !== 'granted' && pushStatus !== 'unsupported' && (
              <div className="p-3 mx-3 mt-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                <div className="flex items-start gap-2.5">
                  <BellRing className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Ativar notificações</p>
                    <p className="text-[11px] mt-0.5 mb-2" style={{ color: 'var(--text-secondary)' }}>Receba lembretes para registrar gastos e alertas de orçamento.</p>
                    {pushStatus === 'denied' ? (
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Bloqueado no navegador. Vá em Configurações do site para permitir.</p>
                    ) : (
                      <button onClick={enablePush} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: 'var(--accent)' }}>
                        Permitir notificações
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notification list */}
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <BellOff className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tudo em dia!</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {notifs.map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl group" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-base mt-0.5 flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.desc}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                    </div>
                    <button onClick={() => dismiss(n.id)} className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Push status footer */}
            {pushStatus === 'granted' && (
              <div className="p-3 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <BellRing className="w-3 h-3" /> Notificações push ativas
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
