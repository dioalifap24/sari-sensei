import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// @ts-ignore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

export const chatCollection = collection(db, 'chat_messages');

export const sendChatMessage = async (msg: any) => {
  return await addDoc(chatCollection, {
    ...msg,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToChatMessages = (callback: (messages: any[]) => void) => {
  const q = query(chatCollection, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};
