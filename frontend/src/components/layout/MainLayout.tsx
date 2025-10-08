import React from "react";
import Toolbar from "../Toolbar";
import ToothChart from "../ToothChart";
import ProcedureHistoryTable from "../ProcedureHistoryTable";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen px-6 pb-6">
      {/* Top row: Toolbar + ToothChart - Constrained to tooth chart height */}
      <div className="flex flex-row items-start w-full">
        {/* Left: Toolbar - matches tooth chart height */}
        <div className="w-64 mt-14 flex-shrink-0 border-r border-gray-200">
          <Toolbar />
        </div>

        {/* Right: ToothChart - defines the height for the row */}
        <div className="flex-1 min-w-0">
          <ToothChart />
        </div>
      </div>

      {/* Bottom: Procedure history table - separate section */}
      <div className="mt-4">
        <ProcedureHistoryTable />
      </div>
    </div>
  );
}
