import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { sanitizeString, LIMITS } from '../utils/validators';

/**
 * AuthController
 *
 * Responsabilidades:
 *  - Validar inputs de auth (email, senha, nome)
 *  - Chamar Firebase Auth
 *  - Retornar resultado padronizado { success, error? }
 */

const ERROR_MAP = {
  'auth/invalid-credential': 'Email ou senha incorretos',
  'auth/email-already-in-use': 'Este email já está em uso',
  'auth/weak-password': 'Senha deve ter pelo menos 6 caracteres',
  'auth/invalid-email': 'Email inválido',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/wrong-password': 'Senha incorreta',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos',
  'auth/popup-closed-by-user': null, // silenciar
};

function mapError(err) {
  const mapped = ERROR_MAP[err.code];
  if (mapped === null) return null; // ignora silenciosamente
  return mapped || 'Erro ao autenticar. Tente novamente.';
}

function validateEmail(email) {
  const clean = sanitizeString(email, 254).toLowerCase();
  // RFC 5322 simplificado
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { valid: false, value: '', error: 'Email inválido' };
  }
  return { valid: true, value: clean };
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Senha muito longa' };
  }
  return { valid: true };
}

function validateName(name) {
  const clean = sanitizeString(name, LIMITS.STRING_MAX_SHORT);
  if (clean.length < 2) {
    return { valid: false, value: '', error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  return { valid: true, value: clean };
}

// ── Ações públicas ──────────────────────────────────────────

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, googleProvider);
    return { success: true };
  } catch (err) {
    const msg = mapError(err);
    return msg ? { success: false, error: msg } : { success: true };
  }
}

export async function loginWithEmail(email, password) {
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) return { success: false, error: emailCheck.error };

  const passCheck = validatePassword(password);
  if (!passCheck.valid) return { success: false, error: passCheck.error };

  try {
    await signInWithEmailAndPassword(auth, emailCheck.value, password);
    return { success: true };
  } catch (err) {
    return { success: false, error: mapError(err) || 'Erro ao fazer login' };
  }
}

export async function registerWithEmail(email, password, name) {
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) return { success: false, error: emailCheck.error };

  const passCheck = validatePassword(password);
  if (!passCheck.valid) return { success: false, error: passCheck.error };

  const nameCheck = validateName(name);
  if (!nameCheck.valid) return { success: false, error: nameCheck.error };

  try {
    const cred = await createUserWithEmailAndPassword(auth, emailCheck.value, password);
    await updateProfile(cred.user, { displayName: nameCheck.value });
    return { success: true };
  } catch (err) {
    return { success: false, error: mapError(err) || 'Erro ao criar conta' };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch {
    return { success: false, error: 'Erro ao sair' };
  }
}
