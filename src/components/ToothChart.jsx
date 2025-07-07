import React from 'react';
import Tooth from './Tooth'; // Assuming Tooth.jsx is in the same directory

export default function ToothChart() {
  // Define tooth numbers for each quadrant
  const upperLeft = Array.from({ length: 8 }, (_, i) => 18 - i); // 18, 17, ..., 11
  const upperRight = Array.from({ length: 8 }, (_, i) => 21 + i); // 21, 22, ..., 28
  const lowerRight = Array.from({ length: 8 }, (_, i) => 48 - i); // 48, 47, ..., 41
  const lowerLeft = Array.from({ length: 8 }, (_, i) => 31 + i); // 31, 32, ..., 38

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
        {/* Spacer for the gap between central incisors */}
        <div className="w-6" />
        {/* Upper Right Quadrant */}
        <div className="flex gap-2">
          {upperRight.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
      </div>
      
      {/* Spacer between upper and lower arches */}
      <div className="h-6" /> 

      {/* Lower Arch */}
      <div className="flex gap-4">
        {/* Lower Left Quadrant */}
        <div className="flex gap-2">
          {lowerLeft.map((number) => (
            <Tooth key={number} number={number} />
          ))}
        </div>
        {/* Spacer for the gap between central incisors */}
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
