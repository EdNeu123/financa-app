import * as Model from '../models/GamificationModel';
import { LEVELS, XP_PER_ACTION } from '../utils/constants';

export function getLevel(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) { if(xp >= l.xpNeeded) current = l; else break; }
  const next = LEVELS.find(l => l.xpNeeded > xp);
  const progress = next ? ((xp - current.xpNeeded) / (next.xpNeeded - current.xpNeeded)) * 100 : 100;
  return { ...current, xp, nextLevel: next, progress: Math.min(progress, 100) };
}

export async function addXP(uid, action, currentData) {
  const xpGain = XP_PER_ACTION[action] || 0;
  if(!xpGain || !uid) return;
  const current = currentData || { xp:0, streak:0, lastLogin:null, achievements:[], articlesRead:0 };
  const newXP = (current.xp||0) + xpGain;
  try { await Model.save(uid, { ...current, xp: newXP }); } catch(e) { console.error(e); }
}

export async function updateStreak(uid, currentData) {
  if(!uid) return;
  const now = new Date().toISOString().split('T')[0];
  const d = currentData || { xp:0, streak:0, lastLogin:null, achievements:[] };
  if(d.lastLogin === now) return d;
  const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
  const newStreak = d.lastLogin === yesterday ? (d.streak||0)+1 : 1;
  let xpBonus = XP_PER_ACTION.DAILY_LOGIN;
  if(newStreak === 7) xpBonus += XP_PER_ACTION.STREAK_7;
  if(newStreak === 30) xpBonus += XP_PER_ACTION.STREAK_30;
  const updated = { ...d, streak:newStreak, lastLogin:now, xp:(d.xp||0)+xpBonus };
  try { await Model.save(uid, updated); } catch(e) { console.error(e); }
  return updated;
}

export async function unlockAchievement(uid, achievementId, currentData) {
  if(!uid) return;
  const d = currentData || { xp:0, streak:0, achievements:[] };
  if(d.achievements?.includes(achievementId)) return;
  const updated = { ...d, achievements:[...(d.achievements||[]),achievementId] };
  try { await Model.save(uid, updated); } catch(e) { console.error(e); }
}

export const subscribe = (uid,cb) => Model.subscribe(uid,cb);
