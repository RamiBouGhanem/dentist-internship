// components/layout/MainLayout.tsx
import React from "react";
import Header from "./Header";
import ProcedureSidebar from "../ProcedureSidebas";
import ToothChart from "../ToothChart";
import ProcedureHistoryTable from "../ProcedureHistoryTable";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content Area - Takes full width */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header with Dental Chart title and patient search */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Header />
          </div>
        </div>

        {/* Content Area with Sidebar and Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar - Scrollable and fixed height */}
          <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <ProcedureSidebar />
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-6">
              {/* Tooth Chart - Fixed container with proper spacing */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <ToothChart />
              </div>

              {/* Procedure History Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ProcedureHistoryTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
