import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import * as TxCtrl from './controllers/TransactionController';
import * as CatCtrl from './controllers/CategoryController';
import * as GoalCtrl from './controllers/GoalController';
import * as BudgetCtrl from './controllers/BudgetController';
import * as GamCtrl from './controllers/GamificationController';
import { DEFAULT_CATEGORIES, PLAN_LIMITS } from './utils/constants';
import LandingPage from './views/LandingPage';
import AuthPage from './views/AuthPage';
import Layout from './views/Layout';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Categories from './views/Categories';
import Goals from './views/Goals';
import Budgets from './views/Budgets';
import Achievements from './views/Achievements';
import Education from './views/Education';
import Market from './views/Market';
import Insights from './views/Insights';
import { useRecurring } from './hooks/useRecurring';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <span className="text-white font-extrabold text-base font-display">Q</span>
        </div>
        <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </motion.div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [showApp, setShowApp] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Subscribe to Firestore
  useEffect(() => {
    if (!user) { setTransactions([]); setCategories([]); setGoals([]); setBudgets([]); setGamification(null); setDataLoading(false); return; }
    setDataLoading(true);
    let loaded = 0;
    const check = () => { loaded++; if (loaded >= 5) setDataLoading(false); };

    const u1 = TxCtrl.subscribe(user.uid, d => { setTransactions(d); check(); });
    const u2 = CatCtrl.subscribe(user.uid, d => {
      if (d.length === 0) DEFAULT_CATEGORIES.forEach(c => CatCtrl.create(user.uid, c, []));
      setCategories(d.length > 0 ? d : DEFAULT_CATEGORIES); check();
    });
    const u3 = GoalCtrl.subscribe(user.uid, d => { setGoals(d); check(); });
    const u4 = BudgetCtrl.subscribe(user.uid, d => { setBudgets(d); check(); });
    const u5 = GamCtrl.subscribe(user.uid, d => {
      setGamification(d);
      if (d) GamCtrl.updateStreak(user.uid, d);
      check();
    });

    const t = setTimeout(() => setDataLoading(false), 5000);
    return () => { u1(); u2(); u3(); u4(); u5(); clearTimeout(t); };
  }, [user]);

  // Plan limits
  const userPlan = gamification?.plan || 'free';
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
  const monthKey = (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`; })();
  const monthTxCount = transactions.filter(t => t.date?.startsWith(monthKey)).length;

  // Auto-create recurring transactions for current month
  useRecurring(user?.uid, transactions, { monthCount: monthTxCount, limit: limits.transactions });

  // Handlers with plan enforcement
  const hAddTx = useCallback(async d => {
    const r = await TxCtrl.create(user?.uid, d, { monthCount: monthTxCount, limit: limits.transactions });
    if (r.success && user) GamCtrl.addXP(user.uid, 'ADD_TRANSACTION', gamification);
    return r;
  }, [user, gamification, monthTxCount, limits]);
  const hUpdTx = useCallback(async (id, d) => TxCtrl.update(id, d), []);
  const hDelTx = useCallback(async id => TxCtrl.remove(id), []);

  const hAddCat = useCallback(async d => CatCtrl.create(user?.uid, d, categories, limits.categories), [user, categories, limits]);
  const hUpdCat = useCallback(async (id, d) => CatCtrl.update(id, d, categories), [categories]);
  const hDelCat = useCallback(async id => CatCtrl.remove(id), []);

  const hAddGoal = useCallback(async d => GoalCtrl.create(user?.uid, d, goals, limits.goals), [user, goals, limits]);
  const hUpdGoal = useCallback(async (id, d) => GoalCtrl.update(id, d), []);
  const hDelGoal = useCallback(async id => GoalCtrl.remove(id), []);

  const hAddBudget = useCallback(async d => {
    const r = await BudgetCtrl.create(user?.uid, d, { count: (budgets || []).length, limit: limits.budgets });
    if (r.success && user) GamCtrl.addXP(user.uid, 'SET_BUDGET', gamification);
    return r;
  }, [user, gamification, budgets, limits]);
  const hUpdBudget = useCallback(async (id, d) => BudgetCtrl.update(id, d), []);
  const hDelBudget = useCallback(async id => BudgetCtrl.remove(id), []);

  // Render
  if (authLoading) return <LoadingScreen />;
  if (!user && !showApp) return <LandingPage onEnter={() => setShowApp(true)} />;
  if (!user) return <AuthPage />;
  if (dataLoading) return <LoadingScreen />;

  const budgetAlerts = (budgets || []).map(b => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === b.category && t.date?.startsWith(
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    )).reduce((s, t) => s + (t.amount || 0), 0);
    return { ...b, triggered: b.limitAmount > 0 && (spent / b.limitAmount) * 100 >= (b.alertAt || 80) };
  });

  const pages = {
    dashboard: <Dashboard transactions={transactions} categories={categories} goals={goals} gamification={gamification} />,
    transactions: <Transactions transactions={transactions} categories={categories} goals={goals} onAdd={hAddTx} onUpdate={hUpdTx} onDelete={hDelTx} />,
    categories: <Categories categories={categories} onAdd={hAddCat} onUpdate={hUpdCat} onDelete={hDelCat} />,
    goals: <Goals goals={goals} transactions={transactions} onAdd={hAddGoal} onUpdate={hUpdGoal} onDelete={hDelGoal} />,
    budgets: <Budgets budgets={budgets} transactions={transactions} categories={categories} onAdd={hAddBudget} onUpdate={hUpdBudget} onDelete={hDelBudget} />,
    insights: <Insights transactions={transactions} budgets={budgets} categories={categories} />,
    achievements: <Achievements gamification={gamification} />,
    education: <Education />,
    market: <Market userPlan={userPlan} />,
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} alerts={budgetAlerts}>
      <motion.div key={activePage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {pages[activePage]}
      </motion.div>
    </Layout>
  );
}
