import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { PLANS } from '../utils/constants';
import {
  TrendingUp, BarChart3, Shield, Target, Zap, Globe, Bell,
  Trophy, BookOpen, LineChart, ArrowRight, Check, Sun, Moon,
  Brain, Repeat, Sparkles, ChevronDown, ChevronRight, Clock,
  Users, Star, Lock, Smartphone, Monitor, Award,
} from 'lucide-react';

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } };

const HERO_STATS = [
  { value: '16+', label: 'Funcionalidades' },
  { value: 'IA', label: 'Inteligência artificial' },
  { value: '2x', label: 'Segurança' },
  { value: '0', label: 'Anúncios' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Dashboard inteligente', desc: 'Receitas, despesas, guardado e disponível em tempo real com gráficos interativos.', color: '#0d9488' },
  { icon: Brain, title: 'Análise com IA', desc: 'Nossa IA analisa seus gastos e gera dicas personalizadas com score de saúde financeira.', color: '#8b5cf6' },
  { icon: Target, title: 'Metas com reserva real', desc: 'Guarde dinheiro para metas e ele sai do seu saldo disponível. Sem ilusão.', color: '#d97706' },
  { icon: Bell, title: 'Alertas inteligentes', desc: 'Ritmo acelerado? Orçamento estourando? O app avisa antes de virar problema.', color: '#ef4444' },
  { icon: Trophy, title: 'Gamificação', desc: 'XP, 8 níveis, conquistas e streaks diários. Cuidar do dinheiro vicia (do jeito bom).', color: '#eab308' },
  { icon: LineChart, title: 'Ibovespa em tempo real', desc: 'Cotações, sugestões de ações com IA e notícias do mercado em um só lugar.', color: '#3b82f6' },
  { icon: Sparkles, title: 'Tendências e projeção', desc: 'Detecta categorias subindo e projeta seus gastos do próximo mês automaticamente.', color: '#ec4899' },
  { icon: Repeat, title: 'Recorrências automáticas', desc: 'Marque uma vez, repete todo mês. Salário, aluguel, assinaturas — sem redigitar.', color: '#06b6d4' },
  { icon: Shield, title: 'Segurança dupla', desc: 'Validação no client + Firestore Rules no servidor. Nem pelo DevTools passa.', color: '#10b981' },
  { icon: BookOpen, title: 'Hub educacional', desc: 'Artigos e vídeos curados sobre investimentos, renda fixa e finanças pessoais.', color: '#f97316' },
  { icon: Lock, title: 'Orçamentos por categoria', desc: 'Defina limites mensais e acompanhe em tempo real quanto já gastou.', color: '#8b5cf6' },
  { icon: Award, title: 'Exportar CSV', desc: 'Baixe suas transações filtradas para planilhas quando precisar.', color: '#64748b' },
];

const STEPS = [
  { num: '01', title: 'Crie sua conta', desc: 'Conta Google ou email. 10 segundos.' },
  { num: '02', title: 'Registre suas receitas e despesas', desc: 'Manual ou recorrente. Categorize com ícones profissionais.' },
  { num: '03', title: 'Defina metas e orçamentos', desc: 'Guarde dinheiro de verdade e receba alertas quando exagerar.' },
  { num: '04', title: 'Acompanhe e evolua', desc: 'Dashboard, insights com IA, conquistas e projeções automáticas.' },
];

const COMPARISONS = [
  { feature: 'Dashboard com gráficos', us: true, others: true },
  { feature: 'Metas com reserva real', us: true, others: false },
  { feature: 'Gamificação (XP/níveis)', us: true, others: false },
  { feature: 'IA para análise de gastos', us: true, others: false },
  { feature: 'Ibovespa em tempo real', us: true, others: false },
  { feature: 'Sugestão de ações com IA', us: true, others: false },
  { feature: 'Alertas inteligentes', us: true, others: true },
  { feature: 'Transações recorrentes', us: true, others: true },
  { feature: 'Sem anúncios', us: true, others: false },
  { feature: 'Segurança server-side', us: true, others: false },
];

const FAQS = [
  { q: 'Preciso pagar para usar?', a: 'Não! O plano Básico é gratuito com 50 transações/mês, 8 categorias e 2 metas. Suficiente para começar a organizar suas finanças sem gastar nada.' },
  { q: 'Meus dados estão seguros?', a: 'Sim. Usamos autenticação criptografada e banco de dados com regras de segurança server-side. Cada usuário só acessa seus próprios dados, e toda entrada é validada em duas camadas (client + servidor).' },
  { q: 'Como funciona a IA?', a: 'Nossa inteligência artificial analisa seus padrões de gasto e gera dicas personalizadas. Na aba Mercado, ela interpreta cotações reais e sugere ações com base em análise fundamentalista e notícias do mercado.' },
  { q: 'O que é "Guardar para meta"?', a: 'Diferente de outros apps, quando você guarda dinheiro para uma meta, o valor SAI do seu saldo disponível. Seu saldo é: Receitas - Despesas - Guardado = Disponível. Sem ilusão.' },
  { q: 'Posso usar no celular?', a: 'Sim! O app é 100% responsivo e funciona em qualquer navegador. Desktop, tablet ou celular.' },
  { q: 'Como funcionam as conquistas?', a: 'Cada ação dá XP: registrar transação (+10), login diário (+25), completar meta (+200). Você sobe de nível de "Iniciante" até "Lenda" e desbloqueia conquistas especiais.' },
];

export default function LandingPage({ onEnter }) {
  const { theme, toggle } = useTheme();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: 'var(--border)', background: theme === 'dark' ? 'rgba(9,9,11,0.85)' : 'rgba(250,250,248,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <span className="text-white font-extrabold text-sm font-display">Q</span>
            </div>
            <span className="text-lg font-bold font-display tracking-tight">Quanto</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Funcionalidades', 'Como funciona', 'Preços', 'FAQ'].map(s => (
              <a key={s} href={`#${s.toLowerCase().replace(/\s/g, '-')}`} className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>{s}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={onEnter} className="btn-primary !px-5 !py-2 text-sm">Entrar</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: theme === 'dark'
          ? 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(13,148,136,0.12), transparent), radial-gradient(ellipse 30% 30% at 80% 20%, rgba(217,119,6,0.06), transparent)'
          : 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(13,148,136,0.06), transparent)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Brain className="w-3.5 h-3.5" /> Novo: IA integrada para análise de gastos e sugestões de ações
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display leading-[1.05] tracking-tight mb-6">
              Cada real<br />
              <span style={{ color: 'var(--accent)' }}>no lugar certo.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              O app de finanças que você vai querer abrir todo dia.
              Dashboard inteligente, metas reais, gamificação, mercado ao vivo e IA que entende seu dinheiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onEnter} className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2">
                Começar grátis <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#funcionalidades" className="btn-ghost text-base px-8 py-4 flex items-center justify-center gap-2 !rounded-xl">
                Explorar <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.5 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {HERO_STATS.map((s, i) => (
              <div key={i} className="text-center py-4 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-2xl md:text-3xl font-extrabold font-display" style={{ color: i === 1 ? 'var(--accent-2, var(--accent))' : 'var(--accent)' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { icon: Users, text: '66% dos brasileiros usam apps financeiros', sub: 'Febraban 2025' },
            { icon: Star, text: '11,5% dos inadimplentes têm 18-25 anos', sub: 'Serasa 2025' },
            { icon: Smartphone, text: '42M+ usam Open Finance no Brasil', sub: 'BCB 2024' },
          ].map((s, i) => (
            <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
              <s.icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <div className="text-left"><p className="text-sm font-medium">{s.text}</p><p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.sub}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Funcionalidades</p>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display">12 motivos para trocar de app</h2>
            <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Tudo que os outros prometem — mais tudo que eles não têm.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.04 }} className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color + '12' }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-2, var(--accent))' }}>Comparativo</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">Quanto vs outros apps</h2>
          </motion.div>
          <motion.div {...fade} className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Recurso</th>
                <th className="text-center p-4 font-bold" style={{ color: 'var(--accent)' }}>Quanto</th>
                <th className="text-center p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Outros</th>
              </tr></thead>
              <tbody>{COMPARISONS.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{c.feature}</td>
                  <td className="text-center p-4">{c.us ? <Check className="w-5 h-5 mx-auto" style={{ color: 'var(--accent)' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td className="text-center p-4">{c.others ? <Check className="w-5 h-5 mx-auto" style={{ color: 'var(--text-muted)' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Como funciona</p>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display">4 passos. Zero complicação.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }} className="card p-6 flex gap-5">
                <div className="text-4xl font-extrabold font-display leading-none" style={{ color: 'var(--accent)', opacity: 0.3 }}>{s.num}</div>
                <div><h3 className="font-semibold mb-1">{s.title}</h3><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preços" className="py-20 md:py-28" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Preços</p>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-4">Escolha seu plano</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-sm" style={{ color: annual ? 'var(--text-muted)' : 'var(--text-primary)' }}>Mensal</span>
              <button onClick={() => setAnnual(!annual)} className="relative w-12 h-6 rounded-full transition-colors" style={{ background: annual ? 'var(--accent)' : 'var(--border)' }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ left: annual ? '26px' : '2px' }} />
              </button>
              <span className="text-sm" style={{ color: annual ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                Anual <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md ml-1" style={{ background: 'var(--accent-2-light, var(--accent-light))', color: 'var(--accent-2, var(--accent))' }}>-20%</span>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => {
              const price = annual ? Math.round(plan.price * 0.8 * 100) / 100 : plan.price;
              const label = price === 0 ? 'Grátis' : `R$ ${price.toFixed(2).replace('.', ',')}/mês`;
              return (
                <motion.div key={plan.id} {...fade} transition={{ delay: i * 0.1 }}
                  className="card p-7 relative flex flex-col"
                  style={plan.popular ? { borderColor: 'var(--accent)', borderWidth: '2px' } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>Mais popular</div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold font-display">{plan.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold font-display">{price === 0 ? 'R$ 0' : `R$ ${Math.floor(price)}`}</span>
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
                  <button onClick={onEnter} className={plan.popular ? 'btn-primary w-full' : 'btn-ghost w-full !py-3'}>{plan.cta}</button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">Perguntas frequentes</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: 'var(--text-muted)', transform: openFaq === i ? 'rotate(180deg)' : '' }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0" style={{ background: theme === 'dark'
          ? 'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(13,148,136,0.08), transparent)'
          : 'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(13,148,136,0.04), transparent)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div {...fade}>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-4">
              Pronto para saber<br /><span style={{ color: 'var(--accent)' }}>quanto você controla?</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>Grátis para começar. Sem cartão. Sem pegadinha.</p>
            <button onClick={onEnter} className="btn-primary text-lg px-12 py-5">Criar conta grátis</button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="text-white font-extrabold text-xs font-display">Q</span>
              </div>
              <span className="font-bold font-display">Quanto</span>
            </div>
            <div className="flex gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <a href="#funcionalidades">Funcionalidades</a>
              <a href="#preços">Preços</a>
              <a href="#faq">FAQ</a>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Quanto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
