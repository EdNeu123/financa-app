/**
 * InsightsEngine — análise de tendências e projeção de gastos.
 * 100% matemática, zero dependência de API.
 */
import { MONTH_NAMES } from './constants';

/** Gastos mensais por categoria nos últimos N meses */
export function getMonthlyBreakdown(transactions, months = 6) {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const mtx = transactions.filter(t => t.date?.startsWith(key));
    const expenses = mtx.filter(t => t.type === 'expense');
    const income = mtx.filter(t => t.type === 'income');
    const cats = {};
    expenses.forEach(t => { cats[t.category || 'Outros'] = (cats[t.category || 'Outros'] || 0) + (t.amount || 0); });
    return {
      month: MONTH_NAMES[d.getMonth()],
      monthKey: key,
      categories: cats,
      totalExpense: expenses.reduce((s, t) => s + (t.amount || 0), 0),
      totalIncome: income.reduce((s, t) => s + (t.amount || 0), 0),
    };
  });
}

/** Detecta tendências: compara média dos últimos 3 meses com os 3 anteriores */
export function detectTrends(transactions) {
  const data = getMonthlyBreakdown(transactions, 6);
  if (data.length < 4) return [];

  const older = data.slice(0, 3);
  const newer = data.slice(3);
  const allCats = new Set();
  data.forEach(m => Object.keys(m.categories).forEach(c => allCats.add(c)));

  const trends = [];
  allCats.forEach(cat => {
    const avgOld = older.reduce((s, m) => s + (m.categories[cat] || 0), 0) / older.length;
    const avgNew = newer.reduce((s, m) => s + (m.categories[cat] || 0), 0) / newer.length;
    if (avgOld === 0 && avgNew === 0) return;
    const change = avgOld > 0 ? ((avgNew - avgOld) / avgOld) * 100 : avgNew > 0 ? 100 : 0;
    trends.push({
      category: cat,
      avgOld: Math.round(avgOld),
      avgNew: Math.round(avgNew),
      change: Math.round(change),
      direction: change > 15 ? 'up' : change < -15 ? 'down' : 'stable',
    });
  });
  return trends.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
}

/** Projeta gastos do próximo mês com média ponderada */
export function projectExpenses(transactions, months = 6) {
  const data = getMonthlyBreakdown(transactions, months);
  if (data.length < 2) return { total: 0, categories: {}, confidence: 'low', history: [] };

  const weights = data.map((_, i) => i + 1);
  const totalW = weights.reduce((a, b) => a + b, 0);
  const projTotal = data.reduce((s, m, i) => s + m.totalExpense * weights[i], 0) / totalW;

  const allCats = new Set();
  data.forEach(m => Object.keys(m.categories).forEach(c => allCats.add(c)));
  const projCats = {};
  allCats.forEach(cat => {
    const w = data.reduce((s, m, i) => s + (m.categories[cat] || 0) * weights[i], 0) / totalW;
    if (w > 0) projCats[cat] = Math.round(w);
  });

  const mean = data.reduce((s, m) => s + m.totalExpense, 0) / data.length;
  const variance = data.reduce((s, m) => s + Math.pow(m.totalExpense - mean, 2), 0) / data.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;

  return {
    total: Math.round(projTotal),
    categories: projCats,
    confidence: cv < 0.2 ? 'high' : cv < 0.5 ? 'medium' : 'low',
    history: data.map(m => ({ month: m.month, expense: m.totalExpense, income: m.totalIncome })),
  };
}

/** Gera alertas inteligentes baseados nos dados */
export function generateAlerts(transactions, budgets = []) {
  const alerts = [];
  const trends = detectTrends(transactions);
  const projection = projectExpenses(transactions);
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = dayOfMonth / daysInMonth;

  // Tendências de alta preocupantes
  trends.filter(t => t.direction === 'up' && t.change > 30).forEach(t => {
    alerts.push({
      type: 'trend',
      severity: t.change > 60 ? 'high' : 'medium',
      title: `${t.category} subindo ${t.change}%`,
      desc: `Média passou de R$ ${t.avgOld} para R$ ${t.avgNew}/mês nos últimos 3 meses.`,
    });
  });

  // Ritmo de gasto acima do esperado
  const thisMonthExpense = transactions
    .filter(t => t.date?.startsWith(thisMonth) && t.type === 'expense')
    .reduce((s, t) => s + (t.amount || 0), 0);

  if (projection.total > 0 && monthProgress > 0.2) {
    const projected = thisMonthExpense / monthProgress;
    if (projected > projection.total * 1.2) {
      alerts.push({
        type: 'pace',
        severity: 'high',
        title: 'Ritmo de gasto acelerado',
        desc: `No ritmo atual, você gastará ~R$ ${Math.round(projected).toLocaleString('pt-BR')} este mês (projeção era R$ ${projection.total.toLocaleString('pt-BR')}).`,
      });
    }
  }

  // Orçamentos estourados
  budgets.forEach(b => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === b.category && t.date?.startsWith(thisMonth))
      .reduce((s, t) => s + (t.amount || 0), 0);
    const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
    if (pct >= 100) {
      alerts.push({ type: 'budget', severity: 'high', title: `${b.category}: limite estourado`, desc: `Gastou R$ ${Math.round(spent)} de R$ ${b.limitAmount} (${Math.round(pct)}%).` });
    } else if (pct >= 80) {
      alerts.push({ type: 'budget', severity: 'medium', title: `${b.category}: ${Math.round(pct)}% do limite`, desc: `Faltam R$ ${Math.round(b.limitAmount - spent)} para estourar.` });
    }
  });

  // Economia caindo
  const recentMonths = getMonthlyBreakdown(transactions, 3);
  const savingsRates = recentMonths.map(m => m.totalIncome > 0 ? ((m.totalIncome - m.totalExpense) / m.totalIncome) * 100 : 0);
  const avgSavings = savingsRates.reduce((a, b) => a + b, 0) / savingsRates.length;
  if (avgSavings < 10 && recentMonths.some(m => m.totalIncome > 0)) {
    alerts.push({
      type: 'savings',
      severity: avgSavings < 0 ? 'high' : 'medium',
      title: avgSavings < 0 ? 'Gastando mais do que ganha' : 'Taxa de economia baixa',
      desc: `Sua média de economia é ${Math.round(avgSavings)}% da renda nos últimos 3 meses. O ideal é acima de 20%.`,
    });
  }

  return alerts.sort((a, b) => (a.severity === 'high' ? 0 : 1) - (b.severity === 'high' ? 0 : 1));
}
