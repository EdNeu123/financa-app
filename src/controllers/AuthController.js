import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { sanitizeString, LIMITS } from '../utils/validators';

const ERR = { 'auth/invalid-credential':'Email ou senha incorretos', 'auth/email-already-in-use':'Email já em uso', 'auth/weak-password':'Senha: mínimo 6 caracteres', 'auth/invalid-email':'Email inválido', 'auth/too-many-requests':'Muitas tentativas. Aguarde.', 'auth/popup-closed-by-user':null };
const mapErr = e => { const m=ERR[e.code]; return m===null?null:m||'Erro ao autenticar'; };
const vEmail = e => { const c=sanitizeString(e,254).toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)?{valid:true,value:c}:{valid:false,error:'Email inválido'}; };
const vPass = p => typeof p==='string'&&p.length>=6&&p.length<=128?{valid:true}:{valid:false,error:'Senha: 6-128 caracteres'};
const vName = n => { const c=sanitizeString(n,LIMITS.STRING_MAX_SHORT); return c.length>=2?{valid:true,value:c}:{valid:false,error:'Nome: mínimo 2 caracteres'}; };

export async function loginWithGoogle() { try { await signInWithPopup(auth,googleProvider); return {success:true}; } catch(e) { const m=mapErr(e); return m?{success:false,error:m}:{success:true}; } }
export async function loginWithEmail(email,password) { const ev=vEmail(email); if(!ev.valid) return {success:false,error:ev.error}; const pv=vPass(password); if(!pv.valid) return {success:false,error:pv.error}; try { await signInWithEmailAndPassword(auth,ev.value,password); return {success:true}; } catch(e) { return {success:false,error:mapErr(e)}; } }
export async function registerWithEmail(email,password,name) { const ev=vEmail(email); if(!ev.valid) return {success:false,error:ev.error}; const pv=vPass(password); if(!pv.valid) return {success:false,error:pv.error}; const nv=vName(name); if(!nv.valid) return {success:false,error:nv.error}; try { const c=await createUserWithEmailAndPassword(auth,ev.value,password); await updateProfile(c.user,{displayName:nv.value}); return {success:true}; } catch(e) { return {success:false,error:mapErr(e)}; } }
export async function logout() { try { await signOut(auth); return {success:true}; } catch { return {success:false,error:'Erro ao sair'}; } }
