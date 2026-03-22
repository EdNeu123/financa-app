import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { PLANS } from '../utils/constants';
import {
  TrendingUp, BarChart3, Shield, Target, Zap, Globe, Bell,
  Trophy, BookOpen, LineChart, ArrowRight, Check, Sun, Moon,
  Smartphone, Star, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { icon: BarChart3,  title: 'Dashboard inteligente',     desc: 'Visualize receitas, despesas e tendências com gráficos interativos em tempo real.' },
  { icon: Shield,     title: 'Segurança em duas camadas', desc: 'Validação no cliente e no servidor. Seus dados nunca ficam vulneráveis.' },
  { icon: Target,     title: 'Metas financeiras',         desc: 'Defina objetivos, vincule receitas e acompanhe o progresso automaticamente.' },
  { icon: Bell,       title: 'Alertas de gastos',         desc: 'Receba alertas quando se aproximar dos limites de orçamento por categoria.' },
  { icon: Trophy,     title: 'Sistema de conquistas',     desc: 'Ganhe XP, suba de nível e desbloqueie conquistas por manter suas finanças em dia.' },
  { icon: LineChart,  title: 'Ibovespa em tempo real',    desc: 'Acompanhe o mercado e receba sugestões de ações baseadas em notícias.' },
  { icon: BookOpen,   title: 'Hub educacional',           desc: 'Aprenda sobre investimentos, economia e finanças pessoais.' },
  { icon: Zap,        title: 'Orçamentos por categoria',  desc: 'Defina limites mensais e veja em tempo real quanto já gastou.' },
];

const STATS = [
  { value: '15+', label: 'Funcionalidades' },
  { value: '2x', label: 'Camadas de segurança' },
  { value: '100%', label: 'Responsivo' },
  { value: '0', label: 'Anúncios' },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function LandingPage({ onEnter }) {
  const { theme, toggle } = useTheme();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: 'var(--border)', background: theme === 'dark' ? 'rgba(11,15,25,0.8)' : 'rgba(255,255,255,0.8)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>Finança</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={onEnter} className="btn-primary !px-5 !py-2.5 text-sm flex items-center gap-2">
              Entrar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.15), transparent)'
            : 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.08), transparent)'
        }} />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Zap className="w-3 h-3" /> Novo: Ibovespa em tempo real + Sugestões com IA
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display leading-[1.1] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}>
              Finanças pessoais,{' '}
              <span style={{ color: 'var(--accent)' }}>reinventadas.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Dashboard inteligente, metas com progresso automático, alertas de gastos,
              sistema de conquistas e mercado financeiro — tudo em uma interface que você vai querer usar todos os dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onEnter} className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2">
                Começar grátis <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#features" className="btn-ghost text-base px-8 py-4 flex items-center justify-center gap-2 !rounded-xl">
                Ver funcionalidades <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="text-center py-4 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-2xl md:text-3xl font-extrabold font-display" style={{ color: 'var(--accent)' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Funcionalidades</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
              Tudo que você precisa para dominar suas finanças
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="card p-6 group cursor-default">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: 'var(--accent-light)' }}>
                  <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Preços</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4" style={{ color: 'var(--text-primary)' }}>
              Escolha seu plano
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-sm" style={{ color: annual ? 'var(--text-muted)' : 'var(--text-primary)' }}>Mensal</span>
              <button onClick={() => setAnnual(!annual)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ background: annual ? 'var(--accent)' : 'var(--border)' }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ left: annual ? '26px' : '2px' }} />
              </button>
              <span className="text-sm" style={{ color: annual ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                Anual <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>-20%</span>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => {
              const price = annual ? Math.round(plan.price * 0.8 * 100) / 100 : plan.price;
              const label = price === 0 ? 'Grátis' : `R$ ${price.toFixed(2).replace('.', ',')}/mês`;
              return (
                <motion.div key={plan.id} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="card p-7 relative flex flex-col"
                  style={plan.popular ? { borderColor: 'var(--accent)', borderWidth: '2px' } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: 'var(--accent)' }}>
                      Mais popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
                      {price === 0 ? 'R$ 0' : `R$ ${Math.floor(price)}`}
                    </span>
                    {price > 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>,{String(Math.round((price % 1) * 100)).padStart(2, '0')}/mês</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onEnter}
                    className={plan.popular ? 'btn-primary w-full' : 'btn-ghost w-full !py-3'}>
                    {plan.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4" style={{ color: 'var(--text-primary)' }}>
              Comece a transformar suas finanças hoje
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Grátis para começar. Sem cartão de crédito.
            </p>
            <button onClick={onEnter} className="btn-primary text-base px-10 py-4">
              Criar conta grátis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold font-display text-sm" style={{ color: 'var(--text-primary)' }}>Finança</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Finança. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
