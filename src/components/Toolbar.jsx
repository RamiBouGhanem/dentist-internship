// src/components/Toolbar.jsx
import React from 'react';
import ProcedureItem from './ProcedureItem';

const procedures = [
  { type: 'Endo', color: '#7B68EE' },
  { type: 'Filling', color: '#FFD700' },
  { type: 'Implant', color: '#708090' },
  { type: 'Extraction', color: '#DC143C' },
  { type: 'Zirconia', color: '#00CED1' },
  { type: 'CCM', color: '#98FB98' }
];

export default function Toolbar() {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {procedures.map((proc) => (
        <ProcedureItem key={proc.type} type={proc.type} color={proc.color} />
      ))}
    </div>
  );
}