import React from "react";
import Toolbar from "../Toolbar";
import ToothChart from "../ToothChart";
import ProcedureHistoryTable from "../ProcedureHistoryTable";

export default function MainLayout() {
  return (
    <div className="px-6 pb-6">
      {/* Top row: Toolbar (fixed) + ToothChart (fills) */}
      <div className="flex flex-row flex-nowrap items-start w-full min-h-0 gap-4">
        {/* Left: Toolbar fixed width */}
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
          <Toolbar />
        </aside>

        {/* Right: ToothChart */}
        <main className="flex-1 min-w-0">
          <ToothChart />
        </main>
      </div>

      {/* Bottom: Procedure history table */}
      <div className="mt-4">
        <ProcedureHistoryTable />
      </div>
    </div>
  );
}
