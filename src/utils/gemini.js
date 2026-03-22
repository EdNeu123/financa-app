/**
 * Gemini API client — mesmo padrão do mega-sena-mvc que funciona.
 * Usa systemInstruction separado + contents curto + gemini-2.0-flash.
 */

const MODEL = 'gemini-2.0-flash';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Cache em memória — 30 min
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// Rate limiter — mín 6s entre chamadas + cooldown após 429
let lastCall = 0;
let cooldownUntil = 0;

/**
 * Chamada principal — segue o padrão que funciona:
 * - systemInstruction separado do contents
 * - contents com mensagem curta
 * - responseMimeType: application/json
 */
async function callGemini(systemPrompt, userMessage) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) return null;

  // Cooldown check
  if (Date.now() < cooldownUntil) {
    const remaining = cooldownUntil - Date.now();
    throw new Error(`COOLDOWN:${Math.ceil(remaining / 1000)}`);
  }

  // Rate limit — min 6s entre chamadas
  const now = Date.now();
  const wait = Math.max(0, 6000 - (now - lastCall));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

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
      cooldownUntil = Date.now() + 60000;
      console.warn('Rate limited. Cooldown 60s.');
      return null;
    }

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
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
Retorne APENAS JSON com esta estrutura:
{
  "analysis_date": "data de hoje",
  "market_summary": "resumo do mercado em 1-2 frases",
  "picks": [
    {
      "ticker": "CÓDIGO",
      "sentiment": "bullish" | "neutral" | "bearish",
      "reason": "análise em 2-3 frases",
      "risk": "baixo" | "médio" | "alto"
    }
  ]
}
Regras: selecione 5 ações mais relevantes, seja objetivo, considere cenário macro brasileiro, português do Brasil.`;

  const userMessage = `Analise estas ações da B3 hoje:\n${stockData}`;

  try {
    const result = parseJSON(await callGemini(systemPrompt, userMessage));
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
  const cacheKey = 'spending_' + JSON.stringify(summary).slice(0, 100);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const systemPrompt = `Você é um consultor financeiro pessoal brasileiro.
Retorne APENAS JSON com esta estrutura:
{
  "overall_health": "good" | "attention" | "critical",
  "score": 0-100,
  "summary": "avaliação em 2-3 frases",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "highlight": "o ponto mais importante para focar agora"
}
Seja prático e encorajador. Português do Brasil.`;

  const userData = `Receita: R$ ${summary.income}
Despesa: R$ ${summary.expense}
Guardado: R$ ${summary.saved}
Disponível: R$ ${summary.available}
Top categorias: ${summary.topCategories?.map(c => `${c.name}: R$ ${c.value}`).join(', ') || 'Sem dados'}
Tendências: ${summary.trends?.map(t => `${t.category}: ${t.direction === 'up' ? '↑' : t.direction === 'down' ? '↓' : '→'} ${t.change}%`).join(', ') || 'Sem dados'}`;

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
