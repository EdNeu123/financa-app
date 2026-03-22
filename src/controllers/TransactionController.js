import * as TransactionModel from '../models/TransactionModel';
import {
  sanitizeString,
  sanitizeAmount,
  sanitizeDate,
  sanitizeTags,
  isValidTxType,
  validationResult,
  LIMITS,
} from '../utils/validators';

/**
 * TransactionController
 *
 * Responsabilidades:
 *  - Validar e sanitizar TODOS os campos antes de persistir
 *  - Impedir valores negativos, zero, ou absurdos
 *  - Impedir descrições vazias ou com HTML
 *  - Garantir que type é 'income' ou 'expense'
 *  - Retornar { success, error? } padronizado
 *
 * NUNCA confia no dado que vem da View.
 */

/**
 * Valida os campos de uma transação.
 * Retorna { valid, errors, sanitized }
 */
function validateTransaction(data) {
  // 1. Tipo
  const typeError = isValidTxType(data.type) ? null : 'Tipo deve ser receita ou despesa';

  // 2. Descrição
  const description = sanitizeString(data.description, LIMITS.STRING_MAX_MEDIUM);
  const descError = description.length < 2 ? 'Descrição deve ter pelo menos 2 caracteres' : null;

  // 3. Valor — a validação mais importante
  const amountResult = sanitizeAmount(data.amount);
  const amountError = amountResult.valid ? null : amountResult.error;

  // 4. Categoria
  const category = sanitizeString(data.category, LIMITS.STRING_MAX_SHORT);
  const catError = category.length === 0 ? 'Selecione uma categoria' : null;

  // 5. Data
  const dateResult = sanitizeDate(data.date);
  const dateError = dateResult.valid ? null : dateResult.error;

  // 6. Tags (opcional, mas sanitizar)
  const tags = sanitizeTags(data.tags);

  // 7. Notas (opcional)
  const notes = sanitizeString(data.notes || '', LIMITS.STRING_MAX_LONG);

  // 8. GoalId (opcional)
  const goalId = data.goalId ? sanitizeString(data.goalId, LIMITS.STRING_MAX_SHORT) : null;

  const result = validationResult({
    type: typeError,
    description: descError,
    amount: amountError,
    category: catError,
    date: dateError,
  });

  return {
    ...result,
    sanitized: {
      type: data.type,
      description,
      amount: amountResult.value,
      category,
      date: dateResult.value,
      tags,
      notes,
      goalId,
    },
  };
}

// ── Ações públicas ──────────────────────────────────────────

export async function create(userId, rawData) {
  if (!userId) return { success: false, error: 'Usuário não autenticado' };

  const validation = validateTransaction(rawData);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError };
  }

  try {
    await TransactionModel.create(userId, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('TransactionController.create:', err);
    return { success: false, error: 'Erro ao salvar transação' };
  }
}

export async function update(id, rawData) {
  if (!id) return { success: false, error: 'ID inválido' };

  const validation = validateTransaction(rawData);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError };
  }

  try {
    await TransactionModel.update(id, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('TransactionController.update:', err);
    return { success: false, error: 'Erro ao atualizar transação' };
  }
}

export async function remove(id) {
  if (!id) return { success: false, error: 'ID inválido' };

  try {
    await TransactionModel.remove(id);
    return { success: true };
  } catch (err) {
    console.error('TransactionController.remove:', err);
    return { success: false, error: 'Erro ao excluir transação' };
  }
}

/**
 * Proxy para o subscribe do Model (sem lógica extra).
 */
export function subscribe(userId, callback) {
  return TransactionModel.subscribe(userId, callback);
}
