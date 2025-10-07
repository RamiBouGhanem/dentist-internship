// components/layout/Header.tsx
import React from "react";
import LogoutButton from "../LogoutButton";
import { Plus, Search } from "lucide-react";

export default function Header() {
  return (
    <header
      className=" bg-white border-r border-gray-200 flex flex-col"
      style={{ height: "fit-content", minHeight: "100px" }}
    >
      <div className="p-4 border-b border-gray-200  items-center justify-center ">
        <h1 className="text-3xl font-bold text-blue-700 top-1/2  flex items-center mb-8 justify-center ">
          Dental Chart
        </h1>
        {/* Add Patient Button - Better styling */}
        <div className="flex items-center justify-center ">
          <button className="w-auto flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-3 text-sm">
            <Plus className="w-4 h-4 gap-4" />
            Add Patient
          </button>
        </div>

        {/* Search - Better styling */}
        <div className="flex items-center justify-center ">
          <button className="mb-5">
            <Search className="absolute  transform right-1/4 text-gray-400 w-5 h-5 mb-10" />
          </button>
          <input
            type="text"
            placeholder="Search and select patient..."
            className="w-1/2 item-center flex justify-center pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

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
