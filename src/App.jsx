import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import * as TransactionController from './controllers/TransactionController';
import * as CategoryController from './controllers/CategoryController';
import * as GoalController from './controllers/GoalController';
import { DEFAULT_CATEGORIES } from './utils/constants';
import AuthPage from './views/AuthPage';
import Layout from './views/Layout';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Categories from './views/Categories';
import Goals from './views/Goals';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Subscriptions via Controllers ──────────────────────────
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setCategories([]);
      setGoals([]);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    let loaded = 0;
    const check = () => { loaded++; if (loaded >= 3) setDataLoading(false); };

    const unsubTx = TransactionController.subscribe(user.uid, (data) => {
      setTransactions(data);
      check();
    });

    const unsubCat = CategoryController.subscribe(user.uid, (data) => {
      if (data.length === 0) {
        // Seed defaults via controller (each one is validated)
        DEFAULT_CATEGORIES.forEach(cat =>
          CategoryController.create(user.uid, cat, [])
        );
      }
      setCategories(data.length > 0 ? data : DEFAULT_CATEGORIES);
      check();
    });

    const unsubGoals = GoalController.subscribe(user.uid, (data) => {
      setGoals(data);
      check();
    });

    const timeout = setTimeout(() => setDataLoading(false), 5000);

    return () => {
      unsubTx();
      unsubCat();
      unsubGoals();
      clearTimeout(timeout);
    };
  }, [user]);

  // ── Handlers que retornam { success, error? } para as Views ──

  const handleAddTransaction = useCallback(async (data) => {
    return await TransactionController.create(user?.uid, data);
  }, [user]);

  const handleUpdateTransaction = useCallback(async (id, data) => {
    return await TransactionController.update(id, data);
  }, []);

  const handleDeleteTransaction = useCallback(async (id) => {
    return await TransactionController.remove(id);
  }, []);

  const handleAddCategory = useCallback(async (data) => {
    return await CategoryController.create(user?.uid, data, categories);
  }, [user, categories]);

  const handleUpdateCategory = useCallback(async (id, data) => {
    return await CategoryController.update(id, data, categories);
  }, [categories]);

  const handleDeleteCategory = useCallback(async (id) => {
    return await CategoryController.remove(id);
  }, []);

  const handleAddGoal = useCallback(async (data) => {
    return await GoalController.create(user?.uid, data, goals);
  }, [user, goals]);

  const handleUpdateGoal = useCallback(async (id, data) => {
    return await GoalController.update(id, data);
  }, []);

  const handleDeleteGoal = useCallback(async (id) => {
    return await GoalController.remove(id);
  }, []);

  // ── Render ─────────────────────────────────────────────────

  if (authLoading) return <LoadingScreen />;
  if (!user) return <AuthPage />;
  if (dataLoading) return <LoadingScreen />;

  const pages = {
    dashboard: <Dashboard transactions={transactions} categories={categories} goals={goals} />,
    transactions: (
      <Transactions
        transactions={transactions} categories={categories}
        onAdd={handleAddTransaction} onUpdate={handleUpdateTransaction} onDelete={handleDeleteTransaction}
      />
    ),
    categories: (
      <Categories
        categories={categories}
        onAdd={handleAddCategory} onUpdate={handleUpdateCategory} onDelete={handleDeleteCategory}
      />
    ),
    goals: (
      <Goals
        goals={goals} transactions={transactions}
        onAdd={handleAddGoal} onUpdate={handleUpdateGoal} onDelete={handleDeleteGoal}
      />
    ),
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <motion.div key={activePage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {pages[activePage]}
      </motion.div>
    </Layout>
  );
}
