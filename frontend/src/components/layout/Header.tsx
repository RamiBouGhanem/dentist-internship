// components/layout/Header.tsx
import React from "react";
import LogoutButton from "../LogoutButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
      {/* Left Section */}
      <h1 className="text-3xl font-bold text-blue-700">Dental Chart</h1>

      {/* Right Section */}
      <LogoutButton
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("dentistId");
          localStorage.removeItem("loggedIn");
          window.location.href = "/";
        }}
      />
    </header>
  );
}
