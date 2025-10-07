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
