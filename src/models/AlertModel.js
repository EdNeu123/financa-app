import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
const C = 'budgets';
export const create = (uid, d) => addDoc(collection(db,C), { ...d, userId:uid, createdAt:serverTimestamp() });
export const update = (id, d) => { const p={...d}; delete p.userId; delete p.id; return updateDoc(doc(db,C,id),p); };
export const remove = id => deleteDoc(doc(db,C,id));
export const subscribe = (uid, cb) => { const q=query(collection(db,C),where('userId','==',uid)); return onSnapshot(q,s=>cb(s.docs.map(d=>({id:d.id,...d.data()})))); };
