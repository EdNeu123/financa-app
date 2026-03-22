import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const fade = { initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true} };

const FAQS = [
  { q:'Preciso pagar para usar?', a:'Não! O plano Básico é gratuito com 50 transações/mês, 8 categorias e 2 metas. Suficiente para começar sem gastar nada.' },
  { q:'Meus dados estão seguros?', a:'Sim. Toda entrada é validada em duas camadas: primeiro no seu navegador, depois no servidor. Cada usuário só acessa seus próprios dados. Não vendemos informações e não exibimos anúncios.' },
  { q:'Como funciona a inteligência artificial?', a:'Nossa IA analisa seus padrões de gasto e gera dicas personalizadas com um score de saúde financeira. Na aba Mercado, ela interpreta cotações reais e sugere ações com base em análise fundamentalista.' },
  { q:'O que é "Guardar para meta"?', a:'Quando você guarda dinheiro para uma meta, o valor sai do seu saldo disponível. Seu saldo real é: Receitas − Despesas − Guardado = Disponível. Sem ilusão de que o dinheiro ainda está lá.' },
  { q:'Posso usar no celular?', a:'Sim. O app é 100% responsivo e funciona em qualquer navegador — desktop, tablet ou celular.' },
  { q:'O que são as conquistas?', a:'Cada ação dá XP: registrar transação (+10), login diário (+25), completar meta (+200). Você sobe de nível de "Iniciante" até "Lenda" e desbloqueia conquistas especiais.' },
  { q:'Vocês vendem meus dados?', a:'Não. Nunca. Nossa única receita vem das assinaturas. Seus dados financeiros são criptografados e nunca compartilhados com terceiros.' },
  { q:'Como funciona a transação recorrente?', a:'Ao criar uma transação, ative o toggle "Recorrente". No início de cada mês, o app verifica quais recorrências ainda não existem e as cria automaticamente.' },
  { q:'Posso cancelar a assinatura?', a:'Sim, a qualquer momento. Você volta para o plano Básico sem perder nenhum dado.' },
  { q:'Como as sugestões de ações funcionam?', a:'A IA recebe dados reais de cotação em tempo real e analisa com base em indicadores fundamentalistas, cenário macroeconômico e tendências. As sugestões são educacionais e não constituem recomendação de investimento.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div {...fade} className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{color:'var(--accent)'}}>FAQ</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display">Perguntas frequentes</h1>
          <p className="text-sm mt-3" style={{color:'var(--text-secondary)'}}>Não encontrou sua dúvida? Entre em contato pelo app.</p>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq,i)=>(
            <motion.div key={i} {...fade} transition={{delay:i*0.03}} className="card overflow-hidden">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm font-semibold pr-4" style={{color:'var(--text-primary)'}}>{faq.q}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{color:'var(--text-muted)',transform:open===i?'rotate(180deg)':''}}/>
              </button>
              {open===i&&<div className="px-5 pb-5"><p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{faq.a}</p></div>}
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/entrar" className="btn-primary inline-flex items-center gap-2">Começar grátis <ArrowRight className="w-4 h-4"/></Link>
        </div>
      </div>
    </div>
  );
}
