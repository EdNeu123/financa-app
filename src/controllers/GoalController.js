import * as Model from '../models/GoalModel';
import { sanitizeString, sanitizeAmount, sanitizeDate, isValidHexColor, validationResult, LIMITS } from '../utils/validators';
import { COLOR_OPTIONS } from '../utils/constants';

function validate(d) {
  const name = sanitizeString(d.name,LIMITS.STRING_MAX_SHORT);
  const nameErr = name.length<2?'Nome: mínimo 2 caracteres':null;
  const target = sanitizeAmount(d.target);
  let deadline=null,dlErr=null;
  if(d.deadline&&d.deadline.trim()) { const r=sanitizeDate(d.deadline); if(!r.valid) dlErr=r.error; else deadline=r.value; }
  const iconKey = sanitizeString(d.iconKey||'target',LIMITS.STRING_MAX_SHORT);
  const color = COLOR_OPTIONS.includes(d.color)&&isValidHexColor(d.color)?d.color:'#22c55e';
  const notes = sanitizeString(d.notes||'',LIMITS.STRING_MAX_LONG);
  const r = validationResult({name:nameErr,target:target.valid?null:target.error,deadline:dlErr});
  return {...r, sanitized:{name,target:target.value,iconKey,color,deadline,notes}};
}

export async function create(uid,raw,existing=[]) { if(!uid) return {success:false,error:'Não autenticado'}; if(existing.length>=LIMITS.GOALS_MAX) return {success:false,error:`Limite de ${LIMITS.GOALS_MAX} metas`}; const v=validate(raw); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.create(uid,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao criar'}; } }
export async function update(id,raw) { if(!id) return {success:false,error:'ID inválido'}; const v=validate(raw); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.update(id,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao atualizar'}; } }
export async function remove(id) { if(!id) return {success:false,error:'ID inválido'}; try { await Model.remove(id); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao excluir'}; } }
export const subscribe = (uid,cb) => Model.subscribe(uid,cb);
