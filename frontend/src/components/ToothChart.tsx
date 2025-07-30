import React from 'react';
import Tooth from './Tooth';
import ProcedureModal from './ProcedureModal';

export default function ToothChart() {
  const upperLeft: number[] = Array.from({ length: 8 }, (_, i) => 18 - i);
  const upperRight: number[] = Array.from({ length: 8 }, (_, i) => 21 + i);
  const lowerRight: number[] = Array.from({ length: 8 }, (_, i) => 48 - i);
  const lowerLeft: number[] = Array.from({ length: 8 }, (_, i) => 31 + i);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-4">
        <div className="flex gap-2">
          {upperLeft.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
        <div className="w-6" />
        <div className="flex gap-2">
          {upperRight.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
      </div>

      <div className="h-6" />

      <div className="flex gap-4">
        <div className="flex gap-2">
          {lowerLeft.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
        <div className="w-6" />
        <div className="flex gap-2">
          {lowerRight.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
      </div>

      {/* Modal visible across chart */}
      <ProcedureModal />
    </div>
  );
}
