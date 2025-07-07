import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ToothChart from './components/ToothChart';
import Toolbar from './components/Toolbar';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Dental Chart</h1>
        <Toolbar />
        <div className="mt-8 flex justify-center">
          <ToothChart />
        </div>
      </div>
    </DndProvider>
  );
}