
import { Header } from '../../components/Header/header';
import { NameProvider } from '../../components/User/nameContext';
import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal/modal';
import { ModuleCardList } from '../../components/Dashboard/moduleCardList';
import { Layout } from '../Layout';
import {
  addModule,
  getModules,
  deleteModule,
  editModule,
} from '../../firebase/firebaseModulesService';


import { getTasks } from '../../firebase/firebaseTasksService';
import { Task } from '../../components/Tasks/types';

type Module = {
  id?: string;
  title: string;
  tasksCount: number;
  progress: number;
  color?: string;
  details: {
    lecturers: string[];
    deadlines: { name: string; date: string }[];
  };
  tasks: Task[];
  activeTasks: Task[];
};

export default function Home() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [userId, setUserId] = useState<string | null>(null);

  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [moduleColor, setModuleColor] = useState('bg-gray-300');
  const [modules, setModules] = useState<Module[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [moduleName, setModuleName] = useState('');
  const [lecturers, setLecturers] = useState<string[]>([]);
  const [newLecturer, setNewLecturer] = useState('');
  const [deadlines, setDeadlines] = useState<{ name: string; date: string }[]>(
    []
  );
  const [newDeadline, setNewDeadline] = useState<{
    name: string;
    date: string;
  }>({ name: '', date: '' });
  const [deadlineError, setDeadlineError] = useState<string>('');


  const allColors = [
    'bg-yellow-300',
    'bg-cyan-400',
    'bg-blue-300',
    'bg-green-500',
    'bg-purple-300',
    'bg-pink-500',
    'bg-indigo-400',
    'bg-customBeige',
  ];
  const usedColors = modules.map((mod) => mod.color);
  const availableColors = allColors.filter(
    (color) => !usedColors.includes(color)
  );


  useEffect(() => {
    const fetchModulesAndTasks = async () => {
      if (!userId) return;
      try {
       
        const firebaseModules = await getModules(userId);

        
        const firebaseTasks = await getTasks(userId);
        const activeTasks = firebaseTasks.filter((task) => task.columnId !== 'done');

        const modulesWithTasks = firebaseModules.map((mod) => {
          const filteredTasks = firebaseTasks.filter(
          
            (task) => task.moduleTitle === mod.title
          );
          return {
            ...mod,
            tasks: filteredTasks,
            activeTasks: activeTasks.filter((task) => task.moduleTitle === mod.title),
          };
        });

        setModules(modulesWithTasks as Module[]);
      } catch (error) {
        console.error('Fehler beim Abrufen der Module/Tasks:', error);
      }
    };

    fetchModulesAndTasks();
  }, [userId]);


  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();

      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          setUserId(currentUser.uid);
        } else {
          setUserId(null);
        }
      });

      return () => unsubscribe();
    };

    initializeAuth();
  }, []);


  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!moduleName.trim() || !userId || !moduleColor) return;

   
    const updatedModuleData: Omit<Module, 'id'> = {
      title: moduleName,
      tasksCount: moduleToEdit?.tasksCount ?? 0,
      progress: moduleToEdit?.progress ?? 0,
      color: moduleColor,
      details: {
        lecturers: [...lecturers],
        deadlines: [...deadlines],
      },
    };

    try {
      if (isEditMode && moduleToEdit) {
 
        await editModule(userId, moduleToEdit.id!, updatedModuleData);

    
        setModules((prevModules) =>
          prevModules.map((m) =>
            m.id === moduleToEdit.id ? { ...m, ...updatedModuleData } : m
          )
        );
      } else {
 
        const docRef = await addModule(userId, updatedModuleData);
        setModules((prev) => [
          ...prev,
          { id: docRef.id, ...updatedModuleData },
        ]);
      }

      closeCreateModal();
    } catch (error) {
      console.error('Fehler beim Speichern des Moduls:', error);
    }
  };


  const handleAddDeadline = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(newDeadline.date);
    deadlineDate.setHours(0, 0, 0, 0);
  
    if (deadlineDate < today) {
      // If the date is in the past, set the error message
      setDeadlineError('Das Datum der Frist darf nicht in der Vergangenheit liegen.');
      return;
    }
  
    // Clear the error message and add the deadline
    setDeadlineError('');
    if (newDeadline.name.trim() && newDeadline.date.trim()) {
      setDeadlines((prev) => [...prev, newDeadline]);
      setNewDeadline({ name: '', date: '' });
    }
  };
  
  const handleDeleteLecturer = (index: number) => {
    setLecturers((prevLecturers) => 
      prevLecturers.filter((_, i) => i !== index)
    );
  };
  
  const handleDeleteDeadline = (index: number) => {
    setDeadlines((prevDeadlines) =>
      prevDeadlines.filter((_, i) => i !== index)
    );
  };

  const handleOpenEditModal = (mod: Module) => {
    setIsEditMode(true);
    setModuleToEdit(mod);
  
    setModuleName(mod.title);
    setLecturers([...mod.details.lecturers]);
    setDeadlines([...mod.details.deadlines]);
    setModuleColor(mod.color || 'bg-gray-300');
  
   
    setIsCreateModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setModuleToDelete(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDeleteModule = async () => {
    if (!moduleToDelete || !userId) return;

    try {
      await deleteModule(userId, moduleToDelete);
      setModules((prev) => prev.filter((mod) => mod.id !== moduleToDelete));
    } catch (error) {
      console.error('Error deleting the module:', error);
    } finally {
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setModuleToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setModuleName('');
    setLecturers([]);
    setDeadlines([]);
    setModuleColor('bg-gray-300');
    setModuleToEdit(null);
    setIsEditMode(false);
  };

  return (
    <NameProvider value={userData}>
      <Layout userId={userId} userData={userData}>
        <div className="flex">
          <div className="transition-all duration-300 flex-grow p-4 mb-10">
            <Header
              addButtonTitle="neues Modul"
              addFunctionOnClick={openCreateModal}
            />

            {/* Modal für neues Modul */}
            <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isEditMode ? 'Modul Bearbeiten' : 'Neues Modul Erstellen'}
              </h2>
              <form onSubmit={handleSaveModule} className="space-y-4">
                {/* Modulname */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Modulname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Modulname..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    required
                  />
                </div>

                {/* Dozenten */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Dozenten
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newLecturer}
                      onChange={(e) => setNewLecturer(e.target.value)}
                      placeholder="Dozentname..."
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (newLecturer.trim() !== '') {
                          setLecturers((prev) => [...prev, newLecturer]);
                          setNewLecturer('');
                        }
                      }}
                      className="flex items-center text-blue-500 hover:text-black"
                    >
                      <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke-width={2.5} 
                          stroke="currentColor" 
                          className="w-5 h-5"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                          />
                      </svg>
                    </button>
                  </div>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                    {lecturers.map((lect, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteLecturer(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width={2.5} 
                            stroke="currentColor" 
                            className="w-5 h-5"
                          >
                            <path 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                            />
                          </svg>
                        </button>
                        <span>{lect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deadlines */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Fristen
                  </label>
                  {/* Render the error message */}
                  {deadlineError && (
                    <p className="text-red-500 text-sm mt-1">{deadlineError}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDeadline.name}
                      onChange={(e) =>
                        setNewDeadline({ ...newDeadline, name: e.target.value })
                      }
                      placeholder="FristenName..."
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                    <input
                      type="date"
                      value={newDeadline.date}
                      onChange={(e) =>
                        setNewDeadline({ ...newDeadline, date: e.target.value })
                      }
                      className="mt-1 block border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={handleAddDeadline}
                      className="flex items-center text-blue-500 hover:text-black"
                    >
                      <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke-width={2.5} 
                          stroke="currentColor" 
                          className="w-5 h-5"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                          />
                      </svg>
                    </button>
                  </div>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                    {deadlines.map((dl, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteDeadline(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width={2.5} 
                            stroke="currentColor" 
                            className="w-5 h-5"
                          >
                            <path 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                            />
                          </svg>
                        </button>
                        <span>{dl.name}: {dl.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Farbauswahl */}
                <div>
                  <label className="block text-base font-bold text-gray-700">
                    Farbe wählen
                  </label>
                  <div className="flex gap-2 mt-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.preventDefault();
                          setModuleColor(color);
                        }}
                        className={`w-8 h-8 rounded-full border-2 ${
                          moduleColor === color
                            ? 'border-black'
                            : 'border-gray-200'
                        } ${color}`}
                        aria-label={`Choose ${color}`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {/* Create-Button */}
                  <button
                    type="submit"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-2
                      rounded-full
                      font-medium
                      uppercase
                      text-white
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-500
                      hover:from-blue-600
                      hover:to-indigo-600
                      shadow
                      hover:shadow-lg
                      transform
                      transition
                      duration-300
                      ease-in-out
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-300"
                    >
                    {isEditMode ? 'Änderungen speichern' : 'Modul erstellen'}
                  </button>
                </div>
              </form>
            </Modal>

            {/* Modal for confirming deletion */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Modul löschen
              </h2>
              <p className="text-medium text-gray-600 mb-6 text-center">
                Sind Sie sicher, dass Sie dieses Modul löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDeleteModule}
                  className="flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-2
                      rounded-full
                      font-medium
                      uppercase
                      text-white
                      bg-gradient-to-r
                      from-pink-700
                      to-red-500
                      hover:from-blue-600
                      hover:to-indigo-600
                      shadow
                      hover:shadow-lg
                      transform
                      transition
                      duration-300
                      ease-in-out
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-300"
                >
                  Löschen
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-2
                      rounded-full
                      font-medium
                      uppercase
                      text-white
                      bg-gradient-to-r
                      from-green-500
                      to-teal-500
                      hover:from-blue-600
                      hover:to-indigo-600
                      shadow
                      hover:shadow-lg
                      transform
                      transition
                      duration-300
                      ease-in-out
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-300"
                >
                  Abbrechen
                </button>
              </div>
            </Modal>

            {/* Modul-Liste */}
            <div className="grid gap-4">
              <ModuleCardList
                moduleCards={modules.map((mod) => ({
                  ...mod,
                  onDelete: () => openDeleteModal(mod.id!),
                  onEdit: () => handleOpenEditModal(mod),
                }))}
                containerClassName="grid gap-4"
                showDetailsButton={true}
                showDeleteButton={true}
                showEditButton={true}
                showArrowButton={true}
              />
            </div>
          </div>
        </div>
      </Layout>
    </NameProvider>
  );
}
