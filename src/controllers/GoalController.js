import * as GoalModel from '../models/GoalModel';
import {
  sanitizeString,
  sanitizeAmount,
  sanitizeDate,
  isValidHexColor,
  validationResult,
  LIMITS,
} from '../utils/validators';
import { GOAL_ICONS, COLOR_OPTIONS } from '../utils/constants';

/**
 * GoalController
 *
 * Responsabilidades:
 *  - Validar nome, valor alvo, ícone, cor, deadline
 *  - Limitar quantidade de metas
 *  - Garantir ícone/cor da lista permitida
 */

function validateGoal(data) {
  // 1. Nome
  const name = sanitizeString(data.name, LIMITS.STRING_MAX_SHORT);
  const nameError = name.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null;

  // 2. Valor alvo
  const targetResult = sanitizeAmount(data.target);
  const targetError = targetResult.valid ? null : targetResult.error;

  // 3. Deadline (opcional)
  let deadline = null;
  let deadlineError = null;
  if (data.deadline && data.deadline.trim() !== '') {
    const dateResult = sanitizeDate(data.deadline);
    if (!dateResult.valid) {
      deadlineError = dateResult.error;
    } else {
      deadline = dateResult.value;
    }
  }

  // 4. Ícone
  const icon = GOAL_ICONS.includes(data.icon) ? data.icon : '🎯';

  // 5. Cor
  const color = COLOR_OPTIONS.includes(data.color) && isValidHexColor(data.color)
    ? data.color
    : '#22c55e';

  // 6. Notas
  const notes = sanitizeString(data.notes || '', LIMITS.STRING_MAX_LONG);

  const result = validationResult({
    name: nameError,
    target: targetError,
    deadline: deadlineError,
  });

  return {
    ...result,
    sanitized: { name, target: targetResult.value, icon, color, deadline, notes },
  };
}

// ── Ações públicas ──────────────────────────────────────────

export async function create(userId, rawData, existingGoals = []) {
  if (!userId) return { success: false, error: 'Usuário não autenticado' };

  if (existingGoals.length >= LIMITS.GOALS_MAX) {
    return { success: false, error: `Limite de ${LIMITS.GOALS_MAX} metas atingido` };
  }

  const validation = validateGoal(rawData);
  if (!validation.valid) {
    return { success: false, error: Object.values(validation.errors)[0] };
  }

  try {
    await GoalModel.create(userId, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('GoalController.create:', err);
    return { success: false, error: 'Erro ao criar meta' };
  }
}

export async function update(id, rawData) {
  if (!id) return { success: false, error: 'ID inválido' };

  const validation = validateGoal(rawData);
  if (!validation.valid) {
    return { success: false, error: Object.values(validation.errors)[0] };
  }

  try {
    await GoalModel.update(id, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('GoalController.update:', err);
    return { success: false, error: 'Erro ao atualizar meta' };
  }
}

export async function remove(id) {
  if (!id) return { success: false, error: 'ID inválido' };
  try {
    await GoalModel.remove(id);
    return { success: true };
  } catch (err) {
    console.error('GoalController.remove:', err);
    return { success: false, error: 'Erro ao excluir meta' };
  }
}

export function subscribe(userId, callback) {
  return GoalModel.subscribe(userId, callback);
}
