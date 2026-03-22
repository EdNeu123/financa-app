/**
 * Gemini API client com cache, rate limiting e retry.
 * Usa gemini-2.0-flash-lite (30 RPM free tier vs 15 do flash).
 */

const MODEL = 'gemini-2.0-flash-lite';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Cache em memória — evita chamadas repetidas
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 min

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// Rate limiter — mín 10s entre chamadas + cooldown após 429
let lastCall = 0;
let cooldownUntil = 0;

async function waitForSlot() {
  // Se em cooldown por 429, espera
  if (Date.now() < cooldownUntil) {
    const remaining = cooldownUntil - Date.now();
    throw new Error(`COOLDOWN:${Math.ceil(remaining / 1000)}`);
  }
  const now = Date.now();
  const wait = Math.max(0, 10000 - (now - lastCall));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();
}

// Retry com backoff em caso de 429
async function callGemini(prompt, retries = 1) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) return null;

  await waitForSlot();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: 'application/json' },
        }),
      });

      if (res.status === 429) {
        // Set 60s cooldown — stop hammering the API
        cooldownUntil = Date.now() + 60000;
        console.warn('Rate limited. Cooldown 60s.');
        return null;
      }

      if (!res.ok) {
        console.error('API error:', res.status);
        return null;
      }

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e) {
      console.error('Fetch error:', e.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return null;
    }
  }
  return null;
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

  const prompt = `Você é um analista financeiro brasileiro. Analise estas ações da B3 com base nos dados de hoje:

${stockData}

Retorne um JSON com esta estrutura (sem markdown, só JSON):
{
  "analysis_date": "data de hoje",
  "market_summary": "resumo do mercado em 1-2 frases",
  "picks": [
    {
      "ticker": "CÓDIGO",
      "sentiment": "bullish" | "neutral" | "bearish",
      "reason": "análise em 2-3 frases considerando: variação do dia, setor, cenário macro brasileiro (Selic, câmbio, fiscal)",
      "risk": "baixo" | "médio" | "alto"
    }
  ]
}

Regras:
- Selecione as 5 ações mais relevantes
- Seja objetivo e baseado em dados
- Considere o cenário macro brasileiro atual
- Responda em português do Brasil`;

  try {
    const result = parseJSON(await callGemini(prompt));
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

  const prompt = `Você é um consultor financeiro pessoal brasileiro. Analise estes dados:

Receita mensal: R$ ${summary.income}
Despesa mensal: R$ ${summary.expense}
Guardado em metas: R$ ${summary.saved}
Disponível: R$ ${summary.available}

Top categorias de gasto:
${summary.topCategories?.map(c => `- ${c.name}: R$ ${c.value}`).join('\n') || 'Sem dados'}

Tendências:
${summary.trends?.map(t => `- ${t.category}: ${t.direction === 'up' ? '↑' : t.direction === 'down' ? '↓' : '→'} ${t.change}%`).join('\n') || 'Sem dados suficientes'}

Retorne JSON:
{
  "overall_health": "good" | "attention" | "critical",
  "score": 0-100,
  "summary": "avaliação em 2-3 frases",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "highlight": "o ponto mais importante para focar agora"
}

Seja prático e encorajador. Português do Brasil.`;

  try {
    const result = parseJSON(await callGemini(prompt));
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
