// components/layout/Header.tsx
import React from 'react';
import LogoutButton from '../LogoutButton';
import { Clock } from 'lucide-react';

interface HeaderProps {
  onShowHistory: () => void;
}

export default function Header({ onShowHistory }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Dental Chart</h1>
        <button
          onClick={onShowHistory}
          className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full shadow-sm bg-white hover:bg-blue-100 transition"
          aria-label="View Procedure History"
          title="View Procedure History"
        >
          <Clock size={20} className="text-blue-600" />
        </button>
      </div>

      <LogoutButton
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('dentistId');
          window.location.href = '/';
        }}
      />
    </header>
  );
}
