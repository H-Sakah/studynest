import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

// Funktion zum Abrufen der Nutzer-spezifischen Links
const getUserLinksCollection = (userId: string) =>
  collection(db, `users/${userId}/links`);

// Link hinzufügen
export const addLink = async (
  userId: string,
  link: { title: string; link: string; src?: string }
) => {
  const linksCollection = getUserLinksCollection(userId);
  return await addDoc(linksCollection, link);
};

// Links abrufen
export const getLinks = async (userId: string) => {
  const linksCollection = getUserLinksCollection(userId);
  const snapshot = await getDocs(linksCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Link löschen
export const deleteLink = async (userId: string, linkId: string) => {
  const linkDoc = doc(db, `users/${userId}/links/${linkId}`);
  return await deleteDoc(linkDoc);
};
