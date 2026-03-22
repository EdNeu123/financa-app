import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Crown, Shield, Target, Tag, BookOpen, Zap, Lock } from 'lucide-react';
import { LEVELS, ACHIEVEMENTS } from '../utils/constants';
import { CategoryBadge } from '../utils/icons';

const ICON_MAP = { star: Star, flame: Flame, crown: Crown, shield: Shield, target: Target, piggy: Zap, tag: Tag, book: BookOpen };

export default function Achievements({ gamification }) {
  const data = gamification || { xp: 0, streak: 0, achievements: [], articlesRead: 0 };
  const xp = data.xp || 0;
  const streak = data.streak || 0;
  const unlocked = data.achievements || [];

  const level = useMemo(() => {
    let cur = LEVELS[0];
    for (const l of LEVELS) { if (xp >= l.xpNeeded) cur = l; else break; }
    const next = LEVELS.find(l => l.xpNeeded > xp);
    const progress = next ? ((xp - cur.xpNeeded) / (next.xpNeeded - cur.xpNeeded)) * 100 : 100;
    return { ...cur, next, progress: Math.min(progress, 100) };
  }, [xp]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Conquistas</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Ganhe XP e suba de nível mantendo suas finanças em dia</p></div>

      {/* Level card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative" style={{ background: level.color + '20' }}>
            <span className="text-3xl font-extrabold font-display" style={{ color: level.color }}>{level.level}</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Nível atual</p>
            <h2 className="text-2xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>{level.title}</h2>
            <p className="text-sm font-mono mb-3" style={{ color: 'var(--accent)' }}>{xp} XP</p>
            {level.next && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-muted)' }}>Próximo: {level.next.title}</span>
                  <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{level.next.xpNeeded - xp} XP restantes</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${level.progress}%` }} transition={{ duration: 1.2 }}
                    className="h-full rounded-full" style={{ backgroundColor: level.color }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 text-center"><Flame className="w-5 h-5 mx-auto mb-2" style={{ color: '#f97316' }} /><p className="stat-value font-mono" style={{ color: 'var(--text-primary)' }}>{streak}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Dias seguidos</p></div>
        <div className="card p-4 text-center"><Trophy className="w-5 h-5 mx-auto mb-2" style={{ color: '#eab308' }} /><p className="stat-value font-mono" style={{ color: 'var(--text-primary)' }}>{unlocked.length}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Conquistas</p></div>
        <div className="card p-4 text-center"><Zap className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--accent)' }} /><p className="stat-value font-mono" style={{ color: 'var(--text-primary)' }}>{xp}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>XP total</p></div>
        <div className="card p-4 text-center"><Star className="w-5 h-5 mx-auto mb-2" style={{ color: '#8b5cf6' }} /><p className="stat-value font-mono" style={{ color: 'var(--text-primary)' }}>{level.level}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Nível</p></div>
      </div>

      {/* All levels */}
      <div>
        <p className="section-title">Todos os níveis</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LEVELS.map(l => {
            const reached = xp >= l.xpNeeded;
            return (
              <div key={l.level} className="card p-3 text-center transition-all" style={{ opacity: reached ? 1 : 0.4 }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                  style={{ background: l.color + '20', color: l.color }}>{l.level}</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{l.title}</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{l.xpNeeded} XP</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <p className="section-title">Conquistas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a, i) => {
            const done = unlocked.includes(a.id);
            const Icon = ICON_MAP[a.icon] || Star;
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-center gap-4" style={{ opacity: done ? 1 : 0.5 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: done ? 'var(--accent-light)' : 'var(--bg-tertiary)' }}>
                  {done ? <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} /> : <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
                <span className="text-xs font-mono font-semibold" style={{ color: done ? 'var(--accent)' : 'var(--text-muted)' }}>+{a.xp} XP</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
