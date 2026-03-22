import * as Model from '../models/AlertModel';
import { sanitizeString, sanitizeAmount, LIMITS } from '../utils/validators';

export async function create(uid, raw) {
  if(!uid) return {success:false,error:'Não autenticado'};
  const cat = sanitizeString(raw.category,LIMITS.STRING_MAX_SHORT);
  if(!cat) return {success:false,error:'Categoria obrigatória'};
  const limit = sanitizeAmount(raw.limitAmount);
  if(!limit.valid) return {success:false,error:limit.error};
  try { await Model.create(uid,{category:cat,limitAmount:limit.value,alertAt:raw.alertAt||80,enabled:true}); return {success:true}; }
  catch(e) { console.error(e); return {success:false,error:'Erro ao criar limite'}; }
}
export async function update(id, raw) { if(!id) return {success:false,error:'ID inválido'}; try { await Model.update(id,raw); return {success:true}; } catch(e) { return {success:false,error:'Erro ao atualizar'}; } }
export async function remove(id) { if(!id) return {success:false,error:'ID inválido'}; try { await Model.remove(id); return {success:true}; } catch(e) { return {success:false,error:'Erro ao excluir'}; } }
export const subscribe = (uid,cb) => Model.subscribe(uid,cb);
