import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Landmark, Shield, Target, Wallet, PiggyBank, BarChart3, ExternalLink, Play, Clock, Filter } from 'lucide-react';

const ARTICLES = [
  { id:1, title:'Reserva de emergência: quanto guardar e onde investir', cat:'Fundamentos', time:'5 min', icon:Shield, color:'#10b981',
    url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/guia-do-investidor-iniciante/' },
  { id:2, title:'Como começar a investir do zero', cat:'Fundamentos', time:'8 min', icon:TrendingUp, color:'#3b82f6',
    url:'https://conteudos.xpi.com.br/aprenda-a-investir/trilhas/como-comecar-a-investir/' },
  { id:3, title:'Regra 50-30-20: divida seu salário de forma inteligente', cat:'Orçamento', time:'4 min', icon:Wallet, color:'#8b5cf6',
    url:'https://www.serasa.com.br/ensina/dicas/regra-50-30-20/' },
  { id:4, title:'CDB, LCI, LCA: entenda os títulos de renda fixa', cat:'Renda Fixa', time:'10 min', icon:Landmark, color:'#06b6d4',
    url:'https://conteudos.xpi.com.br/renda-fixa/' },
  { id:5, title:'Tesouro Direto: como funciona e como investir', cat:'Renda Fixa', time:'8 min', icon:Shield, color:'#14b8a6',
    url:'https://www.tesourodireto.com.br/conheca/conheca-o-tesouro-direto.htm' },
  { id:6, title:'9 investimentos para iniciantes', cat:'Investimentos', time:'12 min', icon:BarChart3, color:'#6366f1',
    url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/' },
  { id:7, title:'Fundos imobiliários (FIIs): o que são e como investir', cat:'Investimentos', time:'10 min', icon:PiggyBank, color:'#f97316',
    url:'https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/fundos-imobiliarios/' },
  { id:8, title:'Como sair das dívidas e limpar o nome', cat:'Fundamentos', time:'6 min', icon:Target, color:'#ef4444',
    url:'https://www.serasa.com.br/limpa-nome-online/' },
  { id:9, title:'Renda fixa na XP: guia completo', cat:'Renda Fixa', time:'10 min', icon:Landmark, color:'#0d9488',
    url:'https://www.xpi.com.br/produtos/renda-fixa/' },
  { id:10, title:'Educação financeira — Banco Central do Brasil', cat:'Fundamentos', time:'5 min', icon:Wallet, color:'#ec4899',
    url:'https://www.bcb.gov.br/cidadaniafinanceira' },
];

const VIDEOS = [
  { id:1, title:'Guia BÁSICO para investir com POUCO dinheiro', channel:'Primo Rico', dur:'18:42',
    vid:'dJyJ77GkhBE' },
  { id:2, title:'Como ORGANIZAR a vida financeira do ZERO', channel:'Me Poupe!', dur:'15:30',
    vid:'HnFBbuyascE' },
  { id:3, title:'RENDA FIXA: como escolher o melhor investimento', channel:'Primo Rico', dur:'20:11',
    vid:'MOlG_ruLbLg' },
  { id:4, title:'Tesouro Direto para INICIANTES — passo a passo', channel:'O Primo Rico', dur:'16:45',
    vid:'N8R3GwMgGaM' },
  { id:5, title:'Como montar uma CARTEIRA DE INVESTIMENTOS', channel:'Primo Rico', dur:'22:33',
    vid:'EevGexB_bzI' },
  { id:6, title:'RESERVA DE EMERGÊNCIA: onde investir?', channel:'Primo Rico', dur:'14:18',
    vid:'N1SLr4FgB8Y' },
];

const CATS = ['Todos', 'Fundamentos', 'Orçamento', 'Renda Fixa', 'Investimentos'];

export default function Education() {
  const [cat, setCat] = useState('Todos');
  const [tab, setTab] = useState('articles');
  const filtered = cat === 'Todos' ? ARTICLES : ARTICLES.filter(a => a.cat === cat);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Aprender</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Artigos e vídeos para dominar suas finanças</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'articles', label: 'Artigos', icon: BookOpen }, { id: 'videos', label: 'Vídeos', icon: Play }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: tab === t.id ? 'var(--accent-light)' : 'var(--bg-secondary)', color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}` }}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'articles' && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: cat === c ? 'var(--accent-light)' : 'var(--bg-tertiary)', color: cat === c ? 'var(--accent)' : 'var(--text-muted)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((a, i) => (
              <motion.a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-4 flex items-start gap-3.5 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: a.color + '12' }}>
                  <a.icon className="w-4.5 h-4.5" style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:underline" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{a.cat}</span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" />{a.time}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color: 'var(--text-muted)' }} />
              </motion.a>
            ))}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIDEOS.map((v, i) => (
            <motion.a key={v.id} href={`https://www.youtube.com/watch?v=${v.vid}`} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card overflow-hidden group cursor-pointer">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <img src={`https://img.youtube.com/vi/${v.vid}/mqdefault.jpg`} alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 shadow-lg">
                    <Play className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white">{v.dur}</span>
              </div>
              <div className="p-3.5">
                <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>{v.title}</p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{v.channel}</p>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
