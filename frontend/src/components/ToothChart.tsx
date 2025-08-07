// File: components/ToothChart.tsx
import React, { useState } from "react";
import Tooth from "./Tooth";
import { useToothStore } from "../store/useToothStore";
import ProcedureModal from "./ProcedureModal";
import { Repeat2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

const pairedTeeth = [
  // Upper LEFT to RIGHT (adult 28 → 18)
  { adult: 28, milk: null }, { adult: 27, milk: null }, { adult: 26, milk: null },
  { adult: 25, milk: 65 }, { adult: 24, milk: 64 }, { adult: 23, milk: 63 },
  { adult: 22, milk: 62 }, { adult: 21, milk: 61 }, { adult: 11, milk: 55 },
  { adult: 12, milk: 54 }, { adult: 13, milk: 53 }, { adult: 14, milk: 52 },
  { adult: 15, milk: 51 }, { adult: 16, milk: null }, { adult: 17, milk: null },
  { adult: 18, milk: null },

  // Lower left to right (38 → 48)
  { adult: 38, milk: null }, { adult: 37, milk: null }, { adult: 36, milk: null },
  { adult: 35, milk: 71 }, { adult: 34, milk: 72 }, { adult: 33, milk: 73 },
  { adult: 32, milk: 74 }, { adult: 31, milk: 75 }, { adult: 41, milk: 81 },
  { adult: 42, milk: 82 }, { adult: 43, milk: 83 }, { adult: 44, milk: 84 },
  { adult: 45, milk: 85 }, { adult: 46, milk: null }, { adult: 47, milk: null },
  { adult: 48, milk: null },
];

export default function ToothChart() {
  const { toothTypes, toggleToothType, hasModalOpen } = useToothStore();

  const [confirmToggle, setConfirmToggle] = useState<null | {
    adult: number;
    isMilk: boolean;
  }>(null);

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
    const isMilk = toothTypes[adult.toString()] === "milk";
    const active = isMilk && milk ? milk : adult;
    const passive = isMilk && milk ? adult : milk;

    return (
      <div
        key={adult}
        className="relative w-[44px] h-[44px] group"
      >
        {passive && (
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Tooth number={passive} dimmed />
          </div>
        )}

        <div className="absolute inset-0 z-10">
          <Tooth number={active} allowToggle={!!milk} />
        </div>

        {milk && (
          <button
            onClick={() => handleToggleClick(adult, isMilk)}
            title="Toggle between adult and milk tooth"
            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-white border border-gray-300 rounded p-0.5 shadow hover:bg-gray-100"
          >
            <Repeat2 className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col gap-20 items-center justify-center px-2 sm:px-6 py-4 transition ${
        hasModalOpen ? "pointer-events-none blur-[1px]" : ""
      }`}
    >
      <div className="flex flex-row-reverse gap-8 max-w-full justify-center">
        {pairedTeeth.slice(0, 16).map(({ adult, milk }) =>
          renderToothBlock(adult, milk)
        )}
      </div>

      <div className="flex flex-row-reverse gap-8 max-w-full justify-center">
        {pairedTeeth.slice(16).map(({ adult, milk }) =>
          renderToothBlock(adult, milk)
        )}
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
