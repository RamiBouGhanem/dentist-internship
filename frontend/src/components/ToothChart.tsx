import React from 'react';
import Tooth from './Tooth';

// Define the types for the ToothChart component
export default function ToothChart() {

  // Upper and Lower Arch tooth numbers
  const upperLeft: number[] = Array.from({ length: 8 }, (_, i) => 18 - i);
  const upperRight: number[] = Array.from({ length: 8 }, (_, i) => 21 + i);
  const lowerRight: number[] = Array.from({ length: 8 }, (_, i) => 48 - i);
  const lowerLeft: number[] = Array.from({ length: 8 }, (_, i) => 31 + i);

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
