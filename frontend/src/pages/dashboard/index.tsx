import { useEffect, useState } from 'react';
import { NameProvider } from '../../components/User/nameContext';
import { ModuleCardList } from '../../components/Dashboard/moduleCardList';
import { Header } from '../../components/Header/header';
import { TaskList } from '../../components/Dashboard/taskList';
import { StatCardList } from '../../components/Dashboard/statCardList';
import { Modal } from '../../components/Modal/modal';
import { Layout } from '../../components/Layout';
import { getModules, addModule } from '../../firebase/firebaseModulesService';
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
  tasks?: Task[];
  activeTasks?: Task[];
};

export default function Home() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [moduleColor, setModuleColor] = useState('bg-gray-300');
  const [lecturers, setLecturers] = useState<string[]>([]);
  const [newLecturer, setNewLecturer] = useState('');
  const [deadlines, setDeadlines] = useState<{ name: string; date: string }[]>(
    []
  );
  const [newDeadline, setNewDeadline] = useState<{
    name: string;
    date: string;
  }>({
    name: '',
    date: '',
  });
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
  const usedColors = modules.map((m) => m.color);
  const availableColors = allColors.filter((c) => !usedColors.includes(c));
  const [statsData, setStatsData] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const fetchedModules = (await getModules(userId)) as Module[];

        const fetchedTasks = await getTasks(userId);

        const modulesWithTasks = fetchedModules.map((mod: Module) => {
          const filteredTasks = (fetchedTasks as Task[]).filter(
            (task) => task.moduleTitle === mod.title
          );

          const doneTasks = filteredTasks.filter(
            (task) => task.columnId === 'done'
          );

          return {
            ...mod,
            tasksCount: filteredTasks.length,
            progress:
              filteredTasks.length > 0
                ? Math.round((doneTasks.length / filteredTasks.length) * 100)
                : 0,
            tasks: filteredTasks,
            activeTasks: filteredTasks.filter(
              (task) => task.columnId !== 'done'
            ),
          };
        });

        setModules(modulesWithTasks as Module[]);

        const todo = (fetchedTasks as Task[]).filter(
          (t) => t.columnId != 'done'
        );
        setTodoTasks(todo);

        const doneTasks = (fetchedTasks as Task[]).filter(
          (t) => t.columnId === 'done'
        );
        const openTasks = (fetchedTasks as Task[]).filter(
          (t) => t.columnId !== 'done'
        );

        setStatsData([
          { value: doneTasks.length, label: 'erledigte Aufgaben' },
          { value: openTasks.length, label: 'offene Aufgaben' },
        ]);
      } catch (error) {
        console.error('Fehler beim Abrufen:', error);
      }
    };
    fetchData();
  }, [userId]);

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

  // necessary to fetch userData from Express-Backend
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
      } catch {}
    };
    fetchUserData();
  }, []); */

  // necessary to fetch userData from Firestore
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setModuleName('');
    setModuleColor('bg-gray-300');
    setLecturers([]);
    setDeadlines([]);
    setNewDeadline({ name: '', date: '' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName.trim() || !userId || !moduleColor) return;
    const newModule: Module = {
      title: moduleName,
      tasksCount: 0,
      progress: 0,
      color: moduleColor,
      details: {
        lecturers,
        deadlines,
      },
    };
    try {
      const docRef = await addModule(userId, newModule);
      setModules((prev) => [...prev, { ...newModule, id: docRef.id }]);
      closeModal();
    } catch {}
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

  return (
    <NameProvider value={userData}>
      <Layout userId={userId} userData={userData}>
        <div className="transition-all duration-300 flex-grow p-4 mb-10">
          <Header addButtonTitle="neues Modul" addFunctionOnClick={openModal} />
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Neues Modul Erstellen
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Modulname
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
                  <button
                    type="button"
                    onClick={() => {
                      if (newLecturer.trim()) {
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

              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Fristen
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDeadline.name}
                    onChange={(e) =>
                      setNewDeadline({ ...newDeadline, name: e.target.value })
                    }
                    placeholder="Fristenname..."
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
                  <button
                    type="button"
                    onClick={() => {
                      if (newDeadline.name.trim() && newDeadline.date.trim()) {
                        setDeadlines((prev) => [...prev, newDeadline]);
                        setNewDeadline({ name: '', date: '' });
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
                      <span>
                        {dl.name}: {dl.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700">
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
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4">
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
                  Modul erstellen
                </button>
              </div>
            </form>
          </Modal>
          <ModuleCardList
            moduleCards={modules.map((m) => ({
              ...m,
              tasks: m.tasks ?? [],
              activeTasks: m.activeTasks ?? [],
              //isClickable: false,
              onDelete: () => {},
            }))}
            containerClassName="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
          />
          <TaskList
            tasks={todoTasks.map((t) => ({
              ...t,
              description: t.description || '',
            }))}
          />
          <StatCardList stats={statsData} />
        </div>
      </Layout>
    </NameProvider>
  );
}
