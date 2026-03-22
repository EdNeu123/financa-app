import Logo from "../components/Logo";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as AuthController from '../controllers/AuthController';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff,
  Sun, Moon, BarChart3, Shield, Target, Zap, Trophy, Brain, Check,
} from 'lucide-react';

const TRIGGERS = [
  { icon: BarChart3, title: 'Controle total em 1 tela', desc: 'Receitas, despesas, guardado e disponível — tudo no dashboard.' },
  { icon: Brain, title: 'IA que trabalha por você', desc: 'Análise automática de gastos com dicas personalizadas.' },
  { icon: Target, title: 'Metas que descontam do saldo', desc: 'Guardou R$ 500? Seu disponível cai R$ 500. Zero ilusão.' },
  { icon: Trophy, title: 'Gamificação que vicia', desc: 'XP, níveis, conquistas. Finanças nunca foram tão recompensadoras.' },
  { icon: Shield, title: 'Segurança em duas camadas', desc: 'Seus dados validados no client e no servidor.' },
];

const SOCIAL_PROOF = [
  '66% dos brasileiros já usam apps financeiros',
  'Mais de 42 milhões no Open Finance',
  'Grátis para sempre no plano Básico',
];

export default function AuthPage() {
  const { theme, toggle } = useTheme();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const r = mode === 'login' ? await AuthController.loginWithEmail(email, password) : await AuthController.registerWithEmail(email, password, name);
    if (!r.success && r.error) setError(r.error);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    const r = await AuthController.loginWithGoogle();
    if (!r.success && r.error) setError(r.error);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* Left panel — branding + gatilhos mentais */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between p-10 xl:p-14 relative"
        style={{ background: 'var(--bg-secondary)' }}>

        {/* Back + logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </Link>
          <div className="flex items-center gap-2.5 mb-8">
            <Logo size={40} />
            <span className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Quanto</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold font-display leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Suas finanças,<br />
            <span style={{ color: 'var(--accent)' }}>sob controle.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Junte-se a milhões de brasileiros que já controlam seu dinheiro de forma inteligente.
          </p>

          {/* Feature list com gatilhos */}
          <div className="space-y-4">
            {TRIGGERS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--accent-light)' }}>
                  <t.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof bottom */}
        <div className="mt-8 space-y-2">
          {SOCIAL_PROOF.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Mobile back + theme */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between lg:justify-end">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <Logo size={36} />
            <span className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Quanto</span>
          </div>

          <div className="card p-7">
            <h2 className="text-xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Acesse seu painel financeiro' : 'Leva menos de 10 segundos. Sério.'}
            </p>

            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continuar com Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>ou</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="relative mb-3.5">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} maxLength={80} className="input-field pl-11" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} className="input-field pl-11" required /></div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} maxLength={128} minLength={6} className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-sm p-2.5 rounded-lg" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>{mode === 'login' ? 'Entrar' : 'Criar conta grátis'} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="font-semibold" style={{ color: 'var(--accent)' }}>
                {mode === 'login' ? 'Criar agora — é grátis' : 'Fazer login'}
              </button>
            </p>

            {/* Redutor de objeção */}
            {mode === 'register' && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="space-y-1.5">
                  {['Sem cartão de crédito', 'Sem período de teste', 'Seus dados nunca são vendidos'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
