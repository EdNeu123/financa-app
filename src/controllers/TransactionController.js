import * as Model from '../models/TransactionModel';
import { sanitizeString, sanitizeAmount, sanitizeDate, sanitizeTags, isValidTxType, validationResult, LIMITS } from '../utils/validators';

function validate(d) {
  const typeErr = isValidTxType(d.type)?null:'Tipo inválido';
  const desc = sanitizeString(d.description,LIMITS.STRING_MAX_MEDIUM);
  const descErr = desc.length<2?'Descrição: mínimo 2 caracteres':null;
  const amt = sanitizeAmount(d.amount);
  const cat = sanitizeString(d.category,LIMITS.STRING_MAX_SHORT);
  const catErr = cat.length===0?'Selecione uma categoria':null;
  const date = sanitizeDate(d.date);
  const tags = sanitizeTags(d.tags);
  const notes = sanitizeString(d.notes||'',LIMITS.STRING_MAX_LONG);
  const goalId = d.goalId?sanitizeString(d.goalId,LIMITS.STRING_MAX_SHORT):null;
  const r = validationResult({type:typeErr,description:descErr,amount:amt.valid?null:amt.error,category:catErr,date:date.valid?null:date.error});
  return {...r, sanitized:{type:d.type,description:desc,amount:amt.value,category:cat,date:date.value,tags,notes,goalId}};
}

export async function create(uid,raw) { if(!uid) return {success:false,error:'Não autenticado'}; const v=validate(raw); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.create(uid,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao salvar'}; } }
export async function update(id,raw) { if(!id) return {success:false,error:'ID inválido'}; const v=validate(raw); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.update(id,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao atualizar'}; } }
export async function remove(id) { if(!id) return {success:false,error:'ID inválido'}; try { await Model.remove(id); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao excluir'}; } }
export const subscribe = (uid,cb) => Model.subscribe(uid,cb);
