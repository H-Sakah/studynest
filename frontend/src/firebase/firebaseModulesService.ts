import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';

export type Module = {
  id: string;
  title: string;
  tasksCount: number;
  progress: number;
  color?: string;
  tasks?: unknown[];
  activeTasks?: unknown[];
  details: {
    lecturers: string[];
    deadlines: { name: string; date: string }[];
  };
};

// Funktion zum Abrufen der Nutzer-spezifischen Module
const getUserModulesCollection = (userId: string) =>
  collection(db, `users/${userId}/modules`);

// Modul hinzufügen
export const addModule = async (
  userId: string,
  module: {
    title: string;
    tasksCount: number;
    progress: number;
    details: {
      lecturers: string[];
      deadlines: { name: string; date: string }[];
    };
  }
) => {
  const modulesCollection = getUserModulesCollection(userId);
  return await addDoc(modulesCollection, module);
};

export const editModule = async (
  userId: string,
  moduleId: string,
  updatedModule: {
    title: string;
    tasksCount: number;
    progress: number;
    color?: string;
    details: {
      lecturers: string[];
      deadlines: { name: string; date: string }[];
    };
  }
) => {
  const moduleDoc = doc(db, `users/${userId}/modules/${moduleId}`);
  return await setDoc(moduleDoc, updatedModule, { merge: true });
};

// Module abrufen
export const getModules = async (userId: string): Promise<Module[]> => {
  const modulesCollection = getUserModulesCollection(userId);
  const snapshot = await getDocs(modulesCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Module, 'id'>),
  }));
};

// Modul löschen
export const deleteModule = async (userId: string, moduleId: string) => {
  const moduleDoc = doc(db, `users/${userId}/modules/${moduleId}`);
  return await deleteDoc(moduleDoc);
};
