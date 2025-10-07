// App.tsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MainLayout from "./components/layout/MainLayout";
import ProcedureHistoryDrawer from "./components/ProcedureHistoryTable";
import NoteInputModal from "./components/NoteInputModal";
import PatientModal from "./components/PatientModal";

export default function App() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        {/* Use the new MainLayout with sidebar */}
        <MainLayout />

        {/* Keep the modals and history drawer */}
        <PatientModal />
        <NoteInputModal />

        {/* History Drawer */}
        <ProcedureHistoryDrawer
          open={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    </DndProvider>
  );
}
