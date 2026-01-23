import { useState } from 'react';
import { Modal } from '../Modal/modal';
import { moduleDetailsProps } from '../../data/moduleData';
import { Task } from '../Tasks/types';

export type moduleCardProps = {
  title: string;
  color?: string;
  details: moduleDetailsProps;
  tasks: Task[];
  activeTasks: Task[];
  showDetailsButton?: boolean;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showArrowButton?: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  isClickable?: boolean;
};

export const ModuleCard = ({
  title,
  color = 'bg-gray-100',
  details,
  tasks = [],
  activeTasks = [],
  showDetailsButton = false,
  showDeleteButton = false,
  showEditButton = false,
  showArrowButton = false,
  onDelete,
  onEdit,
}: moduleCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === 'done').length;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative">
      <div
        className={`${color} relative rounded-lg shadow p-4 flex flex-col justify-between`}
      >
        {/* Header Section */}
        <div>
          <h2 className="text-lg font-bold mb-2 truncate">{title}</h2>
          <p className="text-sm text-gray-600">
            {totalTasks} Aufgaben | {progress}%
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-300 h-2 rounded-full overflow-hidden mt-2">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Buttons (Details/Edit/Delete) */}
        <div className="flex justify-end items-center mt-2">
          {showDetailsButton && (
            <button
              className="flex items-center text-blue-500 hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </button>
          )}

          {showEditButton && onEdit && (
            <button
              className="flex items-center text-blue-500 hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          )}

          {showDeleteButton && (
            <button
              className="flex items-center text-blue-500 hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165
                  L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25
                  0 0 1-2.244-2.077L4.772 5.79m14.456 0
                  a48.108 48.108 0 0 0-3.478-.397m-12
                  .562c.34-.059.68-.114 1.022-.165m0
                  0a48.11 48.11 0 0 1 3.478-.397m7.5
                  0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                  51.964 0 0 0-3.32 0c-1.18.037-2.09
                  1.022-2.09 2.201v.916m7.5
                  0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Arrow Button in the bottom center to toggle tasks */}
        {showArrowButton && (
          <div className="flex justify-center mt-1">
            <button
              type="button"
              onClick={toggleExpand}
              className="text-gray-500 hover:text-gray-700
                        transform transition-transform duration-200"
            >
              {/* Show different icons depending on expanded state */}
              {isExpanded ? (
                // Arrow Up
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 15l-7.5-7.5L4.5 15"
                  />
                </svg>
              ) : (
                // Arrow Down
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 9l7.5 7.5L19.5 9"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Only show the tasks if expanded */}
        <div
          className={`
          bg-gray-50 rounded-lg shadow-inner
          taskFoldContainer
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'mt-4 p-3 expanded' : 'mt-0 p-0'}
        `}
        >
          <h3 className="text-sm font-bold mb-2">Aufgaben:</h3>
          {activeTasks.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              {activeTasks.map((task) => (
                <li key={task.id}>
                  <span
                    className={`inline-block px-2 py-1 rounded px-2 ${task.color}`}
                  >
                    {task.title}
                  </span>
                  {' - '}
                  {task.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tasks assigned.</p>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <h3 className="text-lg font-bold mb-2">Dozenten:</h3>
          <ul className="list-disc list-inside mb-4">
            {details.lecturers.map((lecturer, index) => (
              <li key={index}>{lecturer}</li>
            ))}
          </ul>
          <h3 className="text-lg font-bold mb-2">Termine:</h3>
          <ul className="list-disc list-inside">
            {details.deadlines.map((deadline, index) => (
              <li key={index}>
                {deadline.name}: {deadline.date}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};
