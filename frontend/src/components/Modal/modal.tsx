'use client';

import { ReactNode } from 'react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-lg w-full relative animate-scaleIn">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-gray-800 focus:outline-none"
          aria-label="Close Modal"
        >
          ✖
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
