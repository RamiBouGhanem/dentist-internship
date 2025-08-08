import React, { useState } from "react";
import Tooth from "./Tooth";
import { useToothStore } from "../store/useToothStore";
import ProcedureModal from "./ProcedureModal";
import { Repeat2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

const pairedTeeth = [
  // Upper LEFT (1st quadrant on screen) — adult 18 → 11
  // Fix 50s mapping so left→right shows 55,54,53,52,51 when milk is active
  { adult: 18, milk: null }, { adult: 17, milk: null }, { adult: 16, milk: null },
  { adult: 15, milk: 55 }, { adult: 14, milk: 54 }, { adult: 13, milk: 53 },
  { adult: 12, milk: 52 }, { adult: 11, milk: 51 },

  // Upper RIGHT (2nd quadrant on screen) — 21 → 28 (60s already correct: 61 → 65)
  { adult: 21, milk: 61 }, { adult: 22, milk: 62 }, { adult: 23, milk: 63 },
  { adult: 24, milk: 64 }, { adult: 25, milk: 65 }, { adult: 26, milk: null },
  { adult: 27, milk: null }, { adult: 28, milk: null },

  // Lower RIGHT (3rd quadrant on screen) — 31 → 38
  // Fix 70s mapping so left→right shows 71,72,73,74,75 when milk is active
  { adult: 31, milk: 71 }, { adult: 32, milk: 72 }, { adult: 33, milk: 73 },
  { adult: 34, milk: 74 }, { adult: 35, milk: 75 }, { adult: 36, milk: null },
  { adult: 37, milk: null }, { adult: 38, milk: null },

  // Lower LEFT (4th quadrant on screen) — 48 → 41 (80s already correct: 81 → 85)
  { adult: 48, milk: null }, { adult: 47, milk: null }, { adult: 46, milk: null },
  { adult: 45, milk: 85 }, { adult: 44, milk: 84 }, { adult: 43, milk: 83 },
  { adult: 42, milk: 82 }, { adult: 41, milk: 81 },
];

const excludedTeeth = [18, 17, 16, 26, 27, 28, 36, 37, 38, 46, 47, 48];

export default function ToothChart() {
  const { toothTypes, toggleToothType, hasModalOpen, patientId, patients } = useToothStore();

  const [confirmToggle, setConfirmToggle] = useState<null | {
    adult: number;
    isMilk: boolean;
  }>(null);

  const currentPatient = patients.find((p) => p._id === patientId);
  const isChild = currentPatient?.dentitionType === "child";

  const handleToggleClick = (adult: number, isCurrentlyMilk: boolean) => {
    setConfirmToggle({ adult, isMilk: isCurrentlyMilk });
  };

  const confirmToggleAction = () => {
    if (confirmToggle) {
      toggleToothType(confirmToggle.adult);
      setConfirmToggle(null);
    }
  };

  const cancelToggleAction = () => {
    setConfirmToggle(null);
  };

  const renderToothBlock = (adult: number, milk: number | null) => {
    const stored = toothTypes[adult.toString()];
    const forcedMilk = isChild && milk && stored === undefined;
    const isMilk = forcedMilk || stored === "milk";

    const active = isMilk && milk ? milk : adult;
    const passive = isMilk && milk ? adult : milk;
    const isExcluded = isChild && excludedTeeth.includes(adult);

    return (
      <div
        key={adult}
        className={`relative w-[44px] h-[44px] group ${isExcluded ? "opacity-30 pointer-events-none" : ""}`}
      >
        {passive && (
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Tooth number={passive} dimmed />
          </div>
        )}

        <div className="absolute inset-0 z-10">
          <Tooth number={active} allowToggle={!!milk && !isExcluded} />
        </div>

        {milk && (
          <button
            onClick={() => handleToggleClick(adult, isMilk)}
            title="Toggle between adult and milk tooth"
            className={`absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-white border border-gray-300 rounded p-0.5 shadow hover:bg-gray-100 ${isExcluded ? "hidden" : ""}`}
          >
            <Repeat2 className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    );
  };

  const upperLeftQuadrant = pairedTeeth.slice(0, 8);
  const upperRightQuadrant = pairedTeeth.slice(8, 16);
  const lowerRightQuadrant = pairedTeeth.slice(16, 24);
  const lowerLeftQuadrant = pairedTeeth.slice(24, 32);

  return (
    <div
      className={`flex flex-col gap-12 items-center justify-center px-2 sm:px-6 py-4 transition mt-12${
        hasModalOpen ? " pointer-events-none blur-[1px]" : ""
      }`}
    >
      {/* Upper teeth row */}
      <div className="flex flex-row gap-6 max-w-full justify-center mt-8">
        {/* Upper Left quadrant (18-11) */}
        <div className="flex flex-row gap-4">
          {upperLeftQuadrant.map(({ adult, milk }) => renderToothBlock(adult, milk))}
        </div>
        {/* Upper Right quadrant (21-28) */}
        <div className="flex flex-row gap-4">
          {upperRightQuadrant.map(({ adult, milk }) => renderToothBlock(adult, milk))}
        </div>
      </div>

      {/* Lower teeth row */}
      <div className="flex flex-row gap-6 max-w-full justify-center mt-8 mb-4">
        {/* Lower LEFT quadrant (48-41) */}
        <div className="flex flex-row gap-4">
          {lowerLeftQuadrant.map(({ adult, milk }) => renderToothBlock(adult, milk))}
        </div>
        {/* Lower RIGHT quadrant (31-38) */}
        <div className="flex flex-row gap-4">
          {lowerRightQuadrant.map(({ adult, milk }) => renderToothBlock(adult, milk))}
        </div>
      </div>

      <ProcedureModal />

      <Dialog
        open={!!confirmToggle}
        onClose={cancelToggleAction}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="bg-white rounded-xl shadow-xl p-6 z-50 max-w-sm mx-auto">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Confirm Tooth Type Switch
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mt-2">
            Are you sure you want to switch this tooth to{" "}
            <span className="font-bold text-indigo-600">
              {confirmToggle?.isMilk ? "adult" : "milk"}
            </span>{" "}
            type? This action may affect procedures already applied.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={cancelToggleAction}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleAction}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Yes, switch
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
