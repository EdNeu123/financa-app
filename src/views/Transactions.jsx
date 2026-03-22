import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Trash2, Pencil, Target, Download, Repeat } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CategoryBadge, ICON_OPTIONS } from '../utils/icons';
import { TAG_SUGGESTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

function TransactionModal({ isOpen, onClose, onSave, editData, categories, goals }) {
  const [form, setForm] = useState({ type:'expense', description:'', amount:'', category:'', date:new Date().toISOString().split('T')[0], tags:[], notes:'', goalId:null, recurring:false });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(editData ? { type:editData.type||'expense', description:editData.description||'', amount:editData.amount||'', category:editData.category||'', date:editData.date||new Date().toISOString().split('T')[0], tags:Array.isArray(editData.tags)?editData.tags:[], notes:editData.notes||'', goalId:editData.goalId||null, recurring:!!editData.recurring }
        : { type:'expense', description:'', amount:'', category:'', date:new Date().toISOString().split('T')[0], tags:[], notes:'', goalId:null, recurring:false });
      setError(''); setSaving(false); setTagInput('');
    }
  }, [isOpen, editData]);

  const filteredCats = categories.filter(c => c.type === form.type || c.type === 'both');
  const addTag = r => { const t = r.trim().toLowerCase().slice(0,LIMITS.TAG_LENGTH_MAX); if(t&&!form.tags.includes(t)&&form.tags.length<LIMITS.TAGS_MAX) setForm(f=>({...f,tags:[...f.tags,t]})); setTagInput(''); };
  const handleSubmit = async e => { e.preventDefault(); setError(''); setSaving(true); const r = await onSave({...form}); if(r&&!r.success){ setError(r.error||'Erro'); setSaving(false); } else { setSaving(false); onClose(); } };

  if (!isOpen) return null;
  return (
    <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} onClick={e=>e.stopPropagation()} className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'var(--border)'}}>
          <h3 className="text-lg font-bold font-display" style={{color:'var(--text-primary)'}}>{editData?'Editar':'Nova'} Transação</h3>
          <button onClick={onClose} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><X className="w-4 h-4"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex gap-2 p-1 rounded-xl" style={{background:'var(--bg-tertiary)'}}>
            {[{id:'expense',label:'Despesa',color:'#ef4444'},{id:'income',label:'Receita',color:'#10b981'},{id:'savings',label:'Guardar',color:'#8b5cf6'}].map(t=>(
              <button key={t.id} type="button" onClick={()=>setForm(f=>({...f,type:t.id,category:t.id==='savings'?'Reserva':f.category,goalId:t.id==='expense'?null:f.goalId}))}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{background:form.type===t.id?t.color+'20':'transparent',color:form.type===t.id?t.color:'var(--text-muted)'}}>
                {t.label}
              </button>))}
          </div>
          {form.type==='savings'&&(
            <div className="p-3 rounded-xl text-xs leading-relaxed" style={{background:'rgba(139,92,246,0.08)',color:'#8b5cf6'}}>
              O valor será reservado para a meta selecionada e descontado do seu saldo disponível.
            </div>
          )}
          {/* Goal selector — obrigatório para savings, opcional para income */}
          {(form.type==='savings'||form.type==='income')&&goals.length>0&&(
            <div><label className="text-xs mb-1.5 block flex items-center gap-1.5" style={{color:'var(--text-muted)'}}><Target className="w-3.5 h-3.5"/>{form.type==='savings'?'Meta (obrigatório)':'Vincular a meta (opcional)'}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {form.type!=='savings'&&<button type="button" onClick={()=>setForm(f=>({...f,goalId:null}))} className="flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all" style={{borderColor:!form.goalId?'var(--accent)':'var(--border)',background:!form.goalId?'var(--accent-light)':'var(--bg-secondary)',color:!form.goalId?'var(--accent)':'var(--text-muted)'}}>Nenhuma</button>}
                {goals.map(g=>(<button key={g.id} type="button" onClick={()=>setForm(f=>({...f,goalId:g.id}))} className="flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all truncate" style={{borderColor:form.goalId===g.id?'#8b5cf6':'var(--border)',background:form.goalId===g.id?'rgba(139,92,246,0.1)':'var(--bg-secondary)',color:form.goalId===g.id?'#8b5cf6':'var(--text-secondary)'}}>{g.name}</button>))}
              </div></div>)}
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Descrição</label><input type="text" className="input-field" placeholder="Ex: Supermercado..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} maxLength={LIMITS.STRING_MAX_MEDIUM} required/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Valor (R$)</label><input type="number" className="input-field font-mono" placeholder="0,00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} min={LIMITS.AMOUNT_MIN} max={LIMITS.AMOUNT_MAX} step="0.01" required/></div>
            <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Data</label><input type="date" className="input-field" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} min="2000-01-01" required/></div>
          </div>
          {form.type!=='savings'&&(
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Categoria</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{filteredCats.map(cat=>(
              <button key={cat.name} type="button" onClick={()=>setForm(f=>({...f,category:cat.name}))}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs transition-all"
                style={{borderColor:form.category===cat.name?'var(--accent)':'var(--border)',background:form.category===cat.name?'var(--accent-light)':'var(--bg-secondary)',color:form.category===cat.name?'var(--accent)':'var(--text-secondary)'}}>
                <CategoryBadge name={cat.name} size="sm" color={cat.color}/><span className="truncate w-full text-center">{cat.name}</span>
              </button>))}</div>
          </div>)}
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">{form.tags.map(tag=>(<span key={tag} className="badge text-xs" style={{background:'var(--accent-light)',color:'var(--accent)',borderColor:'transparent'}}>{tag}<button type="button" onClick={()=>setForm(f=>({...f,tags:f.tags.filter(t=>t!==tag)}))}><X className="w-3 h-3"/></button></span>))}</div>
            <input type="text" className="input-field" placeholder="Adicionar tag..." value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag(tagInput);}}} maxLength={LIMITS.TAG_LENGTH_MAX}/>
            <div className="flex flex-wrap gap-1 mt-2">{TAG_SUGGESTIONS.filter(s=>!form.tags.includes(s)).slice(0,6).map(s=>(<button key={s} type="button" onClick={()=>addTag(s)} className="text-xs px-2 py-0.5 rounded-md transition-colors" style={{background:'var(--bg-tertiary)',color:'var(--text-muted)'}}>+{s}</button>))}</div>
          </div>
          {/* Recurring toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{background:'var(--bg-secondary)'}}>
            <div>
              <p className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Transação recorrente</p>
              <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Repetir automaticamente todo mês</p>
            </div>
            <button type="button" onClick={()=>setForm(f=>({...f,recurring:!f.recurring}))}
              className="relative w-11 h-6 rounded-full transition-colors" style={{background:form.recurring?'var(--accent)':'var(--border)'}}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{left:form.recurring?'22px':'2px'}}/>
            </button>
          </div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Notas (opcional)</label><textarea className="input-field resize-none h-16" placeholder="Observações..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} maxLength={LIMITS.STRING_MAX_LONG}/></div>
          {error&&<p className="text-sm p-2.5 rounded-lg" style={{background:'var(--danger-light)',color:'var(--danger)'}}>{error}</p>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button><button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"/>:editData?'Salvar':'Adicionar'}</button></div>
        </form>
      </motion.div>
    </motion.div></AnimatePresence>
  );
}

export default function Transactions({ transactions, categories, goals, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(()=> transactions.filter(t => {
    const q = search.toLowerCase();
    const ms = !q || t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || t.tags?.some(tag=>tag.includes(q));
    const mt = typeFilter==='all' || t.type===typeFilter;
    return ms && mt;
  }), [transactions, search, typeFilter]);

  const handleSave = async d => editItem ? await onUpdate(editItem.id, d) : await onAdd(d);
  const handleExport = () => {
    const rows = [['Data','Tipo','Descrição','Categoria','Valor','Tags'].join(','),
      ...filtered.map(t=>[t.date,t.type==='income'?'Receita':'Despesa',`"${t.description}"`,t.category,t.amount,(t.tags||[]).join(';')].join(','))];
    const blob = new Blob([rows.join('\n')],{type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='transacoes.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-display" style={{color:'var(--text-primary)'}}>Transações</h1><p className="text-sm mt-0.5" style={{color:'var(--text-secondary)'}}>{filtered.length} registro{filtered.length!==1?'s':''}</p></div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-ghost flex items-center gap-2 text-sm"><Download className="w-4 h-4"/>CSV</button>
          <button onClick={()=>{setEditItem(null);setShowModal(true);}} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Nova</button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/><input type="text" className="input-field pl-11" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} maxLength={100}/></div>
        <div className="flex gap-2 flex-wrap">{[{id:'all',l:'Todos'},{id:'income',l:'Receitas'},{id:'expense',l:'Despesas'},{id:'savings',l:'Guardado'}].map(f=>(<button key={f.id} onClick={()=>setTypeFilter(f.id)} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{background:typeFilter===f.id?'var(--accent-light)':'var(--bg-secondary)',color:typeFilter===f.id?'var(--accent)':'var(--text-secondary)',border:`1px solid ${typeFilter===f.id?'var(--accent)':'var(--border)'}`}}>{f.l}</button>))}</div>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length===0?(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="card p-12 text-center"><p className="text-lg" style={{color:'var(--text-muted)'}}>Nenhuma transação</p></motion.div>)
          :filtered.map((tx,i)=>{
            const linkedGoal = tx.goalId ? goals?.find(g=>g.id===tx.goalId) : null;
            return (<motion.div key={tx.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}} transition={{delay:Math.min(i*0.02,0.2)}} className="card p-4 flex items-center gap-4 group">
              <CategoryBadge name={tx.category}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-sm font-medium truncate" style={{color:'var(--text-primary)'}}>{tx.description}</p>
                  {linkedGoal&&<span className="badge text-[10px]" style={{background:'var(--accent-light)',color:'var(--accent)',borderColor:'transparent'}}><Target className="w-2.5 h-2.5"/>{linkedGoal.name}</span>}
                  {tx.recurring&&<span className="badge text-[10px]" style={{background:'rgba(139,92,246,0.1)',color:'#8b5cf6',borderColor:'transparent'}}><Repeat className="w-2.5 h-2.5"/>recorrente</span>}
                  {tx.tags?.slice(0,2).map(tag=>(<span key={tag} className="badge text-[10px] hidden sm:inline-flex">{tag}</span>))}
                </div>
                <div className="flex items-center gap-2 mt-0.5"><span className="text-xs" style={{color:'var(--text-muted)'}}>{tx.category}</span><span style={{color:'var(--border)'}}>·</span><span className="text-xs" style={{color:'var(--text-muted)'}}>{formatDate(tx.date)}</span></div>
              </div>
              <span className="text-sm font-mono font-semibold whitespace-nowrap" style={{color:tx.type==='income'?'#10b981':tx.type==='savings'?'#8b5cf6':'#ef4444'}}>{tx.type==='income'?'+':tx.type==='savings'?'→':'-'}{formatCurrency(tx.amount)}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>{setEditItem(tx);setShowModal(true);}} className="p-2 rounded-lg transition-all" style={{color:'var(--text-muted)'}}><Pencil className="w-3.5 h-3.5"/></button>
                <button onClick={()=>{if(confirm('Excluir?'))onDelete(tx.id);}} className="p-2 rounded-lg transition-all" style={{color:'var(--text-muted)'}}><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            </motion.div>);})}
        </AnimatePresence>
      </div>
      <TransactionModal isOpen={showModal} onClose={()=>{setShowModal(false);setEditItem(null);}} onSave={handleSave} editData={editItem} categories={categories} goals={goals||[]}/>
    </div>
  );
}
