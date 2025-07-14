import React from 'react';
import Tooth from './Tooth';

export default function ToothChart() {

  const upperLeft = Array.from({ length: 8 }, (_, i) => 18 - i);
  const upperRight = Array.from({ length: 8 }, (_, i) => 21 + i);
  const lowerRight = Array.from({ length: 8 }, (_, i) => 48 - i);
  const lowerLeft = Array.from({ length: 8 }, (_, i) => 31 + i);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Upper Arch */}
      <div className="flex gap-4">
        {/* Upper Left Quadrant */}
        <div className="flex gap-2">
          {upperLeft.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>

        <div className="w-6" />
        {/* Upper Right Quadrant */}
        <div className="flex gap-2">
          {upperRight.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
      </div>
      

      <div className="h-6" /> 

      {/* Lower Arch */}
      <div className="flex gap-4">
        {/* Lower Left Quadrant */}
        <div className="flex gap-2">
          {lowerLeft.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>

        <div className="w-6" />
        {/* Lower Right Quadrant */}
        <div className="flex gap-2">
          {lowerRight.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
      </div>
    </div>
  );
}
