/**
 * Gemini API client — análise de ações com IA.
 * Usa gemini-2.0-flash (rápido, dentro do free tier).
 */

const MODEL = 'gemini-2.0-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Chama a Gemini API com um prompt.
 * Retorna o texto da resposta ou null em caso de erro.
 */
async function callGemini(prompt) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${BASE_URL}/${MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      console.error('Gemini API error:', res.status);
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (e) {
    console.error('Gemini fetch error:', e);
    return null;
  }
}

/**
 * Gera análise de ações baseada em dados reais de cotação.
 * Recebe array de stocks da brapi.dev e retorna sugestões.
 */
export async function analyzeStocks(stocks) {
  if (!stocks?.length) return null;

  const stockData = stocks.map(s =>
    `${s.ticker}: R$${Number(s.price).toFixed(2)} (${s.change >= 0 ? '+' : ''}${Number(s.change).toFixed(2)}%)`
  ).join('\n');

  const prompt = `Você é um analista financeiro brasileiro. Analise estas ações da B3 com base nos dados de hoje:

${stockData}

Retorne um JSON com esta estrutura (sem markdown, só o JSON puro):
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
- Selecione as 5 ações mais relevantes para análise
- Seja objetivo e baseado em dados, não especulativo
- Considere o cenário macro brasileiro atual (Selic alta, fiscal em debate)
- Inclua disclaimer que não é recomendação de investimento
- Responda em português do Brasil`;

  const raw = await callGemini(prompt);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // Tenta extrair JSON se veio com markdown
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return null;
  }
}

/**
 * Gera insights personalizados sobre os gastos do usuário.
 */
export async function analyzeSpending(summary) {
  const prompt = `Você é um consultor financeiro pessoal brasileiro. Analise estes dados financeiros:

Receita mensal: R$ ${summary.income}
Despesa mensal: R$ ${summary.expense}
Guardado em metas: R$ ${summary.saved}
Disponível: R$ ${summary.available}

Top categorias de gasto:
${summary.topCategories?.map(c => `- ${c.name}: R$ ${c.value}`).join('\n') || 'Sem dados'}

Tendências detectadas:
${summary.trends?.map(t => `- ${t.category}: ${t.direction === 'up' ? '↑' : t.direction === 'down' ? '↓' : '→'} ${t.change}%`).join('\n') || 'Sem dados suficientes'}

Retorne um JSON:
{
  "overall_health": "good" | "attention" | "critical",
  "score": 0-100,
  "summary": "avaliação geral em 2-3 frases",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "highlight": "o ponto mais importante para o usuário focar agora"
}

Seja prático, direto e encorajador. Português do Brasil.`;

  const raw = await callGemini(prompt);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch {} }
    return null;
  }
}

/** Verifica se a API está configurada */
export function isGeminiConfigured() {
  return !!import.meta.env.VITE_GEMINI_KEY;
}
