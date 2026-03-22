export const LIMITS = Object.freeze({
  AMOUNT_MIN: 0.01, AMOUNT_MAX: 9_999_999.99,
  STRING_MAX_SHORT: 80, STRING_MAX_MEDIUM: 200, STRING_MAX_LONG: 500,
  TAGS_MAX: 10, TAG_LENGTH_MAX: 30,
  CATEGORIES_MAX: 50, GOALS_MAX: 30,
  DATE_MIN_YEAR: 2000, DATE_MAX_YEARS_AHEAD: 30,
});

export function sanitizeString(input, maxLength = LIMITS.STRING_MAX_MEDIUM) {
  if (input == null) return '';
  return String(input).replace(/<[^>]*>/g,'').replace(/&[#\w]+;/g,'').replace(/[<>"'`]/g,'').trim().slice(0, maxLength);
}

export function sanitizeAmount(input) {
  const raw = typeof input === 'string' ? input.replace(',', '.') : input;
  const num = Number(raw);
  if (Number.isNaN(num) || !Number.isFinite(num)) return { valid: false, value: 0, error: 'Valor inválido' };
  const rounded = Math.round(num * 100) / 100;
  if (rounded < LIMITS.AMOUNT_MIN) return { valid: false, value: 0, error: `Valor mínimo é R$ ${LIMITS.AMOUNT_MIN}` };
  if (rounded > LIMITS.AMOUNT_MAX) return { valid: false, value: 0, error: `Valor máximo é R$ ${LIMITS.AMOUNT_MAX.toLocaleString('pt-BR')}` };
  return { valid: true, value: rounded };
}

export function sanitizeDate(input) {
  if (!input || typeof input !== 'string') return { valid: false, value: '', error: 'Data obrigatória' };
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return { valid: false, value: '', error: 'Formato inválido' };
  const [, ys, ms, ds] = match;
  const [y, m, d] = [Number(ys), Number(ms), Number(ds)];
  const dateObj = new Date(y, m-1, d);
  if (dateObj.getFullYear()!==y || dateObj.getMonth()!==m-1 || dateObj.getDate()!==d) return { valid:false, value:'', error:'Data inexistente' };
  if (y < LIMITS.DATE_MIN_YEAR) return { valid:false, value:'', error:`Ano mínimo: ${LIMITS.DATE_MIN_YEAR}` };
  if (y > new Date().getFullYear()+LIMITS.DATE_MAX_YEARS_AHEAD) return { valid:false, value:'', error:'Ano muito distante' };
  return { valid: true, value: input };
}

export function sanitizeTag(input) {
  return sanitizeString(input, LIMITS.TAG_LENGTH_MAX).toLowerCase().replace(/[^a-záàâãéèêíóôõúüç0-9\s-]/gi,'').trim();
}

export function sanitizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map(sanitizeTag).filter(t=>t.length>0))].slice(0, LIMITS.TAGS_MAX);
}

export const isValidTxType = t => ['income','expense'].includes(t);
export const isValidCatType = t => ['income','expense','both'].includes(t);
export const isValidHexColor = c => typeof c==='string' && /^#[0-9a-fA-F]{6}$/.test(c);

export function validationResult(errors) {
  const filtered = Object.entries(errors).filter(([,v])=>v!==null);
  return { valid: filtered.length===0, errors: Object.fromEntries(filtered) };
}
