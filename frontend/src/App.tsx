import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Header from "./components/layout/Header";
import MainLayout from "./components/layout/MainLayout";
import PatientModal from "./components/PatientModal";
import NoteInputModal from "./components/NoteInputModal";
import PatientSelector from "./components/PatientSelector";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">

         {/* Header */}
        <Header />

        {/* Modals */}
        <PatientModal />
        <NoteInputModal />

        {/* Patient Selector */}
        <div className="mt-4">
          <PatientSelector />
        </div>

        {/* Main content */}
        <MainLayout />
      </div>
    </DndProvider>
  );
}
