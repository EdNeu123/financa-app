/**
 * Gemini API client — padrão mega-sena-mvc.
 * Cache em sessionStorage (sobrevive reload).
 * systemInstruction separado + gemini-2.0-flash.
 */

const MODEL = 'gemini-2.0-flash';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const CACHE_TTL = 30 * 60 * 1000; // 30 min

// --- Cache via sessionStorage (persiste entre reloads) ---
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
  try {
    sessionStorage.setItem('gemini_' + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

// --- Rate limiter via sessionStorage ---
function getLastCall() {
  return parseInt(sessionStorage.getItem('gemini_lastCall') || '0', 10);
}
function setLastCall() {
  sessionStorage.setItem('gemini_lastCall', String(Date.now()));
}
function getCooldown() {
  return parseInt(sessionStorage.getItem('gemini_cooldown') || '0', 10);
}
function setCooldown(until) {
  sessionStorage.setItem('gemini_cooldown', String(until));
}

/**
 * Chamada principal:
 * - systemInstruction separado (igual mega-sena)
 * - contents com mensagem curta
 * - responseMimeType: application/json
 */
async function callGemini(systemPrompt, userMessage) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) return null;

  // Cooldown check (persiste entre reloads)
  const cooldownUntil = getCooldown();
  if (Date.now() < cooldownUntil) {
    const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
    throw new Error(`COOLDOWN:${remaining}`);
  }

  // Rate limit — min 6s entre chamadas (persiste entre reloads)
  const lastCall = getLastCall();
  const wait = Math.max(0, 6000 - (Date.now() - lastCall));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  setLastCall();

  try {
    const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (res.status === 429) {
      // Cooldown 2 minutos — sobrevive reload
      setCooldown(Date.now() + 120000);
      console.warn('Rate limited. Cooldown 2min.');
      throw new Error('COOLDOWN:120');
    }

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    if (e.message?.startsWith('COOLDOWN:')) throw e;
    console.error('Gemini fetch error:', e.message);
    return null;
  }
}

function parseJSON(raw) {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
}

/**
 * Analisa ações com dados reais de cotação.
 */
export async function analyzeStocks(stocks) {
  if (!stocks?.length) return null;

  const cacheKey = 'stocks_' + stocks.map(s => s.ticker).join(',');
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const stockData = stocks.map(s =>
    `${s.ticker}: R$${Number(s.price).toFixed(2)} (${s.change >= 0 ? '+' : ''}${Number(s.change).toFixed(2)}%)`
  ).join('\n');

  const systemPrompt = `Você é um analista financeiro brasileiro especializado em B3.
Retorne APENAS JSON:
{
  "analysis_date": "data de hoje",
  "market_summary": "resumo em 1-2 frases",
  "picks": [
    { "ticker": "CÓDIGO", "sentiment": "bullish" | "neutral" | "bearish", "reason": "análise em 2-3 frases", "risk": "baixo" | "médio" | "alto" }
  ]
}
Selecione 5 ações, seja objetivo, considere cenário macro brasileiro, português do Brasil.`;

  try {
    const result = parseJSON(await callGemini(systemPrompt, `Ações da B3 hoje:\n${stockData}`));
    if (result) setCache(cacheKey, result);
    return result;
  } catch (e) {
    if (e.message?.startsWith('COOLDOWN:')) return { error: true, cooldown: parseInt(e.message.split(':')[1]) };
    return null;
  }
}

/**
 * Analisa gastos do usuário.
 */
export async function analyzeSpending(summary) {
  const cacheKey = 'spending_' + JSON.stringify(summary).slice(0, 80);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const systemPrompt = `Você é um consultor financeiro pessoal brasileiro.
Retorne APENAS JSON:
{
  "overall_health": "good" | "attention" | "critical",
  "score": 0-100,
  "summary": "avaliação em 2-3 frases",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "highlight": "o ponto mais importante"
}
Seja prático e encorajador. Português do Brasil.`;

  const userData = `Receita: R$${summary.income}, Despesa: R$${summary.expense}, Guardado: R$${summary.saved}, Disponível: R$${summary.available}
Categorias: ${summary.topCategories?.map(c => `${c.name}: R$${c.value}`).join(', ') || 'Sem dados'}
Tendências: ${summary.trends?.map(t => `${t.category} ${t.direction === 'up' ? '↑' : '↓'} ${t.change}%`).join(', ') || 'Sem dados'}`;

  try {
    const result = parseJSON(await callGemini(systemPrompt, userData));
    if (result) setCache(cacheKey, result);
    return result;
  } catch (e) {
    if (e.message?.startsWith('COOLDOWN:')) return { error: true, cooldown: parseInt(e.message.split(':')[1]) };
    return null;
  }
}

export function isGeminiConfigured() {
  return !!import.meta.env.VITE_GEMINI_KEY;
}
