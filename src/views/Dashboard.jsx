import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { formatCurrency, getMonthName } from '../utils/formatters';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }} className="font-medium">
          {e.name}: {formatCurrency(e.value)}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ transactions, categories, goals }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split('-');
    return `${getMonthName(parseInt(m) - 1)} ${y}`;
  }, [selectedMonth]);

  const changeMonth = (delta) => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthTx = useMemo(() =>
    transactions.filter(t => t.date?.startsWith(selectedMonth)),
    [transactions, selectedMonth]
  );

  const summary = useMemo(() => {
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [monthTx]);

  const monthlyData = useMemo(() => {
    const [sy, sm] = selectedMonth.split('-').map(Number);
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(sy, sm - 1 - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mtx = transactions.filter(t => t.date?.startsWith(key));
      return {
        month: getMonthName(d.getMonth()),
        receitas: mtx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0),
        despesas: mtx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0),
      };
    });
  }, [transactions, selectedMonth]);

  const categoryData = useMemo(() => {
    const map = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Outros';
      map[cat] = (map[cat] || 0) + (t.amount || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({
        name, value,
        color: categories.find(c => c.name === name)?.color || '#94a3b8',
      }))
      .sort((a, b) => b.value - a.value);
  }, [monthTx, categories]);

  const recent = monthTx.slice(0, 5);

  const goalsProgress = useMemo(() =>
    goals.map(g => {
      const saved = transactions.filter(t => t.goalId === g.id && t.type === 'income')
        .reduce((s, t) => s + (t.amount || 0), 0);
      return { ...g, saved, progress: g.target > 0 ? Math.min((saved / g.target) * 100, 100) : 0 };
    }),
    [goals, transactions]
  );

  const cards = [
    { label: 'Receitas', value: summary.income, icon: ArrowUpRight, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
    { label: 'Despesas', value: summary.expense, icon: ArrowDownRight, color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/20' },
    { label: 'Balanço', value: summary.balance,
      icon: summary.balance >= 0 ? TrendingUp : TrendingDown,
      color: summary.balance >= 0 ? 'text-brand-400' : 'text-danger-400',
      bg: summary.balance >= 0 ? 'bg-brand-500/10' : 'bg-danger-500/10',
      border: summary.balance >= 0 ? 'border-brand-500/20' : 'border-danger-500/20' },
  ];

  const fadeUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-2 glass-card px-2 py-1.5">
          <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 min-w-[120px] justify-center">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{monthLabel}</span>
          </div>
          <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.4 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{c.label}</span>
              <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold font-mono ${c.color}`}>{formatCurrency(c.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Receitas vs Despesas</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#22c55e" fill="url(#gI)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" fill="url(#gE)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Despesas por Categoria</h3>
          {categoryData.length === 0
            ? <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">Sem despesas neste mês</div>
            : <>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                    {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie><Tooltip content={<ChartTooltip />} /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2 max-h-[80px] overflow-y-auto">
                {categoryData.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-400 truncate flex-1">{c.name}</span>
                    <span className="text-gray-300 font-mono">{formatCurrency(c.value)}</span>
                  </div>
                ))}
              </div>
            </>}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Transações Recentes</h3>
          {recent.length === 0
            ? <p className="text-gray-500 text-sm py-6 text-center">Nenhuma transação neste mês</p>
            : <div className="space-y-3">{recent.map(tx => {
              const cat = categories.find(c => c.name === tx.category);
              return (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: (cat?.color || '#94a3b8') + '15' }}>{cat?.icon || '📦'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.category}</p>
                  </div>
                  <span className={`text-sm font-mono font-medium ${tx.type === 'income' ? 'text-brand-400' : 'text-danger-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>);
            })}</div>}
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Metas em Progresso</h3>
          {goalsProgress.length === 0
            ? <p className="text-gray-500 text-sm py-6 text-center">Nenhuma meta definida</p>
            : <div className="space-y-4">{goalsProgress.slice(0, 4).map(g => (
              <div key={g.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{g.icon} {g.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{formatCurrency(g.saved)} / {formatCurrency(g.target)}</span>
                </div>
                <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${g.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full" style={{ backgroundColor: g.color || '#22c55e' }} />
                </div>
              </div>
            ))}</div>}
        </motion.div>
      </div>
    </div>
  );
}
