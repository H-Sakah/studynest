'use client';

import { Modal } from '../Modal/modal';
import React from 'react';

export type DeleteTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
};

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Task löschen
        </h2>
        <p className="text-medium text-gray-600 mb-6 text-center">
          Möchtest du den Task <span className="font-semibold">{taskTitle}</span> wirklich löschen?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
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
            onClick={onClose}
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
      </div>
    </Modal>
  );
};
