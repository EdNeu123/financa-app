import * as CategoryModel from '../models/CategoryModel';
import {
  sanitizeString,
  isValidCatType,
  isValidHexColor,
  validationResult,
  LIMITS,
} from '../utils/validators';
import { EMOJI_OPTIONS, COLOR_OPTIONS } from '../utils/constants';

/**
 * CategoryController
 *
 * Responsabilidades:
 *  - Validar nome, ícone, tipo e cor
 *  - Impedir duplicatas (via lista atual)
 *  - Limitar quantidade de categorias por usuário
 *  - Garantir que ícone é da lista permitida
 */

function validateCategory(data, existingCategories = [], editingId = null) {
  // 1. Nome
  const name = sanitizeString(data.name, LIMITS.STRING_MAX_SHORT);
  let nameError = null;
  if (name.length < 2) {
    nameError = 'Nome deve ter pelo menos 2 caracteres';
  } else {
    // Checar duplicata (ignorando o próprio item se editando)
    const duplicate = existingCategories.find(
      c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId
    );
    if (duplicate) nameError = 'Já existe uma categoria com este nome';
  }

  // 2. Tipo
  const typeError = isValidCatType(data.type) ? null : 'Tipo inválido';

  // 3. Ícone — deve ser da lista permitida
  const icon = EMOJI_OPTIONS.includes(data.icon) ? data.icon : '📦';

  // 4. Cor — deve ser hex válida e da lista
  const color = COLOR_OPTIONS.includes(data.color) && isValidHexColor(data.color)
    ? data.color
    : '#94a3b8';

  const result = validationResult({ name: nameError, type: typeError });

  return {
    ...result,
    sanitized: { name, icon, type: data.type, color },
  };
}

// ── Ações públicas ──────────────────────────────────────────

export async function create(userId, rawData, existingCategories = []) {
  if (!userId) return { success: false, error: 'Usuário não autenticado' };

  // Limitar quantidade
  if (existingCategories.length >= LIMITS.CATEGORIES_MAX) {
    return { success: false, error: `Limite de ${LIMITS.CATEGORIES_MAX} categorias atingido` };
  }

  const validation = validateCategory(rawData, existingCategories);
  if (!validation.valid) {
    return { success: false, error: Object.values(validation.errors)[0] };
  }

  try {
    await CategoryModel.create(userId, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('CategoryController.create:', err);
    return { success: false, error: 'Erro ao criar categoria' };
  }
}

export async function update(id, rawData, existingCategories = []) {
  if (!id) return { success: false, error: 'ID inválido' };

  const validation = validateCategory(rawData, existingCategories, id);
  if (!validation.valid) {
    return { success: false, error: Object.values(validation.errors)[0] };
  }

  try {
    await CategoryModel.update(id, validation.sanitized);
    return { success: true };
  } catch (err) {
    console.error('CategoryController.update:', err);
    return { success: false, error: 'Erro ao atualizar categoria' };
  }
}

export async function remove(id) {
  if (!id) return { success: false, error: 'ID inválido' };
  try {
    await CategoryModel.remove(id);
    return { success: true };
  } catch (err) {
    console.error('CategoryController.remove:', err);
    return { success: false, error: 'Erro ao excluir categoria' };
  }
}

export function subscribe(userId, callback) {
  return CategoryModel.subscribe(userId, callback);
}
