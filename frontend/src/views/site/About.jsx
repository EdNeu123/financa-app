import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Shield, Zap, Heart, ArrowRight } from 'lucide-react';
import { FloatingStats } from './Visuals';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const VALUES = [
  { icon: Target, title: 'Transparência radical', desc: 'Nunca prometemos o que não entregamos. O que está na página de preços existe no app — ponto.' },
  { icon: Shield, title: 'Seus dados são seus', desc: 'Não vendemos dados. Não mostramos anúncios. Nossa receita vem exclusivamente das assinaturas.' },
  { icon: Zap, title: 'Simplicidade com profundidade', desc: 'Fácil de usar no primeiro minuto. Poderoso o suficiente para quem quer ir além.' },
  { icon: Heart, title: 'Educação antes de tudo', desc: 'Um app de finanças que ensina finanças. Porque controle sem conhecimento é temporário.' },
];

export default function About() {
  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Sobre nós</p>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display mb-6">
              Construído por quem entende<br />que dinheiro é <span style={{ color: 'var(--accent)' }}>liberdade</span>.
            </h1>
          </motion.div>

          <motion.div {...fade} className="card p-8 md:p-10 mb-12">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: 'var(--text-primary)' }}>Nossa história</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                O Quanto nasceu de uma frustração real: apps de finanças que prometem muito
                e entregam uma planilha glorificada. Quem precisa de controle financeiro geralmente
                não tem tempo para configurar 47 categorias e importar extratos bancários manualmente.
              </p>
              <p>
                Queríamos algo diferente — um app que fosse honesto sobre o que faz, que tratasse
                dinheiro guardado como dinheiro que saiu do saldo (porque saiu), que tornasse o hábito
                de registrar gastos algo que você quer fazer (não uma obrigação), e que usasse inteligência
                artificial para realmente ajudar, não só como buzzword no marketing.
              </p>
              <p>
                Construímos o Quanto com três princípios: segurança sem compromisso (validação em duas camadas),
                transparência absoluta (cada feature listada no site funciona no app), e respeito pelo seu
                tempo (interface que vai direto ao ponto).
              </p>
            </div>
          </motion.div>

          <motion.div {...fade} className="card p-8 md:p-10 mb-12">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: 'var(--text-primary)' }}>O problema que resolvemos</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                O Brasil tem mais de 70 milhões de inadimplentes. Não por falta de dinheiro — por falta
                de visibilidade. A maioria das pessoas não sabe quanto gasta por categoria, não tem ideia
                de qual é sua taxa de economia, e não consegue responder "quanto eu posso gastar hoje sem
                comprometer o mês".
              </p>
              <p>
                O Quanto responde essa pergunta. Em tempo real. Com 4 números que mudam tudo:
                quanto entrou, quanto saiu, quanto está guardado, e quanto está disponível.
              </p>
            </div>
          </motion.div>

          {/* Visual: floating stat cards */}
          <motion.div {...fade} className="my-8">
            <FloatingStats />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold font-display">Nossos valores</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.08 }} className="card p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                  <v.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold font-display">Em números</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '16+', label: 'Funcionalidades reais' },
              { num: '58', label: 'Arquivos de código' },
              { num: '2', label: 'Camadas de segurança' },
              { num: '0', label: 'Features falsas no site' },
            ].map((s, i) => (
              <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }}
                className="text-center py-6 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-3xl font-extrabold font-display" style={{ color: 'var(--accent)' }}>{s.num}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fade}>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display mb-4">
              Quer fazer parte dessa história?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Crie sua conta e comece a tomar controle das suas finanças hoje.
            </p>
            <Link to="/entrar" className="btn-primary inline-flex items-center gap-2">
              Começar grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
