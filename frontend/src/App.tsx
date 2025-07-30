import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from './components/layout/Header';
// import PatientSection from './components/layout/PatientSection';
// import ToolbarSection from './components/layout/ToolbarSection';
// import ToothChartSection from './components/layout/ToothChartSection';
import ProcedureHistoryDrawer from './components/ProcedureHistoryTable';
import NoteInputModal from './components/NoteInputModal';
import PatientModal from './components/PatientModal';
import Toolbar from './components/Toolbar';
import ToothChart from './components/ToothChart';
import PatientSelector from './components/PatientSelector';

export default function App() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <Header onShowHistory={() => setShowHistory(true)} />

        {/* Modals */}
        <PatientModal />
        <NoteInputModal />

        {/* Patient Selector Section */}
        <PatientSelector />

        {/* Toolbar */}
        <Toolbar />

        {/* Tooth Chart */}
        <ToothChart />

        {/* History Drawer */}
        <ProcedureHistoryDrawer
          open={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    </DndProvider>
  );
}
