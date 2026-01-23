import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

// Tasks für den Benutzer abrufen
export const getTasks = async (userId: string) => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Task hinzufügen
export const addTask = async (
  userId: string,
  task: {
    title: string;
    description: string;
    color: string;
    columnId: string;
    moduleTitle: string;
    orderIndex: number; 
  }
) => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  return await addDoc(tasksCollection, task);
};

// Task löschen
export const deleteTask = async (userId: string, taskId: string) => {
  const taskDoc = doc(db, `users/${userId}/tasks/${taskId}`);
  return await deleteDoc(taskDoc);
};

// Task inhaltlich aktualisieren (Titel, Beschreibung, etc.)
export const updateTask = async (
  userId: string,
  taskId: string,
  updatedTask: Partial<{
    title: string;
    description: string;
    color: string;
    columnId: string;
    moduleTitle: string;
    orderIndex: number;
  }>
) => {
  const taskDoc = doc(db, `users/${userId}/tasks/${taskId}`);
  return await updateDoc(taskDoc, updatedTask);
};

// Nur die Spalte (columnId) des Tasks ändern
export const updateTaskColumn = async (
  userId: string,
  taskId: string,
  newColumnId: string
) => {
  const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
  await updateDoc(taskRef, { columnId: newColumnId });
};

/**
 * Ermittelt den höchsten orderIndex in einer Spalte,
 * damit ein neuer Task "unten" eingefügt werden kann.
 */
export const getMaxOrderIndexForColumn = async (
  userId: string,
  columnId: string
): Promise<number> => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  const snapshot = await getDocs(tasksCollection);

  let maxIndex = -1;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.columnId === columnId && typeof data.orderIndex === 'number') {
      if (data.orderIndex > maxIndex) {
        maxIndex = data.orderIndex;
      }
    }
  });

  return maxIndex;
};

// Batch-Update aller Tasks in Firestore, damit die neue Reihenfolge als auch die Splatenänderung gespeichert wird

export const reorderTasksInFirestore = async (
  userId: string,
  tasksInNewOrder: Array<{
    id: string;
    columnId: string;
    orderIndex: number;
  }>
) => {
  const batch = writeBatch(db);

  tasksInNewOrder.forEach((task) => {
    const taskRef = doc(db, `users/${userId}/tasks/${task.id}`);
    batch.update(taskRef, {
      columnId: task.columnId,
      orderIndex: task.orderIndex,
    });
  });

  await batch.commit();
};
