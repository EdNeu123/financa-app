import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink, AlertTriangle, Globe, BarChart3, Zap, Info, X, Search, Brain, Calendar } from 'lucide-react';

const TRACKED = ['PETR4','VALE3','ITUB4','BBDC4','ABEV3','WEGE3','BBAS3','RENT3','SUZB3','HAPV3'];

const PICKS = [
  { ticker:'WEGE3', name:'WEG', reason:'Crescimento sólido em exportações industriais e margens acima da média do setor.', sentiment:'bullish', sector:'Industrial', basis:'Resultado trimestral positivo + expansão internacional + câmbio favorável' },
  { ticker:'BBAS3', name:'Banco do Brasil', reason:'Dividend yield acima de 8% ao ano com P/L abaixo da média histórica.', sentiment:'bullish', sector:'Financeiro', basis:'Indicadores fundamentalistas + histórico de dividendos + resultados trimestrais' },
  { ticker:'SUZB3', name:'Suzano', reason:'Celulose em tendência de alta e receita dolarizada protege contra inflação.', sentiment:'bullish', sector:'Papel e Celulose', basis:'Preço da commodity + balanço da empresa + tendência do dólar' },
  { ticker:'RENT3', name:'Localiza', reason:'Retomada do setor de locação, mas endividamento pós-fusão requer atenção.', sentiment:'neutral', sector:'Locação', basis:'Indicadores operacionais + nível de endividamento + cenário macroeconômico' },
  { ticker:'VALE3', name:'Vale', reason:'Minério de ferro pressionado pelo cenário econômico chinês — cautela.', sentiment:'neutral', sector:'Mineração', basis:'Preço do minério de ferro + dados econômicos da China + câmbio' },
];

