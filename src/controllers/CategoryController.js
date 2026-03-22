import * as Model from '../models/CategoryModel';
import { sanitizeString, isValidCatType, isValidHexColor, validationResult, LIMITS } from '../utils/validators';
import { COLOR_OPTIONS } from '../utils/constants';

function validate(d,existing=[],editId=null) {
  const name = sanitizeString(d.name,LIMITS.STRING_MAX_SHORT);
  let nameErr = name.length<2?'Nome: mínimo 2 caracteres':null;
  if(!nameErr && existing.find(c=>c.name.toLowerCase()===name.toLowerCase()&&c.id!==editId)) nameErr='Nome já existe';
  const typeErr = isValidCatType(d.type)?null:'Tipo inválido';
  const iconKey = sanitizeString(d.iconKey||'outros',LIMITS.STRING_MAX_SHORT);
  const color = COLOR_OPTIONS.includes(d.color)&&isValidHexColor(d.color)?d.color:'#94a3b8';
  const r = validationResult({name:nameErr,type:typeErr});
  return {...r, sanitized:{name,iconKey,type:d.type,color}};
}

export async function create(uid,raw,existing=[]) { if(!uid) return {success:false,error:'Não autenticado'}; if(existing.length>=LIMITS.CATEGORIES_MAX) return {success:false,error:`Limite de ${LIMITS.CATEGORIES_MAX} categorias`}; const v=validate(raw,existing); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.create(uid,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao criar'}; } }
export async function update(id,raw,existing=[]) { if(!id) return {success:false,error:'ID inválido'}; const v=validate(raw,existing,id); if(!v.valid) return {success:false,error:Object.values(v.errors)[0]}; try { await Model.update(id,v.sanitized); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao atualizar'}; } }
export async function remove(id) { if(!id) return {success:false,error:'ID inválido'}; try { await Model.remove(id); return {success:true}; } catch(e) { console.error(e); return {success:false,error:'Erro ao excluir'}; } }
export const subscribe = (uid,cb) => Model.subscribe(uid,cb);
