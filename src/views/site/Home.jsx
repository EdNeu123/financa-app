import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Brain, Users, TrendingUp, Shield, Star, Zap, Target, BarChart3 } from 'lucide-react';
import { DashboardMockup, PhoneMockup } from './Visuals';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } };

const PROOF = [
  { icon: Users, num: '66%', text: 'dos brasileiros usam apps financeiros', sub: 'Febraban 2025' },
  { icon: TrendingUp, num: '42M+', text: 'pessoas no Open Finance', sub: 'Banco Central 2024' },
  { icon: Star, num: '11,5%', text: 'de jovens 18-25 inadimplentes', sub: 'Serasa 2025' },
];

const HIGHLIGHTS = [
  { icon: Brain, title: 'IA que entende seu dinheiro', desc: 'Análise personalizada de gastos com score de saúde financeira.' },
  { icon: Target, title: 'Metas que funcionam de verdade', desc: 'O dinheiro guardado sai do seu saldo. Zero ilusão.' },
  { icon: Shield, title: 'Segurança que não negocia', desc: 'Dupla validação: client + servidor. Nem por DevTools.' },
  { icon: Zap, title: 'Gamificação que vicia', desc: 'XP, níveis, conquistas. Cuidar do dinheiro recompensa.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto">

            {/* Urgência + Novidade */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Brain className="w-3.5 h-3.5" /> Novo: análise de gastos e sugestões de ações com IA
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display leading-[1.05] tracking-tight mb-6">
              Cada real<br />
              <span style={{ color: 'var(--accent)' }}>no lugar certo.</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              O app de finanças pessoais que você vai querer abrir todo dia.
              Dashboard inteligente, metas reais, gamificação e mercado ao vivo.
            </p>

            {/* Prova social inline */}
            <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
              Junte-se aos milhões de brasileiros que já controlam suas finanças digitalmente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/entrar" className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2">
                Começar grátis — leva 10 segundos <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/funcionalidades" className="btn-ghost text-base px-8 py-4 flex items-center justify-center gap-2 !rounded-xl">
                Ver tudo que faz <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Redutor de objeção */}
            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              Sem cartão de crédito. Sem período de teste. Grátis de verdade.
            </p>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 md:mt-20">
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROOF.map((p, i) => (
            <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                <p.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="text-xl font-extrabold font-display" style={{ color: 'var(--accent)' }}>{p.num}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.text}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights — 4 diferenciais com gatilhos */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Por que Quanto?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">O que nenhum outro app de finanças faz</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.08 }} className="card p-7 flex gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                  <h.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{h.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final com escassez + visual */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="hidden md:block"><PhoneMockup /></div>
            <motion.div {...fade} className="flex-1 text-center md:text-left">
              <BarChart3 className="w-10 h-10 mb-4 md:mx-0 mx-auto" style={{ color: 'var(--accent)' }} />
              <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-3">
                Enquanto você pensa,<br />seu dinheiro não espera.
              </h2>
              <p className="text-base mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Cada dia sem controle é um dia que seus gastos decidem por você. Comece agora — é grátis.
              </p>
              <Link to="/entrar" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
                Criar minha conta <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
