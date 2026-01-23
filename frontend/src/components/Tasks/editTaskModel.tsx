'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal/modal';
import { Task } from './types';

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  modules: { title: string; color?: string }[];
  onSave: (updatedData: {
    id: string;
    title: string;
    description: string;
    moduleTitle: string;
    color?: string;
  }) => void;
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  modules,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');

  useEffect(() => {
    if (task) {
      // Titel = originaler Titel
      setTitle(task.title);
      setDescription(task.description || '');
      // Falls task.moduleTitle existiert, übernehmen wir es.
      setSelectedModule(task.moduleTitle || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule.trim()) {
      alert('Bitte ein Modul auswählen');
      return;
    }
    if (!title.trim()) {
      alert('Bitte einen Titel eingeben!');
      return;
    }

    // Farbe aus dem Modul ziehen oder grau als Default
    const foundModule = modules.find((m) => m.title === selectedModule);
    const color = foundModule?.color || 'bg-gray-300';

    onSave({
      id: String(task.id),
      title: title.trim(),
      description: description.trim(),
      moduleTitle: selectedModule,
      color,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center">Task bearbeiten</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Titel */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Titel
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Beschreibung
          </label>
          <textarea
            className="border p-2 rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Modul */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Modul
          </label>
          <select
            className="border p-2 rounded w-full"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Modul auswählen --
            </option>
            {modules.map((m) => (
              <option key={m.title} value={m.title}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mt-2">
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
            Änderungen speichern
          </button>
        </div>
      </form>
    </Modal>
  );
};
