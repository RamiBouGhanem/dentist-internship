// src/App.tsx
import React, { useState } from "react";

import Header from "./components/Header";
import ProcedureHistoryDrawer from "./components/ProcedureHistoryTable";
import NoteInputModal from "./components/NoteInputModal";
import PatientModal from "./components/PatientModal";
import Toolbar from "./components/Toolbar";
import ToothChart from "./components/ToothChart";
import PatientSelector from "./components/PatientSelector";

export default function App() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="px-4 md:px-6 pt-6">
        <Header onShowHistory={() => setShowHistory(true)} />
      </div>

      {/* Global modals */}
      <PatientModal />
      <NoteInputModal />

      {/* Patient selector */}
      <div className="px-4 md:px-6 mt-4">
        <PatientSelector />
      </div>

      {/* Workspace: Toolbar aside + Chart */}
      <div className="px-4 md:px-6 pb-6 mt-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start gap-6">
            {/* Sidebar (Toolbar) */}
            <div className="sticky top-4">
              <Toolbar />
            </div>

            {/* Main (Tooth chart) */}
            <div className="flex-1 overflow-hidden">
              <ToothChart />
            </div>
          </div>
        </div>
      </div>

      {/* History Drawer */}
      <ProcedureHistoryDrawer
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
