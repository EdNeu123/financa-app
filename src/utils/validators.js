/**
 * validators.js — Camada central de validação e sanitização.
 *
 * TODAS as entradas de usuário passam por aqui ANTES de tocar
 * o Firestore. Isso impede:
 *   - Valores negativos / zero
 *   - Montantes absurdos (limite configurável)
 *   - Strings com HTML/scripts (XSS)
 *   - Campos obrigatórios vazios
 *   - Tipos incorretos (ex: string onde deveria ser number)
 *   - Datas inválidas ou no futuro distante
 */

// ── Limites globais ────────────────────────────────────────
export const LIMITS = Object.freeze({
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 9_999_999.99,
  STRING_MAX_SHORT: 80,   // nomes, categorias
  STRING_MAX_MEDIUM: 200,  // descrições
  STRING_MAX_LONG: 500,    // notas
  TAGS_MAX: 10,
  TAG_LENGTH_MAX: 30,
  CATEGORIES_MAX: 50,
  GOALS_MAX: 30,
  DATE_MIN_YEAR: 2000,
  DATE_MAX_YEARS_AHEAD: 30,
});

// ── Sanitização ────────────────────────────────────────────

/**
 * Remove tags HTML, trim, e limita comprimento.
 * Nunca retorna undefined — sempre string.
 */
export function sanitizeString(input, maxLength = LIMITS.STRING_MAX_MEDIUM) {
  if (input === null || input === undefined) return '';
  const str = String(input)
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/&[#\w]+;/g, '')  // strip HTML entities
    .replace(/[<>"'`]/g, '')   // strip remaining dangerous chars
    .trim();
  return str.slice(0, maxLength);
}

/**
 * Sanitiza e normaliza um valor numérico.
 * Retorna { valid: boolean, value: number, error?: string }
 */
export function sanitizeAmount(input) {
  // Converter para number de forma segura
  const raw = typeof input === 'string' ? input.replace(',', '.') : input;
  const num = Number(raw);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return { valid: false, value: 0, error: 'Valor inválido' };
  }

  // Arredondar para 2 casas decimais para evitar float artifacts
  const rounded = Math.round(num * 100) / 100;

  if (rounded < LIMITS.AMOUNT_MIN) {
    return { valid: false, value: 0, error: `Valor mínimo é R$ ${LIMITS.AMOUNT_MIN}` };
  }

  if (rounded > LIMITS.AMOUNT_MAX) {
    return {
      valid: false,
      value: 0,
      error: `Valor máximo permitido é R$ ${LIMITS.AMOUNT_MAX.toLocaleString('pt-BR')}`,
    };
  }

  return { valid: true, value: rounded };
}

// ── Validação de data ──────────────────────────────────────

/**
 * Valida uma string de data (YYYY-MM-DD).
 * Retorna { valid, value, error? }
 */
export function sanitizeDate(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, value: '', error: 'Data obrigatória' };
  }

  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { valid: false, value: '', error: 'Formato de data inválido (YYYY-MM-DD)' };
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Checar se a data é real (ex: 2025-02-30 não existe)
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return { valid: false, value: '', error: 'Data inexistente' };
  }

  if (year < LIMITS.DATE_MIN_YEAR) {
    return { valid: false, value: '', error: `Ano mínimo: ${LIMITS.DATE_MIN_YEAR}` };
  }

  const maxYear = new Date().getFullYear() + LIMITS.DATE_MAX_YEARS_AHEAD;
  if (year > maxYear) {
    return { valid: false, value: '', error: `Ano máximo: ${maxYear}` };
  }

  return { valid: true, value: input };
}

// ── Validação de tags ──────────────────────────────────────

export function sanitizeTag(input) {
  return sanitizeString(input, LIMITS.TAG_LENGTH_MAX)
    .toLowerCase()
    .replace(/[^a-záàâãéèêíóôõúüç0-9\s-]/gi, '')
    .trim();
}

export function sanitizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(
    tags
      .map(sanitizeTag)
      .filter(t => t.length > 0)
  )].slice(0, LIMITS.TAGS_MAX);
}

// ── Validação de tipo de transação ─────────────────────────

const VALID_TX_TYPES = ['income', 'expense'];
const VALID_CAT_TYPES = ['income', 'expense', 'both'];

export function isValidTxType(type) {
  return VALID_TX_TYPES.includes(type);
}

export function isValidCatType(type) {
  return VALID_CAT_TYPES.includes(type);
}

// ── Validação de cor (hex) ─────────────────────────────────

export function isValidHexColor(color) {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color);
}

// ── Criar resultado padronizado ────────────────────────────

export function validationResult(errors) {
  const filtered = Object.entries(errors).filter(([, v]) => v !== null);
  return {
    valid: filtered.length === 0,
    errors: Object.fromEntries(filtered),
  };
}
