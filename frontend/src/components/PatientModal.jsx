import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CreatePatientForm from './CreatePatientForm';

export default function PatientModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="mb-6 text-center">
      <button
        onClick={toggleModal}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow-md transition"
      >
        <Plus size={20} />
        Add Patient
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
            <CreatePatientForm onSuccess={toggleModal} />
          </div>
        </div>
      )}
    </div>
  );
}
