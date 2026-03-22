/**
 * GET /api/stocks
 *
 * Busca cotações da brapi.dev no server-side.
 * Retorna: { stocks: [...], ibov: { price, change, history: [...] } }
 */

const TRACKED = ['PETR4','VALE3','ITUB4','BBDC4','ABEV3','WEGE3','BBAS3','RENT3','SUZB3','HAPV3'];

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.BRAPI_TOKEN;
  if (!token) return res.status(500).json({ error: 'BRAPI_TOKEN não configurado no servidor' });

  const stocks = [];
  let ibov = null;
  let ibovHistory = [];

  // Fetch each stock individually (free tier = 1 per request)
  for (const ticker of TRACKED) {
    try {
      const r = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`);
      if (r.ok) {
        const d = await r.json();
        if (d.results?.[0]) {
          const s = d.results[0];
          stocks.push({
            ticker: s.symbol,
            name: s.shortName || s.longName || s.symbol,
            price: s.regularMarketPrice,
            change: s.regularMarketChangePercent,
            high: s.regularMarketDayHigh,
            low: s.regularMarketDayLow,
          });
        }
      }
      await sleep(250);
    } catch {}
  }

  // Fetch Ibovespa + historical
  try {
    await sleep(250);
    const r = await fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${token}&range=1mo&interval=1d`);
    if (r.ok) {
      const d = await r.json();
      if (d.results?.[0]) {
        ibov = {
          price: d.results[0].regularMarketPrice,
          change: d.results[0].regularMarketChangePercent,
        };
        const hist = d.results[0].historicalDataPrice;
        if (hist?.length) {
          ibovHistory = hist.map(h => ({
            date: new Date(h.date * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            price: Math.round(h.close),
          }));
        }
      }
    }
  } catch {}

  return res.status(200).json({ stocks, ibov, ibovHistory });
};
