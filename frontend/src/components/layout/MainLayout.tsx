// components/layout/MainLayout.tsx
import React from "react";
import Toolbar from "../Toolbar";
import ToothChart from "../ToothChart";
import ProcedureHistoryTable from "../ProcedureHistoryTable";

export default function MainLayout() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* content container */}
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* responsive 2-col: stack on <xl, side-by-side on xl+ */}
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* LEFT: Tooth chart + history (flexible) */}
          <section className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <ToothChart />
              <div className="mt-6">
                <ProcedureHistoryTable />
              </div>
            </div>
          </section>

          {/* RIGHT: Toolbar (fixed width, sticky, scrollable) */}
          <aside
            className="
              w-full xl:w-[380px] 2xl:w-[420px] shrink-0
              xl:sticky xl:top-6
            "
          >
            <div
              className="
                bg-white rounded-xl shadow p-3 sm:p-4
                max-h-[calc(100vh-3rem)] xl:max-h-[calc(100vh-4rem)]
                overflow-y-auto
              "
            >
              <Toolbar />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
