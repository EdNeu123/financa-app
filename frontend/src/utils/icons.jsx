import {
  Utensils, Car, Home, HeartPulse, GraduationCap, Gamepad2,
  Banknote, Laptop, TrendingUp, Package, Shirt, Smartphone,
  Plane, PawPrint, Tv, Gift, Coffee, Music, CreditCard, Dumbbell,
  Film, ShoppingCart, Landmark, Lightbulb, Wrench, Palette,
  Wine, Bus, Briefcase, BookOpen, Zap, Shield, Stethoscope,
  Receipt, Repeat, Bell, Target, BarChart3, Wallet, PiggyBank,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Star, Trophy,
  Flame, Crown, Award, Medal, Sparkles, BookMarked, Play,
  Globe, LineChart, TrendingDown, DollarSign, Percent, Clock,
  ChevronRight, Settings, LogOut, Sun, Moon, Menu, X, Search,
  Plus, Pencil, Trash2, Calendar, ChevronLeft, Filter,
  Download, LayoutDashboard, ArrowLeftRight, Tag,
  CheckCircle2, Eye, EyeOff, Mail, Lock, User, ArrowRight,
} from 'lucide-react';

// Mapeamento profissional: nome → { icon, color }
export const CATEGORY_ICONS = {
  alimentacao:   { icon: Utensils,      color: '#f97316' },
  transporte:    { icon: Car,           color: '#3b82f6' },
  moradia:       { icon: Home,          color: '#8b5cf6' },
  saude:         { icon: HeartPulse,    color: '#ef4444' },
  educacao:      { icon: GraduationCap, color: '#06b6d4' },
  lazer:         { icon: Gamepad2,      color: '#ec4899' },
  tecnologia:    { icon: Smartphone,    color: '#6366f1' },
  assinaturas:   { icon: Tv,            color: '#14b8a6' },
  salario:       { icon: Banknote,      color: '#22c55e' },
  freelance:     { icon: Laptop,        color: '#10b981' },
  investimentos: { icon: TrendingUp,    color: '#84cc16' },
  outros:        { icon: Package,       color: '#94a3b8' },
  vestuario:     { icon: Shirt,         color: '#a855f7' },
  viagem:        { icon: Plane,         color: '#0ea5e9' },
  pets:          { icon: PawPrint,      color: '#f59e0b' },
  presentes:     { icon: Gift,          color: '#e11d48' },
  cafe:          { icon: Coffee,        color: '#78716c' },
  fitness:       { icon: Dumbbell,      color: '#dc2626' },
  mercado:       { icon: ShoppingCart,   color: '#ea580c' },
  banco:         { icon: Landmark,      color: '#1d4ed8' },
};

// Lista seleccionável para UI
export const ICON_OPTIONS = Object.entries(CATEGORY_ICONS).map(([key, val]) => ({
  key, ...val,
}));

// Lookup seguro
export function getCategoryIcon(name) {
  const key = name?.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
  return CATEGORY_ICONS[key] || { icon: Package, color: '#94a3b8' };
}

// Ícones para metas
export const GOAL_ICON_OPTIONS = [
  { key: 'target',    icon: Target,      color: '#22c55e' },
  { key: 'home',      icon: Home,        color: '#3b82f6' },
  { key: 'car',       icon: Car,         color: '#6366f1' },
  { key: 'plane',     icon: Plane,       color: '#0ea5e9' },
  { key: 'laptop',    icon: Laptop,      color: '#8b5cf6' },
  { key: 'phone',     icon: Smartphone,  color: '#ec4899' },
  { key: 'grad',      icon: GraduationCap, color: '#06b6d4' },
  { key: 'shield',    icon: Shield,      color: '#14b8a6' },
  { key: 'gift',      icon: Gift,        color: '#e11d48' },
  { key: 'heart',     icon: HeartPulse,  color: '#ef4444' },
  { key: 'piggy',     icon: PiggyBank,   color: '#f97316' },
  { key: 'trending',  icon: TrendingUp,  color: '#84cc16' },
  { key: 'dumbbell',  icon: Dumbbell,    color: '#dc2626' },
  { key: 'music',     icon: Music,       color: '#a855f7' },
  { key: 'paw',       icon: PawPrint,    color: '#f59e0b' },
  { key: 'star',      icon: Star,        color: '#eab308' },
];

// Componente reutilizável de ícone com fundo
export function CategoryBadge({ name, size = 'md', iconKey, color: overrideColor }) {
  let IconComponent, iconColor;

  if (iconKey) {
    const found = [...ICON_OPTIONS, ...GOAL_ICON_OPTIONS].find(i => i.key === iconKey);
    IconComponent = found?.icon || Package;
    iconColor = overrideColor || found?.color || '#94a3b8';
  } else {
    const info = getCategoryIcon(name);
    IconComponent = info.icon;
    iconColor = overrideColor || info.color;
  }

  const sizes = {
    sm: { box: 'w-8 h-8', icon: 'w-3.5 h-3.5' },
    md: { box: 'w-10 h-10', icon: 'w-4 h-4' },
    lg: { box: 'w-12 h-12', icon: 'w-5 h-5' },
    xl: { box: 'w-16 h-16', icon: 'w-7 h-7' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`${s.box} rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: iconColor + '15' }}
    >
      <IconComponent className={s.icon} style={{ color: iconColor }} />
    </div>
  );
}

// Re-export tudo que as views precisam
export {
  Utensils, Car, Home, HeartPulse, GraduationCap, Gamepad2,
  Banknote, Laptop, TrendingUp, Package, Shirt, Smartphone,
  Plane, PawPrint, Tv, Gift, Coffee, Music, CreditCard, Dumbbell,
  Film, ShoppingCart, Landmark, Lightbulb, Wrench, Palette,
  Wine, Bus, Briefcase, BookOpen, Zap, Shield, Stethoscope,
  Receipt, Repeat, Bell, Target, BarChart3, Wallet, PiggyBank,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Star, Trophy,
  Flame, Crown, Award, Medal, Sparkles, BookMarked, Play,
  Globe, LineChart, TrendingDown, DollarSign, Percent, Clock,
  ChevronRight, Settings, LogOut, Sun, Moon, Menu, X, Search,
  Plus, Pencil, Trash2, Calendar, ChevronLeft, Filter,
  Download, LayoutDashboard, ArrowLeftRight, Tag,
  CheckCircle2, Eye, EyeOff, Mail, Lock, User, ArrowRight,
};
