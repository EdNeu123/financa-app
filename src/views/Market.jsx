import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown, RefreshCw, ExternalLink, Clock, AlertTriangle, Globe, BarChart3, Star, Zap } from 'lucide-react';

const TRACKED_STOCKS = ['PETR4','VALE3','ITUB4','BBDC4','ABEV3','WEGE3','BBAS3','RENT3','MGLU3','SUZB3','HAPV3','RDOR3'];

const DAILY_PICKS = [
  { ticker:'WEGE3', name:'WEG', reason:'Crescimento sólido em exportações e demanda industrial global', sentiment:'bullish', sector:'Industrial' },
  { ticker:'BBAS3', name:'Banco do Brasil', reason:'Dividendos consistentes e P/L atrativo comparado aos pares', sentiment:'bullish', sector:'Financeiro' },
  { ticker:'SUZB3', name:'Suzano', reason:'Preço da celulose em alta e câmbio favorável para exportadores', sentiment:'bullish', sector:'Papel e Celulose' },
  { ticker:'RENT3', name:'Localiza', reason:'Setor de locação em recuperação e frota renovada', sentiment:'neutral', sector:'Locação' },
  { ticker:'VALE3', name:'Vale', reason:'Minério de ferro oscilando, cenário na China incerto', sentiment:'neutral', sector:'Mineração' },
];

const NEWS = [
  { title:'Selic deve se manter em alta segundo ata do Copom', source:'InfoMoney', time:'2h atrás', url:'https://www.infomoney.com.br', sentiment:'bearish' },
  { title:'Dólar recua e fecha abaixo de R$ 5,70', source:'Valor Econômico', time:'3h atrás', url:'https://www.valor.com.br', sentiment:'bullish' },
  { title:'WEG registra recorde de receita no trimestre', source:'Bloomberg Línea', time:'5h atrás', url:'https://www.bloomberglinea.com.br', sentiment:'bullish' },
  { title:'Governo estuda novas medidas fiscais para 2026', source:'Folha', time:'6h atrás', url:'https://www.folha.uol.com.br', sentiment:'bearish' },
  { title:'Petrobras anuncia dividendo extraordinário', source:'InfoMoney', time:'8h atrás', url:'https://www.infomoney.com.br', sentiment:'bullish' },
];

export default function Market() {
  const [stocks, setStocks] = useState([]);
  const [ibov, setIbov] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`https://brapi.dev/api/quote/${TRACKED_STOCKS.join(',')}?token=demo`);
      if (!res.ok) throw new Error('API indisponível');
      const data = await res.json();
      if (data.results) {
        setStocks(data.results.map(s => ({
          ticker: s.symbol, name: s.shortName || s.longName || s.symbol,
          price: s.regularMarketPrice, change: s.regularMarketChangePercent,
          volume: s.regularMarketVolume, high: s.regularMarketDayHigh, low: s.regularMarketDayLow,
        })));
      }
      // Fetch IBOV
      const ibovRes = await fetch('https://brapi.dev/api/quote/%5EBVSP?token=demo');
      if (ibovRes.ok) { const ib = await ibovRes.json(); if (ib.results?.[0]) { setIbov({ price: ib.results[0].regularMarketPrice, change: ib.results[0].regularMarketChangePercent }); } }
      setLastUpdate(new Date());
    } catch (e) { setError('Não foi possível carregar dados do mercado. Tente novamente.'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); const iv = setInterval(fetchData, 60000); return () => clearInterval(iv); }, [fetchData]);

  const sentimentColors = { bullish: '#10b981', bearish: '#ef4444', neutral: '#f59e0b' };
  const sentimentLabels = { bullish: 'Alta', bearish: 'Baixa', neutral: 'Neutro' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Mercado</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Ibovespa, cotações e sugestões baseadas em notícias</p></div>
        <div className="flex items-center gap-3">
          {lastUpdate && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Atualizado {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button onClick={fetchData} disabled={loading} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />{loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 flex items-center gap-3" style={{ borderColor: 'var(--danger)' }}>
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
          <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      )}

      {/* IBOV Summary */}
      {ibov && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: (ibov.change >= 0 ? '#10b981' : '#ef4444') + '15' }}>
            <BarChart3 className="w-6 h-6" style={{ color: ibov.change >= 0 ? '#10b981' : '#ef4444' }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ibovespa</p>
            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{Number(ibov.price).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: (ibov.change >= 0 ? '#10b981' : '#ef4444') + '15' }}>
            {ibov.change >= 0 ? <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} /> : <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />}
            <span className="text-sm font-mono font-semibold" style={{ color: ibov.change >= 0 ? '#10b981' : '#ef4444' }}>{ibov.change >= 0 ? '+' : ''}{Number(ibov.change).toFixed(2)}%</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stocks table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card p-5">
          <p className="section-title">Cotações</p>
          {stocks.length === 0 && !loading ? <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>Sem dados</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Ação</th>
                  <th className="text-right py-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Preço</th>
                  <th className="text-right py-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Variação</th>
                  <th className="text-right py-2 text-xs font-medium hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Mín/Máx</th>
                </tr></thead>
                <tbody>{stocks.map(s => (
                  <tr key={s.ticker} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3"><p className="font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{s.ticker}</p><p className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{s.name}</p></td>
                    <td className="text-right font-mono font-medium" style={{ color: 'var(--text-primary)' }}>R$ {Number(s.price).toFixed(2)}</td>
                    <td className="text-right"><span className="font-mono font-semibold" style={{ color: s.change >= 0 ? '#10b981' : '#ef4444' }}>{s.change >= 0 ? '+' : ''}{Number(s.change).toFixed(2)}%</span></td>
                    <td className="text-right hidden sm:table-cell text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{Number(s.low).toFixed(2)} — {Number(s.high).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Daily picks */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4"><Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sugestões do dia</p></div>
          <div className="space-y-3">
            {DAILY_PICKS.map(p => (
              <div key={p.ticker} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.ticker}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: sentimentColors[p.sentiment] + '15', color: sentimentColors[p.sentiment] }}>{sentimentLabels[p.sentiment]}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.reason}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{p.sector}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            As sugestões são baseadas em análises de notícias e não constituem recomendação de investimento.
          </p>
        </motion.div>
      </div>

      {/* News */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4"><Globe className="w-4 h-4" style={{ color: 'var(--accent)' }} /><p className="section-title !mb-0">Notícias do mercado</p></div>
        <div className="space-y-3">
          {NEWS.map((n, i) => (
            <motion.a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl transition-all group hover:shadow-sm" style={{ background: 'var(--bg-secondary)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sentimentColors[n.sentiment] }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:underline" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5"><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.source}</span><span style={{ color: 'var(--border)' }}>·</span><span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" />{n.time}</span></div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
