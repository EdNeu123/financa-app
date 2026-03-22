import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, Pencil, Trash2, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { GOAL_ICONS, COLOR_OPTIONS } from '../utils/constants';
import { LIMITS } from '../utils/validators';

function GoalModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState(() => editData || {
    name: '', target: '', icon: '🎯', color: '#22c55e', deadline: '', notes: '',
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
            <h3 className="text-lg font-bold font-display">{editData ? 'Editar Meta' : 'Nova Meta'}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: form.color + '20' }}>{form.icon}</div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Nome da meta</label>
              <input type="text" className="input-field" placeholder="Ex: Reserva de emergência..."
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                maxLength={LIMITS.STRING_MAX_SHORT} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Valor alvo (R$)</label>
                <input type="number" className="input-field font-mono" placeholder="10000"
                  value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  min={LIMITS.AMOUNT_MIN} max={LIMITS.AMOUNT_MAX} step="0.01" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Prazo (opcional)</label>
                <input type="date" className="input-field" value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  min="2000-01-01" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Ícone</label>
              <div className="flex flex-wrap gap-1.5">
                {GOAL_ICONS.map(emoji => (
                  <button key={emoji} type="button" onClick={() => setForm(f => ({ ...f, icon: emoji }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all
                      ${form.icon === emoji ? 'bg-brand-500/20 ring-2 ring-brand-500/40 scale-110' : 'bg-surface-3/50 hover:bg-white/10'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/60 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Notas (opcional)</label>
              <textarea className="input-field resize-none h-16" placeholder="Detalhes..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                maxLength={LIMITS.STRING_MAX_LONG} />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-danger-400 text-sm bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">{error}</motion.p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  : editData ? 'Salvar' : 'Criar Meta'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Goals({ goals, transactions, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const goalsWithProgress = useMemo(() =>
    goals.map(g => {
      const saved = transactions.filter(t => t.goalId === g.id)
        .reduce((s, t) => s + (t.type === 'income' ? (t.amount || 0) : -(t.amount || 0)), 0);
      const safeSaved = Math.max(saved, 0);
      const progress = g.target > 0 ? Math.min((safeSaved / g.target) * 100, 100) : 0;
      let daysLeft = null;
      if (g.deadline) {
        const diff = new Date(g.deadline + 'T00:00:00') - new Date();
        daysLeft = Math.max(Math.ceil(diff / 86400000), 0);
      }
      return { ...g, saved: safeSaved, progress, remaining: Math.max(g.target - safeSaved, 0), daysLeft };
    }),
    [goals, transactions]
  );

  const totalTarget = goalsWithProgress.reduce((s, g) => s + (g.target || 0), 0);
  const totalSaved = goalsWithProgress.reduce((s, g) => s + g.saved, 0);
  const completed = goalsWithProgress.filter(g => g.progress >= 100).length;

  const handleSave = async (data) => {
    if (editItem) return await onUpdate(editItem.id, data);
    return await onAdd(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta meta?')) await onDelete(id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Metas Financeiras</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe seus objetivos ({goals.length}/{LIMITS.GOALS_MAX})</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Meta
        </button>
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-brand-400" /><span className="text-xs text-gray-400">Total em metas</span></div>
            <p className="text-xl font-bold font-mono text-white">{formatCurrency(totalTarget)}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-brand-400" /><span className="text-xs text-gray-400">Total guardado</span></div>
            <p className="text-xl font-bold font-mono text-brand-400">{formatCurrency(totalSaved)}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /><span className="text-xs text-gray-400">Concluídas</span></div>
            <p className="text-xl font-bold font-mono text-white">{completed} <span className="text-sm text-gray-500">/ {goals.length}</span></p>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {goalsWithProgress.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 glass-card p-12 text-center">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-lg mb-2">Nenhuma meta criada</p>
            </motion.div>
          ) : goalsWithProgress.map((goal, i) => (
            <motion.div key={goal.id} layout
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: Math.min(i * 0.08, 0.3) }}
              className="glass-card p-5 group hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: goal.color + '15' }}>{goal.icon}</div>
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    {goal.daysLeft !== null && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className={`text-xs ${goal.daysLeft <= 30 ? 'text-danger-400' : 'text-gray-500'}`}>
                          {goal.daysLeft === 0 ? 'Prazo hoje!' : `${goal.daysLeft} dias restantes`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditItem(goal); setShowModal(true); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(goal.id)}
                    className="p-2 rounded-lg hover:bg-danger-500/10 text-gray-500 hover:text-danger-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Progresso</span>
                  <span className="font-mono" style={{ color: goal.color }}>{goal.progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                    className="h-full rounded-full" style={{ backgroundColor: goal.color }} />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Guardado</span>
                  <p className="font-mono font-semibold" style={{ color: goal.color }}>{formatCurrency(goal.saved)}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 text-xs">Falta</span>
                  <p className="font-mono font-semibold text-gray-300">{formatCurrency(goal.remaining)}</p>
                </div>
              </div>

              {goal.progress >= 100 && (
                <div className="mt-3 flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span className="text-xs text-brand-400 font-medium">Meta alcançada!</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <GoalModal isOpen={showModal}
        onClose={() => { setShowModal(false); setEditItem(null); }}
        onSave={handleSave} editData={editItem} />
    </div>
  );
}
