import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Brain, Sparkles, RefreshCw, Zap, ShieldCheck, Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { detectTrends, projectExpenses, generateAlerts, getMonthlyBreakdown } from '../utils/insights';
import { analyzeSpending, isGeminiConfigured } from '../utils/gemini';
import { CategoryBadge } from '../utils/icons';

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (<div className="card !rounded-lg !p-2.5 !shadow-lg text-xs"><p style={{ color: 'var(--text-muted)' }}>{label}</p>
    {payload.map((e, i) => <p key={i} style={{ color: e.color }} className="font-medium">{e.name}: {formatCurrency(e.value)}</p>)}</div>);
}

const SEV_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const DIR_ICONS = { up: TrendingUp, down: TrendingDown, stable: Minus };

export default function Insights({ transactions, budgets, categories }) {
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const hasGemini = isGeminiConfigured();

  const trends = useMemo(() => detectTrends(transactions), [transactions]);
  const projection = useMemo(() => projectExpenses(transactions), [transactions]);
  const alerts = useMemo(() => generateAlerts(transactions, budgets), [transactions, budgets]);
  const breakdown = useMemo(() => getMonthlyBreakdown(transactions, 6), [transactions]);

  // Chart data for projection
  const projChartData = useMemo(() => {
    const hist = projection.history || [];
    const next = hist.length > 0 ? { month: 'Próx.', expense: projection.total, income: null, projected: true } : null;
    return next ? [...hist, next] : hist;
  }, [projection]);

  // Top categories for projection
  const projCategories = useMemo(() =>
    Object.entries(projection.categories).sort((a, b) => b[1] - a[1]).slice(0, 6),
    [projection]
  );

  const confLabels = { high: 'Alta confiança', medium: 'Confiança média', low: 'Dados insuficientes' };
  const confColors = { high: '#10b981', medium: '#f59e0b', low: '#94a3b8' };

  const fetchAI = async () => {
    if (!hasGemini) return;
    setAiLoading(true);
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const mtx = transactions.filter(t => t.date?.startsWith(thisMonth));
    const income = mtx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const expense = mtx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    const saved = mtx.filter(t => t.type === 'savings').reduce((s, t) => s + (t.amount || 0), 0);
    const catMap = {};
    mtx.filter(t => t.type === 'expense').forEach(t => { catMap[t.category || 'Outros'] = (catMap[t.category || 'Outros'] || 0) + (t.amount || 0); });
    const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value: Math.round(value) }));

    const result = await analyzeSpending({ income: Math.round(income), expense: Math.round(expense), saved: Math.round(saved), available: Math.round(income - expense - saved), topCategories: topCats, trends: trends.slice(0, 5) });
    setAiInsight(result);
    setAiLoading(false);
  };

  const healthColors = { good: '#10b981', attention: '#f59e0b', critical: '#ef4444' };
  const healthLabels = { good: 'Saudável', attention: 'Atenção', critical: 'Crítico' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Insights</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Tendências, projeções e análise inteligente dos seus gastos</p></div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <p className="section-title">Alertas</p>
          {alerts.slice(0, 4).map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4 flex items-start gap-3" style={{ borderLeft: `3px solid ${SEV_COLORS[a.severity]}`, borderRadius: '0 16px 16px 0' }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: SEV_COLORS[a.severity] }} />
              <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{a.desc}</p></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Insight */}
      {hasGemini && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Brain className="w-4 h-4" style={{ color: '#8b5cf6' }} /><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Análise com IA</p></div>
            <button onClick={fetchAI} disabled={aiLoading} className="btn-ghost flex items-center gap-2 text-xs !py-1.5 !px-3">
              {aiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {aiLoading ? 'Analisando...' : aiInsight ? 'Atualizar' : 'Analisar gastos'}
            </button>
          </div>
          {aiInsight ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: healthColors[aiInsight.overall_health] + '15' }}>
                  <span className="text-2xl font-extrabold font-mono" style={{ color: healthColors[aiInsight.overall_health] }}>{aiInsight.score}</span>
                </div>
                <div><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: healthColors[aiInsight.overall_health] + '15', color: healthColors[aiInsight.overall_health] }}>{healthLabels[aiInsight.overall_health]}</span>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{aiInsight.summary}</p></div>
              </div>
              {aiInsight.highlight && (
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(139,92,246,0.08)' }}>
                  <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#8b5cf6' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#8b5cf6' }}>{aiInsight.highlight}</p>
                </div>
              )}
              {aiInsight.tips?.length > 0 && (
                <div className="space-y-2">{aiInsight.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t}</p>
                  </div>
                ))}</div>
              )}
            </div>
          ) : !aiLoading && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Clique em "Analisar gastos" para uma avaliação personalizada com IA</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Projection chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="section-title !mb-0">Projeção de gastos</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: confColors[projection.confidence] + '15', color: confColors[projection.confidence] }}>{confLabels[projection.confidence]}</span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Próximo mês estimado: <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(projection.total)}</span>
          </p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projChartData}>
                <defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="expense" name="Despesas" stroke="#8b5cf6" fill="url(#gp)" strokeWidth={2} strokeDasharray={undefined} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {projCategories.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Projeção por categoria:</p>
              {projCategories.map(([cat, val]) => (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <CategoryBadge name={cat} size="sm" />
                  <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trends */}
        <div className="card p-5">
          <p className="section-title">Tendências (3 meses)</p>
          {trends.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>Dados insuficientes — precisa de pelo menos 4 meses de histórico</p>
          ) : (
            <div className="space-y-3">
              {trends.slice(0, 8).map((t, i) => {
                const DirIcon = DIR_ICONS[t.direction];
                const color = t.direction === 'up' ? '#ef4444' : t.direction === 'down' ? '#10b981' : 'var(--text-muted)';
                return (
                  <motion.div key={t.category} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <CategoryBadge name={t.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.category}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>R$ {t.avgOld} → R$ {t.avgNew}/mês</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DirIcon className="w-3.5 h-3.5" style={{ color }} />
                      <span className="text-xs font-mono font-semibold" style={{ color }}>{t.change > 0 ? '+' : ''}{t.change}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* History chart */}
      <div className="card p-5">
        <p className="section-title">Histórico de 6 meses</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="totalIncome" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalExpense" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
