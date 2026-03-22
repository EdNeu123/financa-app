/**
 * POST /api/gemini
 * Body: { type: "stocks" | "spending", data: { ... } }
 *
 * Chama Gemini no server-side — key nunca chega ao browser.
 */

const MODEL = 'gemini-2.0-flash';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_KEY não configurada no servidor' });

  const { type, data } = req.body || {};
  if (!type || !data) return res.status(400).json({ error: 'Campos type e data são obrigatórios' });

  let systemPrompt, userMessage;

  if (type === 'stocks') {
    if (!Array.isArray(data.stocks) || data.stocks.length === 0) {
      return res.status(400).json({ error: 'stocks deve ser um array' });
    }
    const stockData = data.stocks.map(s =>
      `${s.ticker}: R$${Number(s.price).toFixed(2)} (${s.change >= 0 ? '+' : ''}${Number(s.change).toFixed(2)}%)`
    ).join('\n');

    systemPrompt = `Você é um analista financeiro brasileiro especializado em B3.
Retorne APENAS JSON:
{
  "analysis_date": "data de hoje",
  "market_summary": "resumo em 1-2 frases",
  "picks": [
    { "ticker": "CÓDIGO", "sentiment": "bullish" | "neutral" | "bearish", "reason": "análise em 2-3 frases", "risk": "baixo" | "médio" | "alto" }
  ]
}
Selecione 5 ações, seja objetivo, considere cenário macro brasileiro, português do Brasil.`;
    userMessage = `Ações da B3 hoje:\n${stockData}`;

  } else if (type === 'spending') {
    systemPrompt = `Você é um consultor financeiro pessoal brasileiro.
Retorne APENAS JSON:
{
  "overall_health": "good" | "attention" | "critical",
  "score": 0-100,
  "summary": "avaliação em 2-3 frases",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "highlight": "o ponto mais importante"
}
Seja prático e encorajador. Português do Brasil.`;
    userMessage = `Receita: R$${data.income}, Despesa: R$${data.expense}, Guardado: R$${data.saved}, Disponível: R$${data.available}
Categorias: ${data.topCategories?.map(c => `${c.name}: R$${c.value}`).join(', ') || 'Sem dados'}
Tendências: ${data.trends?.map(t => `${t.category} ${t.direction === 'up' ? '↑' : '↓'} ${t.change}%`).join(', ') || 'Sem dados'}`;

  } else {
    return res.status(400).json({ error: 'type deve ser "stocks" ou "spending"' });
  }

  try {
    const response = await fetch(`${BASE}/${MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      }),
    });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited', cooldown: 120 });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: `Gemini API error: ${response.status}` });
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return res.status(500).json({ error: 'Resposta vazia do Gemini' });

    // Parse JSON from Gemini response
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return res.status(200).json(JSON.parse(match[0]));
      return res.status(500).json({ error: 'Resposta inválida do Gemini' });
    }
  } catch (err) {
    console.error('Gemini error:', err.message);
    return res.status(500).json({ error: 'Falha na comunicação com Gemini' });
  }
};
