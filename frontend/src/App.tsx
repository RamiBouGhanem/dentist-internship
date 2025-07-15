import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Toolbar from './components/Toolbar';
import ToothChart from './components/ToothChart';
import PatientModal from './components/PatientModal';
import PatientSelector from './components/PatientSelector';
import AuthForm from './components/dentists/AuthForm'; // Make sure you're importing it correctly
import LogoutButton from './components/LogoutButton';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  if (!loggedIn) {
    return <AuthForm onAuth={() => setLoggedIn(true)} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-6">
        <LogoutButton onLogout={() => setLoggedIn(false)} />
        <h1 className="text-3xl font-bold text-center mb-4">Dental Chart</h1>
        <PatientModal />
        <PatientSelector />
        <Toolbar />
        <div className="mt-8 flex justify-center">
          <ToothChart />
        </div>
      </div>
    </DndProvider>
  );
}
