/**
 * GET /api/youtube
 *
 * Busca vídeos de educação financeira no YouTube Data API v3.
 * Retorna: { videos: [...] }
 */

const QUERIES = [
  'como organizar finanças pessoais 2024',
  'investimento para iniciantes Brasil',
  'como sair das dívidas',
  'educação financeira dicas práticas',
  'reserva de emergência como montar',
  'renda extra ideias Brasil',
];

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.YOUTUBE_KEY;
  if (!key) return res.status(500).json({ error: 'YOUTUBE_KEY não configurada no servidor' });

  const videos = [];

  for (const q of QUERIES) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=2&relevanceLanguage=pt&regionCode=BR&order=relevance&key=${key}`;
      const r = await fetch(url);
      if (r.ok) {
        const data = await r.json();
        if (data.items) {
          for (const item of data.items) {
            if (item.id?.videoId && item.snippet) {
              videos.push({
                id: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                publishedAt: item.snippet.publishedAt,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              });
            }
          }
        }
      }
    } catch {}
  }

  return res.status(200).json({ videos });
};
