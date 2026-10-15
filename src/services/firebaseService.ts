import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth = getAuth(app);

export const chatCollection = collection(db, 'chat_messages');

export const sendChatMessage = async (msg: any) => {
  try {
    return await addDoc(chatCollection, {
      ...msg,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firebase chat send error (fallback active):', err);
    return null;
  }
};

export const subscribeToChatMessages = (callback: (messages: any[]) => void) => {
  try {
    const q = query(chatCollection, orderBy('timestamp', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
      },
      (err) => {
        // Silently catch firestore permission/network error so local chat continues smoothly
        console.warn('Firebase chat subscription notice:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Firebase chat subscription init notice:', err);
    return () => {};
  }
};

