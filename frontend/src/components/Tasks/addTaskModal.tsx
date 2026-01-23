'use client';

import React, { useState } from 'react';
import { Modal } from '../Modal/modal';

type ModuleOption = {
  title: string;
  color?: string;
};

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    moduleTitle: string;
  }) => void;
  modules: ModuleOption[];
};

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modules,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModule) {
      alert('Bitte ein Modul auswählen!');
      return;
    }
    if (!title.trim()) {
      alert('Bitte einen Titel eingeben!');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      moduleTitle: selectedModule,
    });

    setTitle('');
    setDescription('');
    setSelectedModule('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Neuen Task erstellen
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Titel */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Titel eingeben..."
            required
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Beschreibung
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Was muss gemacht werden?"
          />
        </div>

        {/* Modul */}
        <div>
          <label className="block text-base font-semibold text-gray-700">
            Modul <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="" disabled>
              -- Modul auswählen --
            </option>
            {modules.map((mod, idx) => (
              <option key={idx} value={mod.title}>
                {mod.title}
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
            Task erstellen
          </button>
        </div>
      </form>
    </Modal>
  );
};
