// components/layout/MainLayout.tsx
import React from 'react';
import Toolbar from '../Toolbar';
import ToothChart from '../ToothChart';

export default function MainLayout() {
  return (
    <main className="flex flex-1 flex-col items-center px-8 py-6 bg-gray-50 overflow-y-auto">
      {/* Toolbar */}
      <div className="w-full max-w-5xl mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex justify-center">
          <Toolbar />
        </div>
      </div>

      {/* Tooth Chart */}
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow p-6">
          <ToothChart />
        </div>
      </div>
    </main>
  );
}
