import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Landmark, Shield, Target, Wallet, PiggyBank, BarChart3, ExternalLink, Play, Clock, Youtube, RefreshCw, AlertTriangle } from 'lucide-react';

/* ── Artigos (links verificados via search) ── */
const ARTICLES = [
  { id:1, title:'Guia do investidor iniciante', cat:'Fundamentos', time:'8 min', icon:Shield, color:'#10b981', url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/guia-do-investidor-iniciante/' },
  { id:2, title:'Trilha: como começar a investir', cat:'Fundamentos', time:'10 min', icon:TrendingUp, color:'#3b82f6', url:'https://conteudos.xpi.com.br/aprenda-a-investir/trilhas/como-comecar-a-investir/' },
  { id:3, title:'Método 50-30-20: organize seu salário', cat:'Orçamento', time:'5 min', icon:Wallet, color:'#8b5cf6', url:'https://blog.nubank.com.br/regra-50-30-20/' },
  { id:4, title:'Renda fixa: CDB, LCI, LCA e mais', cat:'Renda Fixa', time:'10 min', icon:Landmark, color:'#06b6d4', url:'https://conteudos.xpi.com.br/renda-fixa/' },
  { id:5, title:'Tesouro Direto: guia oficial', cat:'Renda Fixa', time:'8 min', icon:Shield, color:'#14b8a6', url:'https://www.tesourodireto.com.br/conheca/conheca-o-tesouro-direto.htm' },
  { id:6, title:'9 investimentos para iniciantes', cat:'Investimentos', time:'12 min', icon:BarChart3, color:'#6366f1', url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/' },
  { id:7, title:'Fundos imobiliários: como investir', cat:'Investimentos', time:'10 min', icon:PiggyBank, color:'#f97316', url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/fundos-imobiliarios/' },
  { id:8, title:'Negocie dívidas com desconto', cat:'Fundamentos', time:'5 min', icon:Target, color:'#ef4444', url:'https://www.serasa.com.br/limpa-nome-online/' },
  { id:9, title:'Método 50-30-20 para saúde financeira', cat:'Orçamento', time:'6 min', icon:Wallet, color:'#0d9488', url:'https://www.serasa.com.br/score/blog/metodo-50-30-20-como-utilizar/' },
  { id:10, title:'10 dicas de investimento para iniciantes', cat:'Investimentos', time:'8 min', icon:TrendingUp, color:'#ec4899', url:'https://riconnect.rico.com.vc/blog/dicas-de-investimento/' },
];

/* ── YouTube search queries ── */
const YT_QUERIES = [
  'como começar investir iniciante',
  'renda fixa CDB tesouro direto',
  'organizar finanças pessoais',
  'reserva de emergência onde investir',
  'fundos imobiliários para iniciantes',
  'regra 50 30 20 salário',
];

const YT_CACHE_KEY = 'quanto_yt_cache';
const YT_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 horas
const CATS = ['Todos', 'Fundamentos', 'Orçamento', 'Renda Fixa', 'Investimentos'];

function getCachedVideos() {
  try { const raw = sessionStorage.getItem(YT_CACHE_KEY); if (!raw) return null; const { data, ts } = JSON.parse(raw); return Date.now() - ts > YT_CACHE_TTL ? null : data; } catch { return null; }
}
function setCachedVideos(data) {
  try { sessionStorage.setItem(YT_CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

async function fetchYouTubeVideos(apiKey) {
  const cached = getCachedVideos();
  if (cached) return cached;

  const allVideos = [];
  for (const q of YT_QUERIES) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=2&relevanceLanguage=pt&regionCode=BR&order=relevance&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) { if (res.status === 403) return []; continue; }
      const data = await res.json();
      if (data.items) {
        data.items.forEach(item => {
          if (!allVideos.find(v => v.id === item.id.videoId)) {
            allVideos.push({
              id: item.id.videoId,
              title: item.snippet.title.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"),
              channel: item.snippet.channelTitle,
              thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
              date: item.snippet.publishedAt,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            });
          }
        });
      }
    } catch (e) { console.warn('YT search error:', e); }
  }
  if (allVideos.length > 0) setCachedVideos(allVideos);
  return allVideos;
}

export default function Education() {
  const [cat, setCat] = useState('Todos');
  const [tab, setTab] = useState('articles');
  const [videos, setVideos] = useState([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const filtered = cat === 'Todos' ? ARTICLES : ARTICLES.filter(a => a.cat === cat);
  const ytKey = import.meta.env.VITE_YOUTUBE_KEY || import.meta.env.VITE_GEMINI_KEY;

  const loadVideos = async () => {
    if (!ytKey) { setYtError('Configure VITE_YOUTUBE_KEY no .env (mesmo console do Google Cloud, ative "YouTube Data API v3").'); return; }
    setYtLoading(true); setYtError('');
    const result = await fetchYouTubeVideos(ytKey);
    if (result.length > 0) setVideos(result);
    else setYtError('Não foi possível carregar vídeos. Verifique se a YouTube Data API v3 está ativada no seu Google Cloud Console.');
    setYtLoading(false);
  };

  useEffect(() => { if (tab === 'videos' && videos.length === 0 && ytKey) loadVideos(); }, [tab]);

  const formatDate = (iso) => { try { return new Date(iso).toLocaleDateString('pt-BR', { day:'numeric', month:'short' }); } catch { return ''; } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color:'var(--text-primary)' }}>Aprender</h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text-secondary)' }}>Artigos e vídeos para dominar suas finanças</p>
      </div>

      <div className="flex gap-2">
        {[{ id:'articles', label:'Artigos', icon:BookOpen }, { id:'videos', label:'Vídeos', icon:Youtube }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background:tab === t.id ? 'var(--accent-light)' : 'var(--bg-secondary)', color:tab === t.id ? 'var(--accent)' : 'var(--text-secondary)', border:`1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}` }}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'articles' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background:cat === c ? 'var(--accent-light)' : 'var(--bg-tertiary)', color:cat === c ? 'var(--accent)' : 'var(--text-muted)' }}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((a, i) => (
              <motion.a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.04 }}
                className="card p-4 flex items-start gap-3.5 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:a.color + '12' }}>
                  <a.icon className="w-4 h-4" style={{ color:a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:underline" style={{ color:'var(--text-primary)' }}>{a.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded" style={{ background:'var(--bg-tertiary)', color:'var(--text-muted)' }}>{a.cat}</span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color:'var(--text-muted)' }}><Clock className="w-3 h-3" />{a.time}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color:'var(--text-muted)' }} />
              </motion.a>
            ))}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div>
          {ytError && (
            <div className="card p-4 flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color:'#f59e0b' }} />
              <div><p className="text-sm" style={{ color:'var(--text-primary)' }}>{ytError}</p>
                <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>Google Cloud Console → APIs → YouTube Data API v3 → Ativar</p></div>
            </div>
          )}

          {ytLoading && (
            <div className="flex items-center justify-center py-12 gap-3">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ color:'var(--accent)' }} />
              <span className="text-sm" style={{ color:'var(--text-muted)' }}>Carregando vídeos...</span>
            </div>
          )}

          {videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v, i) => (
                <motion.a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.04 }}
                  className="card overflow-hidden group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden" style={{ background:'var(--bg-tertiary)' }}>
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8" style={{ color:'var(--text-muted)' }} /></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 shadow-lg">
                        <Play className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color:'var(--text-primary)' }}>{v.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-medium" style={{ color:'var(--accent)' }}>{v.channel}</span>
                      {v.date && <span className="text-[11px]" style={{ color:'var(--text-muted)' }}>{formatDate(v.date)}</span>}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          {!ytLoading && videos.length === 0 && !ytError && (
            <div className="text-center py-12">
              <Youtube className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
              <p className="text-sm" style={{ color:'var(--text-muted)' }}>Clique na aba para carregar vídeos dos canais</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
