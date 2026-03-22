import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { CategoryBadge, ICON_OPTIONS } from '../utils/icons';
import { COLOR_OPTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

function CategoryModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState({ name:'', iconKey:'outros', type:'expense', color:'#3b82f6' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if(isOpen){ setForm(editData?{name:editData.name||'',iconKey:editData.iconKey||'outros',type:editData.type||'expense',color:editData.color||'#3b82f6'}:{name:'',iconKey:'outros',type:'expense',color:'#3b82f6'}); setError(''); setSaving(false); } }, [isOpen, editData]);
  const handleSubmit = async e => { e.preventDefault(); setError(''); setSaving(true); const r=await onSave(form); if(r&&!r.success){setError(r.error);setSaving(false);}else{setSaving(false);onClose();} };
  if(!isOpen) return null;
  return (
    <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} onClick={e=>e.stopPropagation()} className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'var(--border)'}}><h3 className="text-lg font-bold font-display" style={{color:'var(--text-primary)'}}>{editData?'Editar':'Nova'} Categoria</h3><button onClick={onClose} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><X className="w-4 h-4"/></button></div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="flex justify-center"><CategoryBadge iconKey={form.iconKey} color={form.color} size="xl"/></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Nome</label><input type="text" className="input-field" placeholder="Nome da categoria" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} maxLength={LIMITS.STRING_MAX_SHORT} required/></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Tipo</label>
            <div className="flex gap-2">{[{id:'expense',l:'Despesa'},{id:'income',l:'Receita'},{id:'both',l:'Ambos'}].map(t=>(<button key={t.id} type="button" onClick={()=>setForm(f=>({...f,type:t.id}))} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all" style={{borderColor:form.type===t.id?'var(--accent)':'var(--border)',background:form.type===t.id?'var(--accent-light)':'transparent',color:form.type===t.id?'var(--accent)':'var(--text-secondary)'}}>{t.l}</button>))}</div></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Ícone</label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">{ICON_OPTIONS.map(opt=>{const I=opt.icon;return(<button key={opt.key} type="button" onClick={()=>setForm(f=>({...f,iconKey:opt.key}))} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{background:form.iconKey===opt.key?'var(--accent-light)':'var(--bg-tertiary)',border:form.iconKey===opt.key?'2px solid var(--accent)':'2px solid transparent'}}><I className="w-4 h-4" style={{color:form.iconKey===opt.key?'var(--accent)':opt.color}}/></button>);})}</div></div>
          <div><label className="text-xs mb-1.5 block" style={{color:'var(--text-muted)'}}>Cor</label>
            <div className="flex flex-wrap gap-2">{COLOR_OPTIONS.map(c=>(<button key={c} type="button" onClick={()=>setForm(f=>({...f,color:c}))} className="w-7 h-7 rounded-full transition-all" style={{backgroundColor:c,outline:form.color===c?'2px solid var(--text-primary)':'none',outlineOffset:'2px'}}/>))}</div></div>
          {error&&<p className="text-sm p-2.5 rounded-lg" style={{background:'var(--danger-light)',color:'var(--danger)'}}>{error}</p>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button><button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving?'...':editData?'Salvar':'Criar'}</button></div>
        </form>
      </motion.div>
    </motion.div></AnimatePresence>
  );
}

export default function Categories({ categories, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = categories.filter(c=>filter==='all'||c.type===filter||c.type==='both');
  const handleSave = async d => editItem ? await onUpdate(editItem.id, d) : await onAdd(d);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-display" style={{color:'var(--text-primary)'}}>Categorias</h1><p className="text-sm mt-0.5" style={{color:'var(--text-secondary)'}}>{categories.length}/{LIMITS.CATEGORIES_MAX} categorias</p></div>
        <button onClick={()=>{setEditItem(null);setShowModal(true);}} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Nova</button>
      </div>
      <div className="flex gap-2">{[{id:'all',l:'Todas'},{id:'expense',l:'Despesas'},{id:'income',l:'Receitas'}].map(f=>(<button key={f.id} onClick={()=>setFilter(f.id)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{background:filter===f.id?'var(--accent-light)':'var(--bg-secondary)',color:filter===f.id?'var(--accent)':'var(--text-secondary)',border:`1px solid ${filter===f.id?'var(--accent)':'var(--border)'}`}}>{f.l}</button>))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">{filtered.map((cat,i)=>(
          <motion.div key={cat.id||cat.name} layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{delay:Math.min(i*0.04,0.2)}} className="card p-4 group">
            <div className="flex items-center gap-3">
              <CategoryBadge iconKey={cat.iconKey} name={cat.name} color={cat.color} size="lg"/>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{color:'var(--text-primary)'}}>{cat.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-md inline-block mt-0.5" style={{background:cat.type==='income'?'rgba(16,185,129,0.1)':cat.type==='expense'?'rgba(239,68,68,0.1)':'var(--bg-tertiary)',color:cat.type==='income'?'#10b981':cat.type==='expense'?'#ef4444':'var(--text-muted)'}}>{cat.type==='income'?'Receita':cat.type==='expense'?'Despesa':'Ambos'}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>{setEditItem(cat);setShowModal(true);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Pencil className="w-3.5 h-3.5"/></button>
                <button onClick={()=>{if(confirm('Excluir?'))onDelete(cat.id);}} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            </div>
          </motion.div>))}</AnimatePresence>
      </div>
      <CategoryModal isOpen={showModal} onClose={()=>{setShowModal(false);setEditItem(null);}} onSave={handleSave} editData={editItem}/>
    </div>
  );
}
