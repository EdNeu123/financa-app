import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { PLANS } from '../../utils/constants';

const fade = { initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true} };

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fade} className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{color:'var(--accent)'}}>Preços</p>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display mb-4">Transparente e justo</h1>
          <p className="text-base max-w-lg mx-auto mb-6" style={{color:'var(--text-secondary)'}}>Comece grátis. Evolua quando fizer sentido. Sem surpresas.</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm" style={{color:annual?'var(--text-muted)':'var(--text-primary)'}}>Mensal</span>
            <button onClick={()=>setAnnual(!annual)} className="relative w-12 h-6 rounded-full transition-colors" style={{background:annual?'var(--accent)':'var(--border)'}}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{left:annual?'26px':'2px'}}/>
            </button>
            <span className="text-sm" style={{color:annual?'var(--text-primary)':'var(--text-muted)'}}>Anual <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md ml-1" style={{background:'var(--accent-light)',color:'var(--accent)'}}>-20%</span></span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan,i)=>{
            const price = annual?Math.round(plan.price*0.8*100)/100:plan.price;
            return (
              <motion.div key={plan.id} {...fade} transition={{delay:i*0.1}} className="card p-7 relative flex flex-col"
                style={plan.popular?{borderColor:'var(--accent)',borderWidth:'2px'}:{}}>
                {plan.popular&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{background:'var(--accent)'}}>Mais popular</div>}
                <div className="mb-6"><h3 className="text-lg font-bold font-display">{plan.name}</h3><p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>{plan.desc}</p></div>
                <div className="mb-6"><span className="text-4xl font-extrabold font-display">{price===0?'R$ 0':`R$ ${Math.floor(price)}`}</span>{price>0&&<span className="text-sm" style={{color:'var(--text-muted)'}}>/{annual?'mês (anual)':'mês'}</span>}</div>
                <ul className="space-y-3 mb-8 flex-1">{plan.features.map((f,j)=>(
                  <li key={j} className="flex items-start gap-2.5 text-sm" style={{color:'var(--text-secondary)'}}><Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:'var(--accent)'}}/>{f}</li>
                ))}</ul>
                <Link to="/entrar" className={plan.popular?'btn-primary w-full text-center':'btn-ghost w-full !py-3 text-center'}>{plan.cta}</Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fade} className="text-center mt-12">
          <p className="text-sm" style={{color:'var(--text-muted)'}}>Todos os planos incluem tema claro/escuro, conquistas e hub educacional.</p>
        </motion.div>
      </div>
    </div>
  );
}
