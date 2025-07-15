import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

// Define the types for the props
interface ProcedureItemProps {
  type: string;
  color: string;
}

export default function ProcedureItem({ type, color }: ProcedureItemProps) {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'procedure',
    item: { type, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Use the drag function to connect the element to the drag source
  drag(dragRef);

  return (
    <div
      ref={dragRef} // Correctly assign the ref to the element
      className="relative group w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-md transition"
      style={{ backgroundColor: color, opacity: isDragging ? 0.5 : 1 }}
    >
      {type[0]}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-10">
        {type}
      </div>
    </div>
  );
}
