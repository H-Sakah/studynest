'use client';

import { useEffect, useState } from 'react';
import { NameProvider } from '../../components/User/nameContext';
import { KanbanBoard } from '../../components/Tasks/kanbanBoard';
import { Header } from '../../components/Header/header';
import { Layout } from '../../components/Layout';
import { getModules } from '../../firebase/firebaseModulesService';
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  updateTaskColumn,
  getMaxOrderIndexForColumn,
} from '../../firebase/firebaseTasksService';
import { AddTaskModal } from '../../components/Tasks/addTaskModal';
import { EditTaskModal } from '../../components/Tasks/editTaskModel';
import { DeleteTaskModal } from '../../components/Tasks/deleteTaskModal';
import { Column, Task } from '../../components/Tasks/types';
import { initialColumns } from '../../data/columnsData';
import { initializeColumns } from '../../utils/initializeColumns';

export default function TasksPage() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [modules, setModules] = useState<{ title: string; color?: string }[]>(
    []
  );

  // Neuer Zustand für das Delete-Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Tasks und Module aus Firebase laden
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        // Module abrufen
        const fetchedModules = await getModules(userId);
        setModules(
          fetchedModules.map((module: any) => ({
            title: module.title,
            color: module.color,
          }))
        );

        // Tasks abrufen
        const fetchedTasks = (await getTasks(userId)).map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          columnId: task.columnId,
          moduleTitle: task.moduleTitle,
          color: task.color,
          orderIndex: typeof task.orderIndex === 'number' ? task.orderIndex : 0,
        }));

        // Spalten initialisieren + Tasks nach orderIndex sortieren
        const updatedColumns = initializeColumns(initialColumns, fetchedTasks);
        setColumns(updatedColumns);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    };

    fetchData();
  }, [userId]);

  // Firebase-Auth: Benutzer-ID holen
  useEffect(() => {
    const initializeAuth = async () => {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();

      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUserId(currentUser ? currentUser.uid : null);
      });

      return () => unsubscribe();
    };

    initializeAuth();
  }, []);

  // Benutzer-Daten aus dem Backend (Session)
  /* useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getUser', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          window.location.href = '/login';
        }
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    };

    fetchUserData();
  }, []); */

  useEffect(() => {
    const fetchUserData = async () => {
      const { getAuth } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

      if (userDoc.exists()) {
        setUserData(
          userDoc.data() as {
            firstName: string;
            lastName: string;
            email: string;
          }
        );
      }
    };

    fetchUserData();
  }, []);

  // Neuen Task speichern
  const handleSaveNewTask = async (taskData: {
    title: string;
    description: string;
    moduleTitle: string;
  }) => {
    if (!userId) return;

    // Farbe aus dem zugehörigen Modul übernehmen
    const foundModule = modules.find((m) => m.title === taskData.moduleTitle);
    const color = foundModule?.color || 'bg-gray-300';

    const columnId = 'todo';

    let maxIndex = 0;
    try {
      maxIndex = await getMaxOrderIndexForColumn(userId, columnId);
    } catch (error) {
      console.error('Fehler bei getMaxOrderIndexForColumn:', error);
    }

    const newTask = {
      title: taskData.title,
      description: taskData.description,
      color,
      columnId,
      moduleTitle: taskData.moduleTitle,
      orderIndex: maxIndex + 1,
    };

    try {
      const docRef = await addTask(userId, newTask);
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: [...col.tasks, { id: docRef.id, ...newTask }],
              }
            : col
        )
      );
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Tasks:', error);
    }
  };

  // Task bearbeiten
  const handleEditTask = (taskId: string) => {
    for (const col of columns) {
      const found = col.tasks.find((t) => t.id === taskId);
      if (found) {
        setTaskBeingEdited(found);
        setEditModalOpen(true);
        break;
      }
    }
  };

  // Speichern eines bearbeiteten Tasks
  const handleSaveEditedTask = async (updatedData: {
    id: string;
    title: string;
    description: string;
    moduleTitle: string;
    color?: string;
  }) => {
    if (!userId) return;

    try {
      await updateTask(userId, updatedData.id, updatedData);
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === updatedData.id
              ? {
                  ...task,
                  title: updatedData.title,
                  description: updatedData.description,
                  color: updatedData.color,
                  moduleTitle: updatedData.moduleTitle,
                }
              : task
          ),
        }))
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Tasks:', error);
    }
  };

  // Statt sofort löschen: Modal öffnen
  const handleDeleteTaskClick = (taskId: string, taskTitle: string) => {
    setTaskToDelete({
      id: taskId,
      title: taskTitle,
      description: '',
      columnId: '',
      moduleTitle: '',
      orderIndex: 0,
    });
    setIsDeleteModalOpen(true);
  };

  // Löschvorgang bestätigen
  const handleConfirmDeleteTask = async () => {
    if (!userId || !taskToDelete) return;

    try {
      await deleteTask(userId, String(taskToDelete.id));
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskToDelete.id),
        }))
      );
    } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <NameProvider value={userData}>
      <Layout userId={userId} userData={userData}>
        {/* Main Content */}
        <div className="flex">
          <div className="transition-all duration-300 flex-grow p-4 mb-10">
            <Header
              addButtonTitle="neuer Task"
              addFunctionOnClick={() => setIsAddTaskModalOpen(true)}
            />
            <KanbanBoard
              columns={columns}
              setColumns={setColumns}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskClick}
              userId={userId}
            />
          </div>
        </div>

        {/* Modale */}
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={handleSaveNewTask}
          modules={modules}
        />
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          task={taskBeingEdited}
          modules={modules}
          onSave={handleSaveEditedTask}
        />

        <DeleteTaskModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDeleteTask}
          taskTitle={taskToDelete ? taskToDelete.title : ''}
        />
      </Layout>
    </NameProvider>
  );
}
