/**
 * Notifications — push na barra do celular + central in-app.
 */

// ── Push Notifications (barra do celular) ──

/** Registra o service worker */
export async function registerSW() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered');
    return reg;
  } catch (e) { console.warn('SW registration failed:', e); return null; }
}

/** Pede permissão de notificação */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

/** Envia notificação push local (via service worker) */
export async function sendLocalNotification(title, body, url = '/app') {
  const reg = await navigator.serviceWorker?.ready;
  if (!reg) return;
  await reg.showNotification(title, {
    body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [100, 50, 100],
    data: { url },
    tag: 'quanto-' + Date.now(),
  });
}

/** Agenda lembrete diário via service worker */
export async function scheduleDailyReminder() {
  const reg = await navigator.serviceWorker?.ready;
  if (!reg?.active) return;
  // Agenda para 8h a partir de agora (simplificado — ideal seria calcular hora fixa)
  reg.active.postMessage({
    type: 'SCHEDULE_REMINDER',
    body: 'Já registrou seus gastos de hoje? Abra o Quanto e mantenha o controle.',
    delay: 8 * 60 * 60 * 1000,
  });
}

/** Notificações motivacionais contextuais */
const MOTIVATIONAL = [
  { trigger: 'login', messages: ['Bom te ver de volta! Que tal registrar os gastos de hoje?', 'Streak ativo! Continue assim.'] },
  { trigger: 'no_tx_today', messages: ['Nenhuma transação hoje — registre antes que esqueça!', 'Seus gastos de hoje já foram anotados?'] },
  { trigger: 'goal_progress', messages: ['Sua meta está quase lá! Guarde mais um pouco hoje.', 'Cada real guardado é um passo mais perto do objetivo.'] },
  { trigger: 'budget_warning', messages: ['Atenção: um dos seus orçamentos está próximo do limite.', 'Cuidado com os gastos — orçamento quase no teto.'] },
  { trigger: 'streak', messages: ['Parabéns pelo streak! Continue registrando todo dia.', 'Você está construindo um hábito financeiro incrível.'] },
];

export function getMotivationalMessage(trigger) {
  const group = MOTIVATIONAL.find(m => m.trigger === trigger);
  if (!group) return null;
  return group.messages[Math.floor(Math.random() * group.messages.length)];
}

/** Verifica e envia notificações contextuais */
export async function checkAndNotify(transactions, budgets, gamification) {
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastNotif = localStorage.getItem('quanto_last_notif');

  // Máx 1 push por dia
  if (lastNotif === today) return;

  // Sem transações hoje → lembrete
  const todayTx = transactions.filter(t => t.date === today);
  if (todayTx.length === 0 && now.getHours() >= 18) {
    await sendLocalNotification('Quanto', getMotivationalMessage('no_tx_today'));
    localStorage.setItem('quanto_last_notif', today);
    return;
  }

  // Budget warning
  const alerts = budgets?.filter(b => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === b.category && t.date?.startsWith(thisMonth))
      .reduce((s, t) => s + (t.amount || 0), 0);
    return b.limitAmount > 0 && (spent / b.limitAmount) >= 0.8;
  });
  if (alerts?.length > 0) {
    await sendLocalNotification('Quanto', getMotivationalMessage('budget_warning'));
    localStorage.setItem('quanto_last_notif', today);
    return;
  }
}


// ── In-app Notification Center ──

/** Gera notificações in-app baseadas nos dados do usuário */
export function generateInAppNotifications(transactions, budgets, goals, gamification) {
  const notifs = [];
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Streak
  if (gamification?.streak >= 3) {
    notifs.push({ id: 'streak', type: 'success', icon: '🔥', title: `Streak de ${gamification.streak} dias!`, desc: 'Continue registrando todo dia para não perder.', time: 'Agora' });
  }

  // Level up check
  if (gamification?.xp > 0) {
    const levels = [0, 100, 300, 600, 1200, 2500, 5000, 10000];
    const currentIdx = levels.filter(l => gamification.xp >= l).length - 1;
    const nextXP = levels[currentIdx + 1];
    if (nextXP && (nextXP - gamification.xp) < 50) {
      notifs.push({ id: 'levelup', type: 'info', icon: '⭐', title: 'Quase subindo de nível!', desc: `Faltam ${nextXP - gamification.xp} XP para o próximo nível.`, time: 'Agora' });
    }
  }

  // Budget alerts
  budgets?.forEach(b => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === b.category && t.date?.startsWith(thisMonth))
      .reduce((s, t) => s + (t.amount || 0), 0);
    const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
    if (pct >= 100) {
      notifs.push({ id: `budget_${b.category}`, type: 'danger', icon: '🚨', title: `${b.category}: limite estourado`, desc: `R$ ${Math.round(spent)} de R$ ${b.limitAmount} (${Math.round(pct)}%)`, time: 'Este mês' });
    } else if (pct >= 80) {
      notifs.push({ id: `budget_${b.category}`, type: 'warning', icon: '⚠️', title: `${b.category}: ${Math.round(pct)}% do limite`, desc: `Faltam R$ ${Math.round(b.limitAmount - spent)} para estourar.`, time: 'Este mês' });
    }
  });

  // Goal progress
  goals?.forEach(g => {
    const saved = transactions.filter(t => t.goalId === g.id && t.type === 'savings').reduce((s, t) => s + (t.amount || 0), 0);
    const pct = g.targetAmount > 0 ? (saved / g.targetAmount) * 100 : 0;
    if (pct >= 90 && pct < 100) {
      notifs.push({ id: `goal_${g.id}`, type: 'success', icon: '🎯', title: `${g.name}: ${Math.round(pct)}% concluída!`, desc: `Faltam R$ ${Math.round(g.targetAmount - saved)} para completar.`, time: 'Meta' });
    } else if (pct >= 100) {
      notifs.push({ id: `goal_${g.id}_done`, type: 'success', icon: '🏆', title: `${g.name}: meta atingida!`, desc: 'Parabéns! Você completou essa meta.', time: 'Meta' });
    }
  });

  // No transactions today
  const todayTx = transactions.filter(t => t.date === today);
  if (todayTx.length === 0) {
    notifs.push({ id: 'no_tx', type: 'info', icon: '📝', title: 'Nenhuma transação hoje', desc: 'Registre seus gastos para manter o controle.', time: 'Hoje' });
  }

  return notifs;
}
