import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, Pencil, Trash2, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CategoryBadge, GOAL_ICON_OPTIONS } from '../utils/icons';
import { COLOR_OPTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

function GoalModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState({ name:'', target:'', iconKey:'target', color:'#22c55e', deadline:'', notes:'' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if(isOpen){ setForm(editData?{name:editData.name||'',target:editData.target||'',iconKey:editData.iconKey||'target',color:editData.color||'#22c55e',deadline:editData.deadline||'',notes:editData.notes||''}:{name:'',target:'',iconKey:'target',color:'#22c55e',deadline:'',notes:''}); setError(''); setSaving(false); }}, [isOpen, editData]);
  const handleSubmit = async e => { e.preventDefault(); setError(''); setSaving(true); const r = await onSave(form); if(r&&!r.success){setError(r.error);setSaving(false);}else{setSaving(false);onClose();} };
  if(!isOpen) return null;
  return (
    <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} onClick={e=>e.stopPropagation()} className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'var(--border)'}}><h3 className="text-lg font-bold font-display" style={{color:'var(--text-primary)'}}>{editData?'Editar':'Nova'} Meta</h3><button onClick={onClose} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><X className="w-4 h-4"/></button></div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="flex justify-center"><CategoryBadge iconKey={form.iconKey} color={form.color} size="xl"/></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Nome</label><input type="text" className="input-field" placeholder="Ex: Reserva de emergência" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} maxLength={LIMITS.STRING_MAX_SHORT} required/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Valor alvo (R$)</label><input type="number" className="input-field font-mono" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} min={LIMITS.AMOUNT_MIN} max={LIMITS.AMOUNT_MAX} step="0.01" required/></div>
            <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Prazo (opcional)</label><input type="date" className="input-field" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></div>
          </div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Ícone</label>
            <div className="flex flex-wrap gap-2">{GOAL_ICON_OPTIONS.map(opt=>{const I=opt.icon;return(<button key={opt.key} type="button" onClick={()=>setForm(f=>({...f,iconKey:opt.key}))} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{background:form.iconKey===opt.key?'var(--accent-light)':'var(--bg-tertiary)',border:form.iconKey===opt.key?'2px solid var(--accent)':'2px solid transparent'}}><I className="w-4 h-4" style={{color:form.iconKey===opt.key?'var(--accent)':opt.color}}/></button>);})}</div></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Cor</label><div className="flex flex-wrap gap-2">{COLOR_OPTIONS.map(c=>(<button key={c} type="button" onClick={()=>setForm(f=>({...f,color:c}))} className="w-7 h-7 rounded-full transition-all" style={{backgroundColor:c,outline:form.color===c?'2px solid var(--text-primary)':'none',outlineOffset:'2px'}}/>))}</div></div>
          {error&&<p className="text-sm p-2.5 rounded-lg" style={{background:'var(--danger-light)',color:'var(--danger)'}}>{error}</p>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button><button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving?'...':editData?'Salvar':'Criar'}</button></div>
        </form>
      </motion.div>
    </motion.div></AnimatePresence>
  );
}

