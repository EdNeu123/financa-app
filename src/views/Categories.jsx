import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2, Palette } from 'lucide-react';
import { EMOJI_OPTIONS, COLOR_OPTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

function CategoryModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState(() => editData || {
    name: '', icon: '📦', type: 'expense', color: '#3b82f6',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const result = await onSave(form);
    if (result && !result.success) {
      setError(result.error || 'Erro desconhecido');
      setSaving(false);
    } else {
      setSaving(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={e => e.stopPropagation()} className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h3 className="text-lg font-bold font-display">{editData ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: form.color + '20' }}>{form.icon}</div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Nome</label>
              <input type="text" className="input-field" placeholder="Nome da categoria"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                maxLength={LIMITS.STRING_MAX_SHORT} required />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Tipo</label>
              <div className="flex gap-2">
                {[{ id: 'expense', l: 'Despesa' }, { id: 'income', l: 'Receita' }, { id: 'both', l: 'Ambos' }].map(t => (
                  <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, type: t.id }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                      ${form.type === t.id ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                        : 'bg-surface-3/50 text-gray-500 border-white/5 hover:text-gray-300'}`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Ícone</label>
              <div className="grid grid-cols-10 gap-1.5">
                {EMOJI_OPTIONS.map(emoji => (
                  <button key={emoji} type="button" onClick={() => setForm(f => ({ ...f, icon: emoji }))}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all
                      ${form.icon === emoji ? 'bg-brand-500/20 ring-2 ring-brand-500/40 scale-110' : 'bg-surface-3/50 hover:bg-white/10'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/60 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-danger-400 text-sm bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">{error}</motion.p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  : editData ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Categories({ categories, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = categories.filter(c => filter === 'all' || c.type === filter || c.type === 'both');

  const handleSave = async (data) => {
    if (editItem) return await onUpdate(editItem.id, data);
    return await onAdd(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta categoria?')) await onDelete(id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Categorias</h1>
          <p className="text-gray-400 text-sm mt-1">Organize suas transações ({categories.length}/{LIMITS.CATEGORIES_MAX})</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      <div className="flex gap-2">
        {[{ id: 'all', l: 'Todas' }, { id: 'expense', l: 'Despesas' }, { id: 'income', l: 'Receitas' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === f.id ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'bg-surface-2/60 text-gray-400 border border-white/5 hover:text-white'}`}>{f.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((cat, i) => (
            <motion.div key={cat.id || cat.name} layout
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="glass-card p-4 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: cat.color + '15' }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{cat.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md inline-block mt-0.5
                    ${cat.type === 'income' ? 'bg-brand-500/10 text-brand-400'
                      : cat.type === 'expense' ? 'bg-danger-500/10 text-danger-400'
                      : 'bg-white/5 text-gray-400'}`}>
                    {cat.type === 'income' ? 'Receita' : cat.type === 'expense' ? 'Despesa' : 'Ambos'}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditItem(cat); setShowModal(true); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg hover:bg-danger-500/10 text-gray-500 hover:text-danger-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CategoryModal isOpen={showModal}
        onClose={() => { setShowModal(false); setEditItem(null); }}
        onSave={handleSave} editData={editItem} />
    </div>
  );
}
