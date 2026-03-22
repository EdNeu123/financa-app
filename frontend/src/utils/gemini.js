/**
 * Gemini client — chama o backend, não a API do Google diretamente.
 * Cache em sessionStorage para evitar chamadas duplicadas.
 */

import { apiPost, isBackendConfigured } from './api';

const CACHE_TTL = 30 * 60 * 1000; // 30 min

// --- Cache via sessionStorage ---
function getCached(key) {
  try {
    const raw = sessionStorage.getItem('gemini_' + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) { sessionStorage.removeItem('gemini_' + key); return null; }
    return entry.data;
  } catch { return null; }
}

function setCache(key, data) {
  try { sessionStorage.setItem('gemini_' + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

// --- Rate limiter via sessionStorage ---
function getCooldown() {
  return parseInt(sessionStorage.getItem('gemini_cooldown') || '0', 10);
}
function setCooldown(until) {
  sessionStorage.setItem('gemini_cooldown', String(until));
}
function getLastCall() {
  return parseInt(sessionStorage.getItem('gemini_lastCall') || '0', 10);
}
function setLastCall() {
  sessionStorage.setItem('gemini_lastCall', String(Date.now()));
}

/**
 * Analisa ações via backend.
 */
export async function analyzeStocks(stocks) {
  if (!stocks?.length) return null;

  const cacheKey = 'stocks_' + stocks.map(s => s.ticker).join(',');
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Cooldown check
  const cooldownUntil = getCooldown();
  if (Date.now() < cooldownUntil) {
    return { error: true, cooldown: Math.ceil((cooldownUntil - Date.now()) / 1000) };
  }

  // Rate limit — min 6s entre chamadas
  const wait = Math.max(0, 6000 - (Date.now() - getLastCall()));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  setLastCall();

  try {
    const result = await apiPost('/api/gemini', {
      type: 'stocks',
      data: { stocks: stocks.map(s => ({ ticker: s.ticker, price: s.price, change: s.change })) },
    });
    if (result) setCache(cacheKey, result);
    return result;
  } catch (e) {
    if (e.status === 429) {
      setCooldown(Date.now() + (e.cooldown || 120) * 1000);
      return { error: true, cooldown: e.cooldown || 120 };
    }
    console.error('AI stocks error:', e);
    return null;
  }
}

/**
 * Analisa gastos via backend.
 */
export async function analyzeSpending(summary) {
  const cacheKey = 'spending_' + JSON.stringify(summary).slice(0, 80);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const cooldownUntil = getCooldown();
  if (Date.now() < cooldownUntil) {
    return { error: true, cooldown: Math.ceil((cooldownUntil - Date.now()) / 1000) };
  }

  const wait = Math.max(0, 6000 - (Date.now() - getLastCall()));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  setLastCall();

  try {
    const result = await apiPost('/api/gemini', { type: 'spending', data: summary });
    if (result) setCache(cacheKey, result);
    return result;
  } catch (e) {
    if (e.status === 429) {
      setCooldown(Date.now() + (e.cooldown || 120) * 1000);
      return { error: true, cooldown: e.cooldown || 120 };
    }
    console.error('AI spending error:', e);
    return null;
  }
}

export function isGeminiConfigured() {
  return isBackendConfigured();
}
