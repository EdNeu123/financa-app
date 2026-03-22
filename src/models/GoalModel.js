import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'goals';

export function create(userId, data) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    name: data.name,
    target: data.target,
    icon: data.icon,
    color: data.color,
    deadline: data.deadline || null,
    notes: data.notes || '',
    createdAt: serverTimestamp(),
  });
}

export function update(id, data) {
  const payload = { ...data };
  delete payload.userId;
  delete payload.id;
  delete payload.createdAt;
  return updateDoc(doc(db, COLLECTION, id), payload);
}

export function remove(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

export function subscribe(userId, callback) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
