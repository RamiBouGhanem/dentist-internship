import React from 'react';

export default function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('dentistId');
    onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-50"
    >
      Logout
    </button>
  );
}
