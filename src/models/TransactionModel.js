import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'transactions';

/**
 * Persiste uma transação JÁ VALIDADA no Firestore.
 * Nunca chamar direto da view — sempre via Controller.
 */
export function create(userId, data) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    type: data.type,
    description: data.description,
    amount: data.amount,
    category: data.category,
    date: data.date,
    tags: data.tags || [],
    notes: data.notes || '',
    goalId: data.goalId || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function update(id, data) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  // Não permitir alterar userId
  delete payload.userId;
  delete payload.id;
  delete payload.createdAt;
  return updateDoc(doc(db, COLLECTION, id), payload);
}

export function remove(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Escuta em tempo real as transações do usuário.
 * Retorna unsubscribe function.
 */
export function subscribe(userId, callback) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
