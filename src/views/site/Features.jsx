import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Target, Bell, Trophy, LineChart, Sparkles, Repeat, Shield, BookOpen, Lock, Award, ArrowRight, Check } from 'lucide-react';

const fade = { initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true,margin:'-40px'} };

const FEATURES = [
  { icon:BarChart3, title:'Dashboard inteligente', desc:'4 cards (receitas, despesas, guardado, disponível), gráfico de área, pizza por categoria, transações recentes e metas.', color:'#0d9488' },
  { icon:Brain, title:'Análise com IA', desc:'Score de saúde financeira, dicas personalizadas e sugestões de ações baseadas em dados reais de cotação.', color:'#8b5cf6' },
  { icon:Target, title:'Metas com reserva real', desc:'Guarde dinheiro para metas e ele é descontado do saldo disponível. Receitas - Despesas - Guardado = Disponível.', color:'#d97706' },
  { icon:Bell, title:'Alertas inteligentes', desc:'Detecta ritmo acelerado de gastos, orçamentos estourando e taxa de economia baixa antes de virar problema.', color:'#ef4444' },
  { icon:Trophy, title:'Gamificação completa', desc:'10 XP por transação, 25 por login diário, streaks, 8 níveis de Iniciante a Lenda, e 8 conquistas desbloqueáveis.', color:'#eab308' },
  { icon:LineChart, title:'Mercado em tempo real', desc:'Ibovespa, 10 ações monitoradas, sugestões do dia com IA e notícias do mercado via Google News.', color:'#3b82f6' },
  { icon:Sparkles, title:'Tendências e projeção', desc:'Compara seus gastos dos últimos 3 meses vs 3 anteriores e projeta o próximo mês com média ponderada.', color:'#ec4899' },
  { icon:Repeat, title:'Transações recorrentes', desc:'Marque uma vez e a transação se repete automaticamente todo mês. Ideal para salário, aluguel e assinaturas.', color:'#06b6d4' },
  { icon:Shield, title:'Segurança em duas camadas', desc:'Validação completa no client (validators.js) + regras no Firestore que bloqueiam valores negativos, XSS e bypass via DevTools.', color:'#10b981' },
  { icon:BookOpen, title:'Hub de educação financeira', desc:'10 artigos curados de fontes como B3, Tesouro Direto e Banco Central, mais 6 vídeos sobre investimentos.', color:'#f97316' },
  { icon:Lock, title:'Orçamentos por categoria', desc:'Defina limites mensais e acompanhe em tempo real. Barra visual mostra quanto já gastou e alerta quando passar.', color:'#8b5cf6' },
  { icon:Award, title:'Exportar para CSV', desc:'Baixe suas transações filtradas por tipo, período ou busca. Abra em qualquer planilha.', color:'#64748b' },
];

const COMP = [
  { feat:'Dashboard com gráficos', us:true, ot:true },
  { feat:'Metas com reserva real', us:true, ot:false },
  { feat:'Gamificação (XP/níveis)', us:true, ot:false },
  { feat:'IA para análise de gastos', us:true, ot:false },
  { feat:'Ibovespa em tempo real', us:true, ot:false },
  { feat:'Sugestão de ações com IA', us:true, ot:false },
  { feat:'Alertas inteligentes', us:true, ot:true },
  { feat:'Transações recorrentes', us:true, ot:true },
  { feat:'Sem anúncios', us:true, ot:false },
  { feat:'Segurança server-side', us:true, ot:false },
];

export default function Features() {
  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{color:'var(--accent)'}}>Funcionalidades</p>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display mb-4">Tudo que o Quanto faz por você</h1>
            <p className="text-base max-w-xl mx-auto" style={{color:'var(--text-secondary)'}}>12 funcionalidades reais. Sem promessa vazia — tudo implementado e funcionando.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f,i)=>(
              <motion.div key={i} {...fade} transition={{delay:i*0.04}} className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{background:f.color+'0d'}}><f.icon className="w-5 h-5" style={{color:f.color}}/></div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold font-display">Quanto vs outros apps</h2>
          </motion.div>
          <motion.div {...fade} className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
                <th className="text-left p-4 font-medium" style={{color:'var(--text-muted)'}}>Recurso</th>
                <th className="text-center p-4 font-bold" style={{color:'var(--accent)'}}>Quanto</th>
                <th className="text-center p-4 font-medium" style={{color:'var(--text-muted)'}}>Outros</th>
              </tr></thead>
              <tbody>{COMP.map((c,i)=>(
                <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
                  <td className="p-4" style={{color:'var(--text-secondary)'}}>{c.feat}</td>
                  <td className="text-center p-4">{c.us?<Check className="w-5 h-5 mx-auto" style={{color:'var(--accent)'}}/>:<span style={{color:'var(--text-muted)'}}>—</span>}</td>
                  <td className="text-center p-4">{c.ot?<Check className="w-5 h-5 mx-auto" style={{color:'var(--text-muted)'}}/>:<span style={{color:'var(--text-muted)'}}>—</span>}</td>
                </tr>))}</tbody>
            </table>
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/entrar" className="btn-primary inline-flex items-center gap-2">Começar grátis <ArrowRight className="w-4 h-4"/></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