const buildNewsUrl = (q) => `https://news.google.com/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

const NEWS_TOPICS = [
  { query:'Selic Copom juros decisão', title:'Taxa Selic — Decisões e projeções', cat:'Política monetária' },
  { query:'dólar câmbio real cotação hoje', title:'Câmbio — Dólar e moedas', cat:'Câmbio' },
  { query:'Ibovespa bolsa valores hoje', title:'Ibovespa — Mercado de ações', cat:'Bolsa' },
  { query:'inflação IPCA Brasil economia', title:'Inflação — IPCA e índices', cat:'Economia' },
  { query:'balanço resultados empresas trimestre bolsa', title:'Balanços — Resultados corporativos', cat:'Empresas' },
  { query:'governo fiscal reforma tributária', title:'Política fiscal — Reformas e gastos', cat:'Governo' },
];

import { analyzeStocks, isGeminiConfigured } from '../utils/gemini';

export default function Market({ userPlan }) {
  const isFree = userPlan === 'free';
  const [stocks, setStocks] = useState([]);
  const [ibov, setIbov] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showMethod, setShowMethod] = useState(false);
  const [aiPicks, setAiPicks] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [ibovHistory, setIbovHistory] = useState([]);
  const hasGemini = isGeminiConfigured();

  const fetchAiAnalysis = async (stockData) => {
    if (!hasGemini || !stockData?.length) return;
    setAiLoading(true);
    const result = await analyzeStocks(stockData);
    if (result?.error && result.cooldown) {
      setAiPicks({ market_summary: `Limite atingido. Tente novamente em ${result.cooldown}s.`, picks: [] });
    } else if (result && !result.error) {
      setAiPicks(result);
    }
    setAiLoading(false);
  };

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    const token = import.meta.env.VITE_BRAPI_TOKEN || '';
    if (!token) { setError('As cotações em tempo real precisam ser configuradas pelo administrador. Consulte a documentação.'); setLoading(false); return; }
    try {
      // Fetch each stock individually (free tier = 1 per request)
      const results = [];
      for (const ticker of TRACKED) {
        try {
          const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`);
          if (res.ok) {
            const data = await res.json();
            if (data.results?.[0]) {
              const s = data.results[0];
              results.push({ ticker:s.symbol, name:s.shortName||s.longName||s.symbol, price:s.regularMarketPrice, change:s.regularMarketChangePercent, high:s.regularMarketDayHigh, low:s.regularMarketDayLow });
            }
          }
          // Small delay to respect rate limits
          await new Promise(r => setTimeout(r, 300));
        } catch {}
      }
      if (results.length > 0) setStocks(results);

      // Fetch IBOV + historical
      try {
        await new Promise(r => setTimeout(r, 300));
        const ir = await fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${token}&range=1mo&interval=1d`);
        if (ir.ok) {
          const ib = await ir.json();
          if (ib.results?.[0]) {
            setIbov({ price: ib.results[0].regularMarketPrice, change: ib.results[0].regularMarketChangePercent });
            // Extract historical prices
            const hist = ib.results[0].historicalDataPrice;
            if (hist?.length) {
              setIbovHistory(hist.map(h => ({
                date: new Date(h.date * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                price: Math.round(h.close),
              })));
            }
          }
        }
      } catch {}

      if (results.length === 0) setError('Nenhuma cotação carregada. Verifique o token da API.');
      else setLastUpdate(new Date());
    } catch(e) { console.error(e); setError('Falha ao carregar cotações. Verifique seu token e conexão.'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); const iv=setInterval(fetchData,300000); return()=>clearInterval(iv); }, [fetchData]); // 5min (11 requests per cycle)

  const sC={bullish:'#10b981',bearish:'#ef4444',neutral:'#f59e0b'};
  const sL={bullish:'Alta',bearish:'Baixa',neutral:'Neutro'};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div><h1 className="text-xl sm:text-2xl font-bold font-display" style={{color:'var(--text-primary)'}}>Mercado</h1><p className="text-xs sm:text-sm mt-0.5" style={{color:'var(--text-secondary)'}}>Cotações, sugestões e notícias</p></div>
        <div className="flex items-center gap-3">
          {lastUpdate&&<span className="text-xs" style={{color:'var(--text-muted)'}}>Atualizado {lastUpdate.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>}
          <button onClick={fetchData} disabled={loading} className="btn-ghost flex items-center gap-2 text-sm"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/>{loading?'...':'Atualizar'}</button>
        </div>
      </div>

      {isFree ? (
        <div className="card p-8 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{color:'var(--text-muted)'}}/>
          <h2 className="text-xl font-bold font-display mb-2" style={{color:'var(--text-primary)'}}>Mercado financeiro</h2>
          <p className="text-sm mb-4 max-w-md mx-auto" style={{color:'var(--text-secondary)'}}>Ibovespa em tempo real, cotações de ações, sugestões com IA e notícias — disponível no plano Pro.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{background:'var(--accent-light)', color:'var(--accent)'}}>
            Integração de pagamento em breve
          </div>
        </div>
      ) : (<>

      {error&&(<div className="card p-4 flex items-start gap-3" style={{borderColor:'#f59e0b'}}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:'#f59e0b'}}/>
        <div><p className="text-sm" style={{color:'var(--text-primary)'}}>{error}</p>
          <p className="text-xs mt-1" style={{color:'var(--accent)'}}>Verifique o arquivo .env.example para instruções de configuração.</p>
        </div>
      </div>)}

      {ibov&&(<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card-glass p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d={`M0,80 C50,${ibov.change>=0?'70':'85'} 100,${ibov.change>=0?'60':'80'} 150,${ibov.change>=0?'50':'75'} S250,${ibov.change>=0?'30':'60'} 300,${ibov.change>=0?'25':'55'} S380,${ibov.change>=0?'15':'50'} 400,${ibov.change>=0?'10':'45'}`} fill="none" stroke={ibov.change>=0?'#10b981':'#ef4444'} strokeWidth="3"/>
          </svg>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:(ibov.change>=0?'#10b981':'#ef4444')+'15'}}><BarChart3 className="w-6 h-6" style={{color:ibov.change>=0?'#10b981':'#ef4444'}}/></div>
            <div>
              <p className="text-xs uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Índice Ibovespa</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono" style={{color:'var(--text-primary)'}}>{Number(ibov.price).toLocaleString('pt-BR',{maximumFractionDigits:0})}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl" style={{background:(ibov.change>=0?'#10b981':'#ef4444')+'12'}}>
              {ibov.change>=0?<TrendingUp className="w-5 h-5" style={{color:'#10b981'}}/>:<TrendingDown className="w-5 h-5" style={{color:'#ef4444'}}/>}
              <span className="text-base font-mono font-bold" style={{color:ibov.change>=0?'#10b981':'#ef4444'}}>{ibov.change>=0?'+':''}{Number(ibov.change).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        {/* Chart from real historical data */}
        {ibovHistory.length > 0 && (
          <div className="mt-4 h-[120px] sm:h-[160px] -ml-4 -mr-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ibovHistory}>
                <defs>
                  <linearGradient id="ibov-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ibov.change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={ibov.change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} width={45} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--bg-card-solid, var(--bg-card))', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-muted)' }} formatter={(v) => [`${Number(v).toLocaleString('pt-BR')} pts`, 'Ibovespa']} />
                <Area type="monotone" dataKey="price" stroke={ibov.change >= 0 ? '#10b981' : '#ef4444'} fill="url(#ibov-grad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="lg:col-span-2 card p-3 sm:p-5">
          <p className="section-title">Cotações</p>
          {stocks.length===0?<p className="text-sm py-8 text-center" style={{color:'var(--text-muted)'}}>{loading?'Carregando...':'Configure o token para ver cotações'}</p>:(
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{borderBottom:'1px solid var(--border)'}}>
              <th className="text-left py-2 text-xs font-medium" style={{color:'var(--text-muted)'}}>Ação</th>
              <th className="text-right py-2 text-xs font-medium" style={{color:'var(--text-muted)'}}>Preço</th>
              <th className="text-right py-2 text-xs font-medium" style={{color:'var(--text-muted)'}}>Variação</th>
              <th className="text-right py-2 text-xs font-medium hidden sm:table-cell" style={{color:'var(--text-muted)'}}>Mín / Máx</th>
            </tr></thead><tbody>{stocks.map(s=>(
              <tr key={s.ticker} style={{borderBottom:'1px solid var(--border)'}}>
                <td className="py-3"><p className="font-semibold font-mono" style={{color:'var(--text-primary)'}}>{s.ticker}</p><p className="text-xs truncate max-w-[140px]" style={{color:'var(--text-muted)'}}>{s.name}</p></td>
                <td className="text-right font-mono font-medium" style={{color:'var(--text-primary)'}}>R$ {Number(s.price).toFixed(2)}</td>
                <td className="text-right"><span className="font-mono font-semibold" style={{color:s.change>=0?'#10b981':'#ef4444'}}>{s.change>=0?'+':''}{Number(s.change).toFixed(2)}%</span></td>
                <td className="text-right hidden sm:table-cell text-xs font-mono" style={{color:'var(--text-muted)'}}>{s.low?Number(s.low).toFixed(2):'—'} — {s.high?Number(s.high).toFixed(2):'—'}</td>
              </tr>))}</tbody></table></div>)}
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="card p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {aiPicks?<Brain className="w-4 h-4" style={{color:'#8b5cf6'}}/>:<Zap className="w-4 h-4" style={{color:'var(--accent)'}}/>}
              <p className="text-xs font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{aiPicks?'Análise IA':'Sugestões do dia'}</p>
            </div>
            <div className="flex gap-1">
              {hasGemini&&<button onClick={()=>fetchAiAnalysis(stocks)} disabled={aiLoading} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{background:'rgba(139,92,246,0.1)',color:'#8b5cf6'}}>{aiLoading?<RefreshCw className="w-3 h-3 animate-spin"/>:<Brain className="w-3 h-3"/>}{aiLoading?'...':'IA'}</button>}
              <button onClick={()=>setShowMethod(true)} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{background:'var(--bg-tertiary)',color:'var(--text-muted)'}}><Info className="w-3 h-3"/></button>
            </div>
          </div>
          {aiPicks?.market_summary&&<p className="text-xs mb-3 p-2.5 rounded-lg leading-relaxed" style={{background:'rgba(139,92,246,0.06)',color:'var(--text-secondary)'}}>{aiPicks.market_summary}</p>}
          <div className="space-y-3">{(aiPicks?.picks||PICKS).map(p=>(
            <div key={p.ticker} className="p-3 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-semibold text-sm" style={{color:'var(--text-primary)'}}>{p.ticker}</span>
                <div className="flex items-center gap-1.5">
                  {p.risk&&<span className="text-[9px] px-1.5 py-0.5 rounded" style={{background:'var(--bg-tertiary)',color:'var(--text-muted)'}}>Risco: {p.risk}</span>}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{background:sC[p.sentiment]+'15',color:sC[p.sentiment]}}>{sL[p.sentiment]}</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{color:'var(--text-secondary)'}}>{p.reason}</p>
              {p.basis&&<p className="text-[10px] mt-1.5 flex items-center gap-1" style={{color:'var(--text-muted)'}}><Info className="w-2.5 h-2.5"/>{p.basis}</p>}
            </div>))}</div>
          <p className="text-[10px] mt-4 p-2 rounded-lg leading-relaxed" style={{background:'var(--bg-tertiary)',color:'var(--text-muted)'}}>
            {aiPicks?'Análise gerada por IA com dados reais. ':''}Não constitui recomendação de investimento.
          </p>
        </motion.div>
      </div>

      {/* News - Google News search links */}
      <div className="card p-3 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Globe className="w-4 h-4" style={{color:'var(--accent)'}}/><p className="section-title !mb-0">Notícias do mercado</p></div>
          <span className="text-[11px] flex items-center gap-1" style={{color:'var(--text-muted)'}}><Calendar className="w-3 h-3"/>{new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})}</span>
        </div>
        <p className="text-xs mb-4" style={{color:'var(--text-muted)'}}>Clique para ver as notícias mais recentes sobre cada tema</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {NEWS_TOPICS.map((n,i)=>(
            <motion.a key={i} href={buildNewsUrl(n.query)} target="_blank" rel="noopener noreferrer" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
              className="card !p-3 sm:!p-4 flex items-center gap-3 group cursor-pointer hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'var(--accent-light)'}}><Search className="w-4 h-4" style={{color:'var(--accent)'}}/></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:underline" style={{color:'var(--text-primary)'}}>{n.title}</p>
                <p className="text-[11px] mt-0.5 flex items-center gap-2" style={{color:'var(--text-muted)'}}>
                  <span>{n.cat}</span>
                  <span>·</span>
                  <span>Atualizado hoje</span>
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{color:'var(--text-muted)'}}/>
            </motion.a>))}
        </div>
      </div>

      {/* Methodology modal */}
      <AnimatePresence>{showMethod&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={()=>setShowMethod(false)}>
          <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} onClick={e=>e.stopPropagation()} className="card w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'var(--border)'}}><h3 className="text-lg font-bold font-display" style={{color:'var(--text-primary)'}}>Como funcionam as sugestões</h3><button onClick={()=>setShowMethod(false)} className="p-2 rounded-lg" style={{color:'var(--text-muted)'}}><X className="w-4 h-4"/></button></div>
            <div className="p-5 space-y-3 text-sm" style={{color:'var(--text-secondary)'}}>
              <p>As sugestões combinam múltiplos fatores públicos:</p>
              {['Análise fundamentalista — P/L, P/VP, dividend yield, margem e ROE vs média do setor','Notícias e sentimento — Monitoramento dos principais veículos financeiros brasileiros','Macroeconômico — Selic, inflação, câmbio e impacto setorial','Commodities — Para exportadoras: minério, celulose, petróleo','Resultados trimestrais — Comparação com expectativas do consenso'].map((t,i)=>(
                <div key={i} className="p-3 rounded-xl" style={{background:'var(--bg-secondary)'}}><p className="text-xs" style={{color:'var(--text-primary)'}}>{t}</p></div>))}
              <div className="p-3 rounded-xl" style={{background:'rgba(245,158,11,0.08)'}}><p className="text-xs" style={{color:'#f59e0b'}}><strong>Aviso:</strong> Caráter educacional. Consulte um assessor certificado antes de investir.</p></div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
      </>)}
    </div>
  );
}
