import { useState } from 'react';
import * as AuthController from '../controllers/AuthController';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, TrendingUp, Sun, Moon } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <button onClick={toggle} className="fixed top-5 right-5 p-2 rounded-xl z-50" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Finança</span>
        </div>

        <div className="card p-7">
          <h2 className="text-xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Acesse seu painel financeiro' : 'Comece a controlar suas finanças'}
          </p>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all mb-5"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 mb-5">
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
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} className="input-field pl-11" required />
            </div>
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
                : <>{mode === 'login' ? 'Entrar' : 'Criar conta'} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-medium" style={{ color: 'var(--accent)' }}>
              {mode === 'login' ? 'Criar agora' : 'Fazer login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
