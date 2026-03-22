import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, ExternalLink, Clock, Star, TrendingUp, Shield, PiggyBank, Landmark, BarChart3, Wallet, Target } from 'lucide-react';

const ARTICLES = [
  { id: 1, title: 'Reserva de emergência: quanto guardar e onde investir', category: 'Fundamentos', readTime: 8, icon: Shield, color: '#10b981', url: 'https://www.infomoney.com.br/guias/reserva-de-emergencia/' },
  { id: 2, title: 'Regra 50-30-20: como dividir seu salário', category: 'Orçamento', readTime: 5, icon: Wallet, color: '#3b82f6', url: 'https://www.nubank.com.br/blog/regra-50-30-20/' },
  { id: 3, title: 'Como começar a investir com pouco dinheiro', category: 'Investimentos', readTime: 10, icon: TrendingUp, color: '#8b5cf6', url: 'https://www.infomoney.com.br/guias/como-comecar-a-investir/' },
  { id: 4, title: 'CDB, LCI, LCA: entenda a renda fixa', category: 'Renda Fixa', readTime: 12, icon: Landmark, color: '#06b6d4', url: 'https://www.btgpactualdigital.com/blog/investimentos/renda-fixa' },
  { id: 5, title: 'Tesouro Direto: guia completo para iniciantes', category: 'Renda Fixa', readTime: 15, icon: Shield, color: '#14b8a6', url: 'https://www.tesourodireto.com.br/conheca/conheca-o-tesouro-direto.htm' },
  { id: 6, title: 'Como sair das dívidas: passo a passo prático', category: 'Fundamentos', readTime: 7, icon: Target, color: '#ef4444', url: 'https://www.serasa.com.br/ensina/dicas/como-sair-das-dividas/' },
  { id: 7, title: 'ETFs: o que são e como investir', category: 'Investimentos', readTime: 10, icon: BarChart3, color: '#6366f1', url: 'https://www.infomoney.com.br/guias/etf/' },
  { id: 8, title: 'Juros compostos: a 8ª maravilha do mundo', category: 'Fundamentos', readTime: 6, icon: TrendingUp, color: '#22c55e', url: 'https://www.nubank.com.br/blog/juros-compostos/' },
  { id: 9, title: 'FIIs: como investir em fundos imobiliários', category: 'Investimentos', readTime: 14, icon: PiggyBank, color: '#f97316', url: 'https://www.infomoney.com.br/guias/fundos-imobiliarios/' },
  { id: 10, title: 'Planejamento financeiro pessoal: por onde começar', category: 'Fundamentos', readTime: 8, icon: Wallet, color: '#ec4899', url: 'https://www.serasa.com.br/ensina/dicas/planejamento-financeiro/' },
];

const VIDEOS = [
  { id: 1, title: 'Como investir em 2025 — Guia Completo', channel: 'Me Poupe!', duration: '18:42', thumbnail: 'https://img.youtube.com/vi/TO_CIe0xbwQ/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=TO_CIe0xbwQ' },
  { id: 2, title: 'Renda Fixa vs Renda Variável', channel: 'Primo Rico', duration: '22:15', thumbnail: 'https://img.youtube.com/vi/fGnOQC96e1U/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=fGnOQC96e1U' },
  { id: 3, title: 'Como funciona a Bolsa de Valores', channel: 'Investidor Sardinha', duration: '15:30', thumbnail: 'https://img.youtube.com/vi/4EMfy10OByA/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=4EMfy10OByA' },
  { id: 4, title: 'Tesouro Direto para iniciantes', channel: 'Nathalia Arcuri', duration: '20:10', thumbnail: 'https://img.youtube.com/vi/PIBME76JdQc/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=PIBME76JdQc' },
  { id: 5, title: 'Organize suas finanças em 7 dias', channel: 'Eitonilda', duration: '12:45', thumbnail: 'https://img.youtube.com/vi/R36FC7qoVKc/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=R36FC7qoVKc' },
  { id: 6, title: 'FIIs que pagam dividendos todo mês', channel: 'Primo Rico', duration: '25:00', thumbnail: 'https://img.youtube.com/vi/bM1k4YWsQsA/mqdefault.jpg', url: 'https://www.youtube.com/watch?v=bM1k4YWsQsA' },
];

const CATEGORIES = ['Todos', 'Fundamentos', 'Orçamento', 'Investimentos', 'Renda Fixa'];

export default function Education() {
  const [tab, setTab] = useState('articles');
  const [filter, setFilter] = useState('Todos');
  const filtered = filter === 'Todos' ? ARTICLES : ARTICLES.filter(a => a.category === filter);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Aprender</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Artigos, vídeos e conteúdos sobre finanças pessoais e investimentos</p></div>

      <div className="flex gap-2">
        {[{ id: 'articles', l: 'Artigos', icon: BookOpen }, { id: 'videos', l: 'Vídeos', icon: Play }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: tab === t.id ? 'var(--accent-light)' : 'var(--bg-secondary)', color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}` }}>
            <t.icon className="w-4 h-4" />{t.l}
          </button>
        ))}
      </div>

      {tab === 'articles' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: filter === c ? 'var(--accent-light)' : 'var(--bg-tertiary)', color: filter === c ? 'var(--accent)' : 'var(--text-muted)' }}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card p-5 flex gap-4 group cursor-pointer hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color + '15' }}>
                    <Icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight mb-1.5 group-hover:underline" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{a.category}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" />{a.readTime} min</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                </motion.a>
              );
            })}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIDEOS.map((v, i) => (
            <motion.a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
              <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"><Play className="w-5 h-5 text-gray-900 ml-0.5" /></div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-mono bg-black/70 text-white">{v.duration}</div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold leading-tight mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{v.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.channel}</p>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
