import React from "react";
import { useToothStore } from "../store/useToothStore";

interface ProcedureItemProps {
  type: string;
  color: string;
}

export default function ProcedureItem({ type, color }: ProcedureItemProps) {
  const { selectedProcedureForAdd, selectProcedureForAdd, clearSelectedForAdd } = useToothStore();

  const isSelected = selectedProcedureForAdd?.type === type;

  const onClick = () => {
    if (isSelected) {
      clearSelectedForAdd();
    } else {
      // pass color so Bridge keeps the bar color
      selectProcedureForAdd({ type, color });
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded border shadow-sm transition
        ${isSelected ? "ring-2 ring-indigo-500 bg-indigo-50" : "bg-white hover:bg-gray-50"}
      `}
      style={{ borderColor: isSelected ? "rgba(99,102,241,0.6)" : "#e5e7eb" }}
      title={type}
    >
      <span className="inline-block w-3 h-3 rounded mr-2 align-middle" style={{ backgroundColor: color }} />
      <span className="align-middle">{type}</span>
      {isSelected && <span className="ml-2 text-xs text-indigo-600">(selected)</span>}
    </button>
  );
}
