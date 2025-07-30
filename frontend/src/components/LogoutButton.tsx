import React from 'react';
import { useNavigate } from '@tanstack/react-router';

// Define types for props
interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('dentistId');
    localStorage.removeItem('loggedIn');
    onLogout();
    navigate({ to: '/' }); // navigate to home
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
