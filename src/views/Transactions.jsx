import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Trash2, Pencil, Target } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TAG_SUGGESTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

/**
 * Modal de criação/edição de transação.
 * A View NÃO valida — apenas coleta dados e repassa via onSave.
 * O controller retorna { success, error } e a view exibe o erro.
 */
function TransactionModal({ isOpen, onClose, onSave, editData, categories, goals }) {
  const [form, setForm] = useState(() => editData || {
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    notes: '',
    goalId: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredCats = categories.filter(c => c.type === form.type || c.type === 'both');

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().slice(0, LIMITS.TAG_LENGTH_MAX);
    if (tag && !form.tags.includes(tag) && form.tags.length < LIMITS.TAGS_MAX) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Repassa para o controller que valida e persiste
    const result = await onSave({
      ...form,
      amount: form.amount, // controller converte e valida
    });

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
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h3 className="text-lg font-bold font-display">{editData ? 'Editar Transação' : 'Nova Transação'}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Type toggle */}
            <div className="flex gap-2 p-1 bg-surface-3 rounded-xl">
              {['expense', 'income'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(f => ({ ...f, type: t, category: '', goalId: t === 'expense' ? null : f.goalId }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${form.type === t
                      ? t === 'expense' ? 'bg-danger-500/20 text-danger-400' : 'bg-brand-500/20 text-brand-400'
                      : 'text-gray-500 hover:text-gray-300'}`}>
                  {t === 'expense' ? '↓ Despesa' : '↑ Receita'}
                </button>
              ))}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Descrição</label>
              <input type="text" className="input-field" placeholder="Ex: Supermercado, Salário..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                maxLength={LIMITS.STRING_MAX_MEDIUM} required />
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Valor (R$) <span className="text-gray-600">máx {LIMITS.AMOUNT_MAX.toLocaleString('pt-BR')}</span>
                </label>
                <input type="number" className="input-field font-mono" placeholder="0,00"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  min={LIMITS.AMOUNT_MIN} max={LIMITS.AMOUNT_MAX} step="0.01"
                  required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Data</label>
                <input type="date" className="input-field" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  min="2000-01-01" required />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Categoria</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredCats.map(cat => (
                  <button key={cat.name} type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.name }))}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all
                      ${form.category === cat.name
                        ? 'border-brand-500/50 bg-brand-500/10 text-white'
                        : 'border-white/5 bg-surface-3/50 text-gray-400 hover:border-white/15'}`}>
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal selector — only for income */}
            {form.type === 'income' && goals.length > 0 && (
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Vincular a uma meta (opcional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, goalId: null }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all
                      ${!form.goalId
                        ? 'border-brand-500/50 bg-brand-500/10 text-white'
                        : 'border-white/5 bg-surface-3/50 text-gray-400 hover:border-white/15'}`}>
                    <span className="text-lg">—</span>
                    <span>Nenhuma</span>
                  </button>
                  {goals.map(g => (
                    <button key={g.id} type="button"
                      onClick={() => setForm(f => ({ ...f, goalId: g.id }))}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all
                        ${form.goalId === g.id
                          ? 'border-brand-500/50 bg-brand-500/10 text-white'
                          : 'border-white/5 bg-surface-3/50 text-gray-400 hover:border-white/15'}`}>
                      <span className="text-lg">{g.icon}</span>
                      <span className="truncate">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Tags (máx {LIMITS.TAGS_MAX})</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(tag => (
                  <span key={tag} className="tag-pill bg-brand-500/10 text-brand-400 border-brand-500/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input type="text" className="input-field" placeholder="Adicionar tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                maxLength={LIMITS.TAG_LENGTH_MAX} />
              <div className="flex flex-wrap gap-1 mt-2">
                {TAG_SUGGESTIONS.filter(s => !form.tags.includes(s)).slice(0, 6).map(s => (
                  <button key={s} type="button" onClick={() => addTag(s)}
                    className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10">
                    +{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Notas (opcional)</label>
              <textarea className="input-field resize-none h-20" placeholder="Observações..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                maxLength={LIMITS.STRING_MAX_LONG} />
            </div>

            {/* Error from controller */}
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-danger-400 text-sm bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  : editData ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Transactions({ transactions, categories, goals, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() =>
    transactions.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.includes(q));
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchSearch && matchType;
    }),
    [transactions, search, typeFilter]
  );

  /**
   * Repassa ao controller e retorna o resultado
   * para o modal exibir erro se houver.
   */
  const handleSave = async (data) => {
    if (editItem) {
      return await onUpdate(editItem.id, data);
    }
    return await onAdd(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta transação?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Transações</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} transaç{filtered.length === 1 ? 'ão' : 'ões'}</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Transação
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" className="input-field pl-11" placeholder="Buscar..."
            value={search} onChange={e => setSearch(e.target.value)} maxLength={100} />
        </div>
        <div className="flex gap-2">
          {[{ id: 'all', label: 'Todos' }, { id: 'income', label: 'Receitas' }, { id: 'expense', label: 'Despesas' }].map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${typeFilter === f.id
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'bg-surface-2/60 text-gray-400 border border-white/5 hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">Nenhuma transação encontrada</p>
            </motion.div>
          ) : filtered.map((tx, i) => {
            const cat = categories.find(c => c.name === tx.category);
            const linkedGoal = tx.goalId ? goals.find(g => g.id === tx.goalId) : null;
            return (
              <motion.div key={tx.id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="glass-card p-4 flex items-center gap-4 group hover:border-white/10 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: (cat?.color || '#94a3b8') + '15' }}>
                  {cat?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    {linkedGoal && (
                      <span className="tag-pill bg-brand-500/10 text-brand-400 border-brand-500/20 text-[10px]">
                        {linkedGoal.icon} {linkedGoal.name}
                      </span>
                    )}
                    {tx.tags?.length > 0 && (
                      <div className="hidden sm:flex gap-1">
                        {tx.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="tag-pill bg-white/5 text-gray-500 text-[10px]">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{tx.category}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-500">{formatDate(tx.date)}</span>
                  </div>
                </div>
                <span className={`text-sm font-mono font-semibold whitespace-nowrap
                  ${tx.type === 'income' ? 'text-brand-400' : 'text-danger-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditItem(tx); setShowModal(true); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(tx.id)}
                    className="p-2 rounded-lg hover:bg-danger-500/10 text-gray-500 hover:text-danger-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <TransactionModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditItem(null); }}
        onSave={handleSave}
        editData={editItem}
        categories={categories}
        goals={goals || []}
      />
    </div>
  );
}
