import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { CategoryBadge } from '../utils/icons';
import { LEVELS } from '../utils/constants';

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-lg !p-2.5 !shadow-lg text-xs"><p style={{ color: 'var(--text-muted)' }}>{label}</p>
      {payload.map((e, i) => <p key={i} style={{ color: e.color }} className="font-medium">{e.name}: {formatCurrency(e.value)}</p>)}
    </div>
  );
}

export default function Dashboard({ transactions, categories, goals, gamification }) {
  const [month, setMonth] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`; });
  const label = useMemo(() => { const [y, m] = month.split('-'); return `${getMonthName(parseInt(m) - 1)} ${y}`; }, [month]);
  const changeMonth = d => { const [y, m] = month.split('-').map(Number); const dt = new Date(y, m - 1 + d, 1); setMonth(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`); };

  const mtx = useMemo(() => transactions.filter(t => t.date?.startsWith(month)), [transactions, month]);
  const summary = useMemo(() => {
    const inc = mtx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const exp = mtx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    const saved = mtx.filter(t => t.type === 'savings').reduce((s, t) => s + (t.amount || 0), 0);
    return { income: inc, expense: exp, saved, available: inc - exp - saved };
  }, [mtx]);

  const chartData = useMemo(() => {
    const [sy, sm] = month.split('-').map(Number);
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(sy, sm - 1 - (5 - i), 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const m = transactions.filter(t => t.date?.startsWith(k));
      return { month: getMonthName(d.getMonth()), receitas: m.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0), despesas: m.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0) };
    });
  }, [transactions, month]);

  const catData = useMemo(() => {
    const map = {};
    mtx.filter(t => t.type === 'expense').forEach(t => { const c = t.category || 'Outros'; map[c] = (map[c] || 0) + (t.amount || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: categories.find(c => c.name === name)?.color || '#94a3b8' })).sort((a, b) => b.value - a.value);
  }, [mtx, categories]);

  const level = gamification ? (() => { let cur = LEVELS[0]; for (const l of LEVELS) { if ((gamification.xp || 0) >= l.xpNeeded) cur = l; else break; } return cur; })() : null;
  const nextLevel = level ? LEVELS.find(l => l.xpNeeded > (level.xpNeeded || 0)) || level : null;

  const cards = [
    { label: 'Receitas', value: summary.income, icon: ArrowUpRight, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Despesas', value: summary.expense, icon: ArrowDownRight, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Guardado', value: summary.saved, icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Disponível', value: summary.available, icon: summary.available >= 0 ? TrendingUp : TrendingDown, color: summary.available >= 0 ? '#10b981' : '#ef4444', bg: summary.available >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center">
          <div className="card !rounded-xl flex items-center gap-1 px-1 py-1">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex items-center gap-2 px-3 min-w-[110px] justify-center"><Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /><span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span></div>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Gamification strip */}
      {gamification && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-glass p-3 sm:p-4 flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ background: (level?.color || '#94a3b8') + '15' }}>
              <span className="text-sm sm:text-base font-extrabold" style={{ color: level?.color }}>{level?.level}</span>
            </div>
            <div><p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{level?.title}</p><p className="text-[11px] sm:text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{gamification.xp || 0} XP</p></div>
          </div>
          <div className="flex-1 hidden sm:block">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((gamification.xp || 0) - (level?.xpNeeded || 0)) / ((nextLevel?.xpNeeded || 100) - (level?.xpNeeded || 0)) * 100)}%`, background: level?.color || 'var(--accent)' }} />
            </div>
          </div>
          {gamification.streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg" style={{ background: 'rgba(249,115,22,0.08)' }}>
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: '#f97316' }} />
              <span className="text-[11px] sm:text-xs font-semibold" style={{ color: '#f97316' }}>{gamification.streak} dias</span>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="stat-card relative overflow-hidden !p-3.5 sm:!p-5">
            {/* Subtle glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl" style={{ background: c.color, opacity: 0.06 }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{c.label}</span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ background: c.color + '12' }}>
                  <c.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: c.color }} />
                </div>
              </div>
              <p className="text-base sm:text-xl lg:text-2xl font-extrabold font-mono tracking-tight truncate" style={{ color: c.color }}>{formatCurrency(c.value)}</p>
              <p className="text-[10px] sm:text-[11px] mt-1.5 sm:mt-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 card-glass p-4 sm:p-6">
          <p className="section-title">Receitas vs despesas</p>
          <div className="h-[220px] sm:h-[260px] -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={35} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" fill="url(#gi)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" fill="url(#ge)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-4 sm:p-5">
          <p className="section-title">Despesas por categoria</p>
          {catData.length === 0 ? <div className="h-[240px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>Sem despesas</div> : <>
            <div className="h-[160px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={46} outerRadius={68} dataKey="value" strokeWidth={0}>{catData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip content={<ChartTip />} /></PieChart></ResponsiveContainer></div>
            <div className="space-y-2 mt-3">{catData.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} /><span className="flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{c.name}</span><span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(c.value)}</span></div>
            ))}</div>
          </>}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <p className="section-title">Transações recentes</p>
          {mtx.slice(0, 5).length === 0 ? <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>Nenhuma neste mês</p>
            : <div className="space-y-3">{mtx.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <CategoryBadge name={tx.category} size="sm" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{tx.description}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tx.category}</p></div>
                <span className="text-sm font-mono font-semibold" style={{ color: tx.type === 'income' ? '#10b981' : '#ef4444' }}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
              </div>))}</div>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-5">
          <p className="section-title">Metas em progresso</p>
          {goals.length === 0 ? <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>Nenhuma meta</p>
            : <div className="space-y-4">{goals.slice(0, 4).map(g => {
              const saved = transactions.filter(t => t.goalId === g.id && t.type === 'savings').reduce((s, t) => s + (t.amount || 0), 0);
              const pct = g.target > 0 ? Math.min((saved / g.target) * 100, 100) : 0;
              return (<div key={g.id}>
                <div className="flex items-center justify-between mb-1.5"><span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</span><span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{formatCurrency(saved)} / {formatCurrency(g.target)}</span></div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: g.color || '#10b981' }} /></div>
              </div>);
            })}</div>}
        </motion.div>
      </div>
    </div>
  );
}
