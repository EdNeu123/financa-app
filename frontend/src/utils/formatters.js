import { MONTH_NAMES } from './constants';
const cf = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const df = new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
export const formatCurrency = v => cf.format(Number(v)||0);
export const formatDate = s => { if(!s)return''; return df.format(new Date(s+'T00:00:00')); };
export const getMonthName = i => MONTH_NAMES[i]||'';
export const getCurrentMonthKey = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`; };
export const formatCompact = v => { const n=Number(v)||0; if(n>=1e6)return`${(n/1e6).toFixed(1)}M`; if(n>=1e3)return`${(n/1e3).toFixed(1)}k`; return n.toFixed(0); };
