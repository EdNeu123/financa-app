export const COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#94a3b8',
];

export const TAG_SUGGESTIONS = [
  'fixo', 'variável', 'urgente', 'recorrente', 'parcelado',
  'cartão', 'pix', 'dinheiro', 'débito', 'boleto',
];

export const DEFAULT_CATEGORIES = [
  { name: 'Alimentação', iconKey: 'alimentacao', type: 'expense', color: '#f97316' },
  { name: 'Transporte',  iconKey: 'transporte',  type: 'expense', color: '#3b82f6' },
  { name: 'Moradia',     iconKey: 'moradia',      type: 'expense', color: '#8b5cf6' },
  { name: 'Saúde',       iconKey: 'saude',        type: 'expense', color: '#ef4444' },
  { name: 'Educação',    iconKey: 'educacao',      type: 'expense', color: '#06b6d4' },
  { name: 'Lazer',       iconKey: 'lazer',         type: 'expense', color: '#ec4899' },
  { name: 'Tecnologia',  iconKey: 'tecnologia',    type: 'expense', color: '#6366f1' },
  { name: 'Assinaturas', iconKey: 'assinaturas',   type: 'expense', color: '#14b8a6' },
  { name: 'Mercado',     iconKey: 'mercado',       type: 'expense', color: '#ea580c' },
  { name: 'Salário',     iconKey: 'salario',       type: 'income',  color: '#22c55e' },
  { name: 'Freelance',   iconKey: 'freelance',     type: 'income',  color: '#10b981' },
  { name: 'Investimentos', iconKey: 'investimentos', type: 'income', color: '#84cc16' },
  { name: 'Outros',      iconKey: 'outros',        type: 'both',    color: '#94a3b8' },
];

export const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

// Gamification
export const XP_PER_ACTION = {
  ADD_TRANSACTION: 10,
  DAILY_LOGIN: 25,
  COMPLETE_GOAL: 200,
  STREAK_7: 100,
  STREAK_30: 500,
  SET_BUDGET: 30,
  READ_ARTICLE: 15,
};

export const LEVELS = [
  { level: 1,  title: 'Iniciante',     xpNeeded: 0,    color: '#94a3b8' },
  { level: 2,  title: 'Consciente',    xpNeeded: 100,  color: '#3b82f6' },
  { level: 3,  title: 'Organizador',   xpNeeded: 300,  color: '#06b6d4' },
  { level: 4,  title: 'Estrategista',  xpNeeded: 600,  color: '#8b5cf6' },
  { level: 5,  title: 'Investidor',    xpNeeded: 1200, color: '#22c55e' },
  { level: 6,  title: 'Expert',        xpNeeded: 2500, color: '#f59e0b' },
  { level: 7,  title: 'Mestre',        xpNeeded: 5000, color: '#ef4444' },
  { level: 8,  title: 'Lenda',         xpNeeded: 10000, color: '#eab308' },
];

export const ACHIEVEMENTS = [
  { id: 'first_tx',      title: 'Primeira transação',    desc: 'Registre sua primeira transação',     xp: 50,  icon: 'star' },
  { id: 'streak_7',      title: 'Semana perfeita',       desc: 'Use o app 7 dias seguidos',           xp: 100, icon: 'flame' },
  { id: 'streak_30',     title: 'Mês dedicado',          desc: 'Use o app 30 dias seguidos',          xp: 500, icon: 'crown' },
  { id: 'budget_master', title: 'Mestre do orçamento',   desc: 'Fique dentro do orçamento por 1 mês', xp: 200, icon: 'shield' },
  { id: 'goal_complete', title: 'Meta alcançada',        desc: 'Complete sua primeira meta',           xp: 300, icon: 'target' },
  { id: 'saver_1k',      title: 'Primeiro mil',          desc: 'Guarde R$ 1.000 em metas',            xp: 150, icon: 'piggy' },
  { id: 'categories_5',  title: 'Organizado',            desc: 'Crie 5 categorias personalizadas',    xp: 75,  icon: 'tag' },
  { id: 'learn_5',       title: 'Estudioso',             desc: 'Leia 5 artigos sobre finanças',       xp: 100, icon: 'book' },
];

// Limites reais por plano — enforced nos controllers
export const PLAN_LIMITS = {
  free: { transactions: 50, categories: 8, goals: 2, budgets: 3, market: false },
  pro:  { transactions: Infinity, categories: 50, goals: 30, budgets: 30, market: true },
};

export const PLANS = [
  {
    id: 'free',
    name: 'Básico',
    price: 0,
    priceLabel: 'Grátis',
    desc: 'Para começar a organizar suas finanças',
    features: [
      'Até 50 transações/mês',
      'Até 8 categorias',
      '2 metas financeiras',
      '3 orçamentos por categoria',
      'Dashboard com gráficos',
      'Sistema de conquistas e XP',
      'Tema claro e escuro',
      'Hub de educação financeira',
    ],
    cta: 'Começar grátis',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    priceLabel: 'R$ 19,90/mês',
    desc: 'Para quem leva finanças a sério',
    features: [
      'Transações ilimitadas',
      'Categorias ilimitadas',
      'Metas ilimitadas',
      'Orçamentos ilimitados',
      'Alertas de gastos avançados',
      'Exportar CSV',
      'Ibovespa em tempo real',
      'Sugestões de ações do dia',
      'Guardar dinheiro para metas',
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 39.90,
    priceLabel: 'R$ 39,90/mês',
    desc: 'O pacote completo para investidores',
    features: [
      'Tudo do Pro',
      'Transações recorrentes automáticas',
      'Análise de tendências por categoria',
      'Projeção de gastos com IA',
      'Sugestões de ações com IA',
      'Alertas inteligentes de gastos',
      'Score de saúde financeira',
    ],
    cta: 'Assinar Ultra',
    popular: false,
  },
];
