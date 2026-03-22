import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'categories';

export function create(userId, data) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    name: data.name,
    icon: data.icon,
    type: data.type,
    color: data.color,
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
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
