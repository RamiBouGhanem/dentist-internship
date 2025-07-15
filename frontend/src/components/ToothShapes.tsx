import React from 'react';
import { Trash2 } from 'lucide-react';

// Define types for the procedure object and component props
interface Procedure {
  x?: number;
  y?: number;
  color: string;
}

interface ToothProps {
  procedures?: Procedure[];
  onRemove: (index: number) => void;
}

export const Tooth11: React.FC<ToothProps> = ({ procedures = [], onRemove }) => (
  <svg viewBox="0 0 100 140" className="w-full h-full">
    <path
      d="M50 5 C20 5, 10 50, 30 90 C35 100, 45 130, 50 130 C55 130, 65 100, 70 90 C90 50, 80 5, 50 5 Z"
      fill="#fff"
      stroke="black"
      strokeWidth={2}
    />
    {procedures.map((p, i) => (
      <g key={i}>
        <circle cx={p.x || 50} cy={p.y || 70 + i * 8} r={5} fill={p.color} />
        <foreignObject x={(p.x || 50) + 4} y={(p.y || 70 + i * 8) - 6} width={20} height={20}>
          <button
            className="bg-white text-red-500 rounded-full text-[10px]"
            onClick={() => onRemove(i)}
          >
            <Trash2 size={10} />
          </button>
        </foreignObject>
      </g>
    ))}
  </svg>
);

export const Tooth16: React.FC<ToothProps> = ({ procedures = [], onRemove }) => (
  <svg viewBox="0 0 100 140" className="w-full h-full">
    <path
      d="M30 10 C20 30, 10 70, 20 100 C30 120, 70 120, 80 100 C90 70, 80 30, 70 10 Z"
      fill="#fff"
      stroke="black"
      strokeWidth={2}
    />
    {procedures.map((p, i) => (
      <g key={i}>
        <rect x={p.x || 45} y={p.y || 50 + i * 8} width={6} height={6} fill={p.color} />
        <foreignObject x={(p.x || 45) + 6} y={(p.y || 50 + i * 8) - 5} width={20} height={20}>
          <button
            className="bg-white text-red-500 rounded-full text-[10px]"
            onClick={() => onRemove(i)}
          >
            <Trash2 size={10} />
          </button>
        </foreignObject>
      </g>
    ))}
  </svg>
);

export const Tooth31: React.FC<ToothProps> = ({ procedures = [], onRemove }) => (
  <svg viewBox="0 0 100 140" className="w-full h-full">
    <path
      d="M50 10 C30 30, 25 80, 35 110 C40 120, 60 120, 65 110 C75 80, 70 30, 50 10 Z"
      fill="#fff"
      stroke="black"
      strokeWidth={2}
    />
    {procedures.map((p, i) => (
      <g key={i}>
        <circle cx={p.x || 50} cy={p.y || 60 + i * 8} r={4} fill={p.color} />
        <foreignObject x={(p.x || 50) + 5} y={(p.y || 60 + i * 8) - 4} width={20} height={20}>
          <button
            className="bg-white text-red-500 rounded-full text-[10px]"
            onClick={() => onRemove(i)}
          >
            <Trash2 size={10} />
          </button>
        </foreignObject>
      </g>
    ))}
  </svg>
);

export const DefaultTooth: React.FC<ToothProps> = ({ procedures = [], onRemove }) => (
  <svg viewBox="0 0 100 140" className="w-full h-full">
    <rect x="20" y="20" width="60" height="100" fill="#fff" stroke="black" strokeWidth={2} />
    {procedures.map((p, i) => (
      <g key={i}>
        <circle cx={p.x || 50} cy={p.y || 70 + i * 8} r={4} fill={p.color} />
        <foreignObject x={(p.x || 50) + 5} y={(p.y || 70 + i * 8) - 5} width={20} height={20}>
          <button
            className="bg-white text-red-500 rounded-full text-[10px]"
            onClick={() => onRemove(i)}
          >
            <Trash2 size={10} />
          </button>
        </foreignObject>
      </g>
    ))}
  </svg>
);
