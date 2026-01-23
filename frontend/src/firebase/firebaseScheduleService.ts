import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

// Nutzer-spezifische Schedule Collection
const getUserScheduleCollection = (userId: string) =>
  collection(db, `users/${userId}/schedule`);

// Schedule Tage abrufen
export const getScheduleDays = async (userId: string) => {
  const scheduleCollection = getUserScheduleCollection(userId);
  const snapshot = await getDocs(scheduleCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Schedule hinzufügen
export const addSchedule = async (
  userId: string,
  schedule: { day: string; items: { time: string; description: string }[] }[]
) => {
  const scheduleCollection = getUserScheduleCollection(userId);
  for (const day of schedule) {
    await addDoc(scheduleCollection, day);
  }
};

// Schedule löschen
export const deleteSchedule = async (userId: string) => {
  const scheduleCollection = getUserScheduleCollection(userId);
  const snapshot = await getDocs(scheduleCollection);

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
};
