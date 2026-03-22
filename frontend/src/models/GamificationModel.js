import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
const C = 'gamification';
export const save = (uid, d) => setDoc(doc(db,C,uid), { ...d, updatedAt:serverTimestamp() }, { merge:true });
export const subscribe = (uid, cb) => onSnapshot(doc(db,C,uid), s => cb(s.exists() ? { id:s.id, ...s.data() } : null));
