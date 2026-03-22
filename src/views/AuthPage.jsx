import { useState } from 'react';
import * as AuthController from '../controllers/AuthController';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, Eye, EyeOff, TrendingUp,
  Wallet, PiggyBank, BarChart3
} from 'lucide-react';

const FEATURES = [
  { icon: Wallet, text: 'Controle total de receitas e despesas' },
  { icon: BarChart3, text: 'Dashboard com gráficos inteligentes' },
  { icon: PiggyBank, text: 'Metas financeiras personalizadas' },
  { icon: TrendingUp, text: 'Categorias e tags customizáveis' },
];

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'login') {
      result = await AuthController.loginWithEmail(email, password);
    } else {
      result = await AuthController.registerWithEmail(email, password, name);
    }

    if (!result.success && result.error) setError(result.error);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    const result = await AuthController.loginWithGoogle();
    if (!result.success && result.error) setError(result.error);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold font-display tracking-tight">Finança</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold font-display leading-tight mb-6">
            Suas finanças,{' '}
            <span className="text-brand-400">sob controle.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-12 max-w-md leading-relaxed">
            Gerencie receitas, despesas e metas financeiras com uma interface moderna e intuitiva.
          </p>
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-brand-400" />
                </div>
                <span className="text-gray-300">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display">Finança</span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold font-display mb-1">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {mode === 'login' ? 'Entre para acessar seu painel' : 'Comece a gerenciar suas finanças'}
            </p>

            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium transition-all mb-4 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Continuar com Google</span>
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="relative mb-4">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" placeholder="Seu nome" value={name} maxLength={80}
                        onChange={(e) => setName(e.target.value)} className="input-field pl-11" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" placeholder="Email" value={email} maxLength={254}
                  onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} placeholder="Senha" value={password}
                  maxLength={128} minLength={6}
                  onChange={(e) => setPassword(e.target.value)} className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-danger-400 text-sm bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  {error}
                </motion.p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>{mode === 'login' ? 'Entrar' : 'Criar conta'}<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                {mode === 'login' ? 'Criar agora' : 'Fazer login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
