// src/components/ProcedurePalette.jsx
import React from 'react';

// Define the procedure items with their exact names and public paths to icons
const procedureItems = [
  { name: "Endo", icon: '/procedures/endo.svg' },
  { name: "Filling", icon: '/procedures/filling.svg' },
  { name: "Implant", icon: '/procedures/implant.svg' },
  { name: "CCM", icon: '/procedures/ccm.svg' },
  { name: "Zirconia", icon: '/procedures/zirconia.svg' },
  { name: "Veneer", icon: '/procedures/veneer.svg' },
  { name: "FiberPost", icon: '/procedures/fiberpost.svg' },
  { name: "MetalPost", icon: '/procedures/metalpost.svg' },
  { name: "Extraction", icon: '/procedures/extraction.svg' },
  // Ensure this list is exhaustive and matches your available icons and desired procedures
];

export default function ProcedurePalette({ onSelectProcedure, selectedProcedure }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md mb-8 w-full max-w-5xl"> {/* Added max-w-5xl to match chart width */}
      {procedureItems.map((item) => (
        <button
          key={item.name}
          onClick={() => onSelectProcedure(item.name)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200
                      ${selectedProcedure === item.name ? 'bg-blue-500 text-white shadow-lg' : 'bg-white hover:bg-gray-200'}
                      min-w-[80px]`} 
        >
          <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain mb-1" />
          <span className={`text-xs font-medium ${selectedProcedure === item.name ? 'text-white' : 'text-gray-700'}`}>
            {item.name}
          </span>
        </button>
      ))}
      {/* Clear selection button */}
      <button
        onClick={() => onSelectProcedure(null)}
        className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200
                    ${selectedProcedure === null ? 'bg-red-500 text-white shadow-lg' : 'bg-white hover:bg-gray-200'}
                    min-w-[80px]`}
      >
        <span className="text-2xl">X</span> {/* Simple 'X' for clear */}
        <span className="text-xs font-medium">Clear</span>
      </button>
    </div>
  );
}