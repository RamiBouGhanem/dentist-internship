// src/components/ProcedureItem.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

export default function ProcedureItem({ type, color }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'procedure',
    item: { type, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
      style={{ backgroundColor: color, opacity: isDragging ? 0.5 : 1 }}
    >
      {type[0]}
    </div>
  );
}