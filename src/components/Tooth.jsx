// each tooth
import React from 'react';
import { useDrop } from 'react-dnd';
import { useToothStore } from '../store/useToothStore';
import { Trash2 } from 'lucide-react';

export default function Tooth({ number }) {
  const { teethData, addProcedureToTooth, removeProcedureFromTooth } = useToothStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'procedure',
    drop: (item) => addProcedureToTooth(number, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const procedures = teethData[number] || [];

  return (
    <div
      ref={drop}
      className="w-12 h-16 border rounded flex flex-col items-center justify-center text-xs font-semibold text-center overflow-hidden bg-cover bg-center" // Added bg-cover and bg-center for Tailwind CSS
      style={{
        backgroundColor: isOver ? 'lightgray' : '#fff',
        backgroundImage: `url('/11-21.jpeg')`, // Added background image
      }}
    >
      <div>{number}</div>
      <div className="flex flex-wrap justify-center items-center gap-0.5 mt-1">
        {procedures.map((p, idx) => (
          <div key={idx} className="relative group">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
              title={p.type}
            ></div>
            <button
              className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full text-[10px] hidden group-hover:block"
              onClick={() => removeProcedureFromTooth(number, idx)}
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}