export default function Goals({ goals, transactions, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const gp = useMemo(()=>goals.map(g=>{
    const saved = transactions.filter(t=>t.goalId===g.id).reduce((s,t)=>s+(t.type==='income'?(t.amount||0):-(t.amount||0)),0);
    const ss = Math.max(saved,0); const pct = g.target>0?Math.min((ss/g.target)*100,100):0;
    let dl=null; if(g.deadline){const diff=new Date(g.deadline+'T00:00:00')-new Date();dl=Math.max(Math.ceil(diff/864e5),0);}
    return {...g, saved:ss, progress:pct, remaining:Math.max(g.target-ss,0), daysLeft:dl};
  }),[goals,transactions]);
  const totalT=gp.reduce((s,g)=>s+(g.target||0),0); const totalS=gp.reduce((s,g)=>s+g.saved,0); const done=gp.filter(g=>g.progress>=100).length;
  const handleSave = async d => editItem ? await onUpdate(editItem.id,d) : await onAdd(d);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-display" style={{color:'var(--text-primary)'}}>Metas Financeiras</h1><p className="text-sm mt-0.5" style={{color:'var(--text-secondary)'}}>{goals.length}/{LIMITS.GOALS_MAX} metas</p></div>
        <button onClick={()=>{setEditItem(null);setShowModal(true);}} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Nova Meta</button>
      </div>
      {goals.length>0&&(<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4"><div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4" style={{color:'var(--accent)'}}/><span className="text-xs" style={{color:'var(--text-muted)'}}>Total em metas</span></div><p className="stat-value font-mono" style={{color:'var(--text-primary)'}}>{formatCurrency(totalT)}</p></div>
        <div className="card p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4" style={{color:'var(--accent)'}}/><span className="text-xs" style={{color:'var(--text-muted)'}}>Guardado</span></div><p className="stat-value font-mono" style={{color:'var(--accent)'}}>{formatCurrency(totalS)}</p></div>
        <div className="card p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4" style={{color:'var(--accent)'}}/><span className="text-xs" style={{color:'var(--text-muted)'}}>Concluídas</span></div><p className="stat-value font-mono" style={{color:'var(--text-primary)'}}>{done}<span className="text-sm" style={{color:'var(--text-muted)'}}> / {goals.length}</span></p></div>
      </div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {gp.length===0?(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="md:col-span-2 card p-12 text-center"><Target className="w-10 h-10 mx-auto mb-3" style={{color:'var(--text-muted)'}}/><p style={{color:'var(--text-muted)'}}>Nenhuma meta criada</p></motion.div>)
          :gp.map((g,i)=>(
            <motion.div key={g.id} layout initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:Math.min(i*0.06,0.2)}} className="card p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge iconKey={g.iconKey} color={g.color} size="lg"/>
                  <div><h3 className="font-semibold" style={{color:'var(--text-primary)'}}>{g.name}</h3>
                    {g.daysLeft!==null&&(<div className="flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" style={{color:'var(--text-muted)'}}/><span className="text-xs" style={{color:g.daysLeft<=30?'var(--danger)':'var(--text-muted)'}}>{g.daysLeft===0?'Prazo hoje!':`${g.daysLeft} dias`}</span></div>)}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>{setEditItem(g);setShowModal(true);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Pencil className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>{if(confirm('Excluir?'))onDelete(g.id);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              <div className="mb-3"><div className="flex justify-between text-xs mb-1.5"><span style={{color:'var(--text-muted)'}}>Progresso</span><span className="font-mono" style={{color:g.color}}>{g.progress.toFixed(1)}%</span></div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{background:'var(--bg-tertiary)'}}><motion.div initial={{width:0}} animate={{width:`${g.progress}%`}} transition={{duration:1}} className="h-full rounded-full" style={{backgroundColor:g.color}}/></div></div>
              <div className="flex justify-between text-sm"><div><span className="text-xs" style={{color:'var(--text-muted)'}}>Guardado</span><p className="font-mono font-semibold" style={{color:g.color}}>{formatCurrency(g.saved)}</p></div><div className="text-right"><span className="text-xs" style={{color:'var(--text-muted)'}}>Falta</span><p className="font-mono font-semibold" style={{color:'var(--text-primary)'}}>{formatCurrency(g.remaining)}</p></div></div>
              {g.progress>=100&&(<div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg" style={{background:'var(--accent-light)'}}><CheckCircle2 className="w-4 h-4" style={{color:'var(--accent)'}}/><span className="text-xs font-medium" style={{color:'var(--accent)'}}>Meta alcançada!</span></div>)}
            </motion.div>))}
        </AnimatePresence>
      </div>
      <GoalModal isOpen={showModal} onClose={()=>{setShowModal(false);setEditItem(null);}} onSave={handleSave} editData={editItem}/>
    </div>
  );
}
