import { useEffect, useRef } from 'react';
import * as TxCtrl from '../controllers/TransactionController';

/**
 * useRecurring — verifica transações recorrentes e cria as do mês atual se faltarem.
 *
 * Lógica: filtra transações com recurring=true, agrupa por "template" (descrição+categoria+tipo),
 * e se não existir uma transação igual no mês atual, cria uma nova.
 */
export function useRecurring(userId, transactions, limits) {
  const ran = useRef(false);

  useEffect(() => {
    if (!userId || !transactions.length || ran.current) return;
    ran.current = true;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Encontrar todas as transações marcadas como recorrentes
    const recurring = transactions.filter(t => t.recurring === true);
    if (!recurring.length) return;

    // Agrupar por "assinatura" (descrição + categoria + tipo + amount)
    const templates = new Map();
    recurring.forEach(t => {
      const key = `${t.description}|${t.category}|${t.type}|${t.amount}`;
      if (!templates.has(key)) templates.set(key, t);
    });

    // Verificar quais já existem neste mês
    const thisMonthTx = transactions.filter(t => t.date?.startsWith(thisMonth));

    let created = 0;
    templates.forEach((template, key) => {
      const existsThisMonth = thisMonthTx.some(t =>
        t.description === template.description &&
        t.category === template.category &&
        t.type === template.type &&
        t.amount === template.amount
      );

      if (!existsThisMonth) {
        // Criar a transação deste mês
        TxCtrl.create(userId, {
          type: template.type,
          description: template.description,
          amount: template.amount,
          category: template.category,
          date: today,
          tags: [...(template.tags || []), 'recorrente'],
          notes: template.notes || '',
          goalId: template.goalId || null,
          recurring: true,
        }, limits || {}).then(r => {
          if (r.success) created++;
        });
      }
    });

    if (created > 0) console.log(`[Recurring] Created ${created} recurring transactions for ${thisMonth}`);
  }, [userId, transactions, limits]);
}
