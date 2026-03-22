import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Shield, AlertTriangle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CategoryBadge } from '../utils/icons';
import { LIMITS } from '../utils/validators';

function BudgetModal({ isOpen, onClose, onSave, editData, categories }) {
  const [form, setForm] = useState({ category:'', limitAmount:'', alertAt:80 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(()=>{ if(isOpen){ setForm(editData?{category:editData.category||'',limitAmount:editData.limitAmount||'',alertAt:editData.alertAt||80}:{category:'',limitAmount:'',alertAt:80}); setError(''); setSaving(false); } },[isOpen,editData]);
  const handleSubmit = async e => { e.preventDefault(); setError(''); setSaving(true); const r=await onSave(form); if(r&&!r.success){setError(r.error);setSaving(false);}else{setSaving(false);onClose();} };
  if(!isOpen) return null;
  return (
    <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} onClick={e=>e.stopPropagation()} className="card w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'var(--border)'}}><h3 className="text-lg font-bold font-display" style={{color:'var(--text-primary)'}}>{editData?'Editar':'Novo'} Limite</h3><button onClick={onClose} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><X className="w-4 h-4"/></button></div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Categoria</label>
            <select className="input-field" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required>
              <option value="">Selecione...</option>
              {categories.filter(c=>c.type==='expense'||c.type==='both').map(c=>(<option key={c.name} value={c.name}>{c.name}</option>))}
            </select></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Limite mensal (R$)</label><input type="number" className="input-field font-mono" value={form.limitAmount} onChange={e=>setForm(f=>({...f,limitAmount:e.target.value}))} min={LIMITS.AMOUNT_MIN} max={LIMITS.AMOUNT_MAX} step="0.01" required/></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Alertar quando atingir (%)</label>
            <div className="flex items-center gap-3"><input type="range" min="50" max="100" step="5" value={form.alertAt} onChange={e=>setForm(f=>({...f,alertAt:Number(e.target.value)}))} className="flex-1 accent-emerald-500"/><span className="text-sm font-mono w-10 text-right" style={{color:'var(--text-primary)'}}>{form.alertAt}%</span></div></div>
          {error&&<p className="text-sm p-2.5 rounded-lg" style={{background:'var(--danger-light)',color:'var(--danger)'}}>{error}</p>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button><button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving?'...':editData?'Salvar':'Criar'}</button></div>
        </form>
      </motion.div>
    </motion.div></AnimatePresence>
  );
}

export default function Budgets({ budgets, transactions, categories, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const monthKey = useMemo(()=>{const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`;},[]);

  const budgetsWithSpent = useMemo(()=>
    (budgets||[]).map(b=>{
      const spent = transactions.filter(t=>t.type==='expense'&&t.category===b.category&&t.date?.startsWith(monthKey)).reduce((s,t)=>s+(t.amount||0),0);
      const pct = b.limitAmount>0?Math.min((spent/b.limitAmount)*100,100):0;
      const status = pct>=100?'over':pct>=(b.alertAt||80)?'warning':'ok';
      return {...b,spent,pct,status,remaining:Math.max(b.limitAmount-spent,0)};
    })
  ,[budgets,transactions,monthKey]);

  const overCount = budgetsWithSpent.filter(b=>b.status==='over').length;
  const warnCount = budgetsWithSpent.filter(b=>b.status==='warning').length;
  const handleSave = async d => editItem?await onUpdate(editItem.id,d):await onAdd(d);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-display" style={{color:'var(--text-primary)'}}>Orçamentos</h1><p className="text-sm mt-0.5" style={{color:'var(--text-secondary)'}}>Limites de gastos por categoria</p></div>
        <button onClick={()=>{setEditItem(null);setShowModal(true);}} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Novo Limite</button>
      </div>

      {(overCount>0||warnCount>0)&&(
        <div className="card p-4 flex items-center gap-3" style={{borderColor:overCount>0?'var(--danger)':'#f59e0b'}}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{color:overCount>0?'var(--danger)':'#f59e0b'}}/>
          <div><p className="text-sm font-medium" style={{color:'var(--text-primary)'}}>{overCount>0?`${overCount} categoria${overCount>1?'s':''} estourou o limite!`:''}{overCount>0&&warnCount>0?' · ':''}{warnCount>0?`${warnCount} perto do limite`:''}</p>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Revise seus gastos neste mês</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {budgetsWithSpent.length===0?(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="md:col-span-2 card p-12 text-center"><Shield className="w-10 h-10 mx-auto mb-3" style={{color:'var(--text-muted)'}}/><p style={{color:'var(--text-muted)'}}>Nenhum limite definido</p><p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Defina limites para receber alertas quando gastar demais</p></motion.div>)
          :budgetsWithSpent.map((b,i)=>{
            const barColor = b.status==='over'?'#ef4444':b.status==='warning'?'#f59e0b':'#10b981';
            return(
            <motion.div key={b.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card p-5 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><CategoryBadge name={b.category}/><div><p className="font-medium" style={{color:'var(--text-primary)'}}>{b.category}</p><p className="text-xs" style={{color:'var(--text-muted)'}}>Limite: {formatCurrency(b.limitAmount)}</p></div></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>{setEditItem(b);setShowModal(true);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Pencil className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>{if(confirm('Excluir?'))onDelete(b.id);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              <div className="mb-3"><div className="flex justify-between text-xs mb-1.5"><span style={{color:'var(--text-muted)'}}>Gasto este mês</span><span className="font-mono font-semibold" style={{color:barColor}}>{b.pct.toFixed(0)}%</span></div>
                <div className="h-3 rounded-full overflow-hidden" style={{background:'var(--bg-tertiary)'}}><motion.div initial={{width:0}} animate={{width:`${b.pct}%`}} transition={{duration:0.8}} className="h-full rounded-full" style={{backgroundColor:barColor}}/></div>
              </div>
              <div className="flex justify-between text-sm">
                <div><span className="text-xs" style={{color:'var(--text-muted)'}}>Gasto</span><p className="font-mono font-semibold" style={{color:barColor}}>{formatCurrency(b.spent)}</p></div>
                <div className="text-right"><span className="text-xs" style={{color:'var(--text-muted)'}}>Resta</span><p className="font-mono font-semibold" style={{color:'var(--text-primary)'}}>{formatCurrency(b.remaining)}</p></div>
              </div>
              {b.status==='over'&&<div className="mt-3 flex items-center gap-2 p-2 rounded-lg" style={{background:'var(--danger-light)'}}><AlertTriangle className="w-3.5 h-3.5" style={{color:'var(--danger)'}}/><span className="text-xs font-medium" style={{color:'var(--danger)'}}>Limite ultrapassado!</span></div>}
              {b.status==='warning'&&<div className="mt-3 flex items-center gap-2 p-2 rounded-lg" style={{background:'rgba(245,158,11,0.1)'}}><AlertTriangle className="w-3.5 h-3.5" style={{color:'#f59e0b'}}/><span className="text-xs font-medium" style={{color:'#f59e0b'}}>Atenção: {b.pct.toFixed(0)}% do limite</span></div>}
            </motion.div>);})}
        </AnimatePresence>
      </div>
      <BudgetModal isOpen={showModal} onClose={()=>{setShowModal(false);setEditItem(null);}} onSave={handleSave} editData={editItem} categories={categories}/>
    </div>
  );
}
