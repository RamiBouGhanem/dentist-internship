// File: components/ToothChart.tsx
import React, { useState } from "react";
import Tooth from "./Tooth";
import { useToothStore } from "../store/useToothStore";
import ProcedureModal from "./ProcedureModal";
import { Repeat2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

/** Layout constants tuned to keep previous width (44px) and current taller height */
const CELL_W_CLASS = "w-[34px]";         // <- previous width
const TOOTH_NATIVE_W = 64;               // Tooth.tsx (w-16) ~ 64px
const TOOTH_NATIVE_H = 96;               // Tooth.tsx (h-24) ~ 96px
const SCALE = 52 / TOOTH_NATIVE_W;       // 0.6875 to fit 44px width
const SCALED_H = TOOTH_NATIVE_H * SCALE; // 96 * .6875 = 66px visual height

const OCCLUSAL_DX = 0;       // px, slight right nudge
const UPPER_MT = 10;         // px, occlusal margin-top under upper teeth
const LOWER_MB = 8;          // px, occlusal margin-bottom above lower teeth
const VERTICAL_GAP = "gap-20"; // tall chart spacing

/** Paired dentition map */
const pairedTeeth = [
  // Upper LEFT (1st quadrant)
  { adult: 18, milk: null },
  { adult: 17, milk: null },
  { adult: 16, milk: null },
  { adult: 15, milk: 55 },
  { adult: 14, milk: 54 },
  { adult: 13, milk: 53 },
  { adult: 12, milk: 52 },
  { adult: 11, milk: 51 },

  // Upper RIGHT (2nd quadrant)
  { adult: 21, milk: 61 },
  { adult: 22, milk: 62 },
  { adult: 23, milk: 63 },
  { adult: 24, milk: 64 },
  { adult: 25, milk: 65 },
  { adult: 26, milk: null },
  { adult: 27, milk: null },
  { adult: 28, milk: null },

  // Lower RIGHT (3rd quadrant)
  { adult: 31, milk: 71 },
  { adult: 32, milk: 72 },
  { adult: 33, milk: 73 },
  { adult: 34, milk: 74 },
  { adult: 35, milk: 75 },
  { adult: 36, milk: null },
  { adult: 37, milk: null },
  { adult: 38, milk: null },

  // Lower LEFT (4th quadrant)
  { adult: 48, milk: null },
  { adult: 47, milk: null },
  { adult: 46, milk: null },
  { adult: 45, milk: 85 },
  { adult: 44, milk: 84 },
  { adult: 43, milk: 83 },
  { adult: 42, milk: 82 },
  { adult: 41, milk: 81 },
];

const excludedTeeth = [18, 17, 16, 26, 27, 28, 36, 37, 38, 46, 47, 48];

/** Bigger occlusal top-view (28×28) ready for 5-region fillings */
const Occlusal = ({
  onPick,
  toothNumber,
}: {
  onPick?: (tooth: number, region: "M" | "D" | "B" | "L" | "C") => void;
  toothNumber?: number;
}) => {
  const SIZE = 28;
  const OUTER_R = SIZE / 2 - 1.2;
  const INNER_R = 8;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const STROKE = 1.6;

  const fire = (r: "M" | "D" | "B" | "L" | "C") =>
    onPick && toothNumber != null && onPick(toothNumber, r);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block" aria-label="Tooth top view">
      <circle cx={CX} cy={CY} r={OUTER_R} fill="white" stroke="#111827" strokeWidth={STROKE} />
      <circle cx={CX} cy={CY} r={INNER_R} fill="white" stroke="#111827" strokeWidth={STROKE} />
      {/* spokes */}
      <line x1={CX - OUTER_R} y1={CY} x2={CX - INNER_R} y2={CY} stroke="#111827" strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={CX + INNER_R} y1={CY} x2={CX + OUTER_R} y2={CY} stroke="#111827" strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={CX} y1={CY - OUTER_R} x2={CX} y2={CY - INNER_R} stroke="#111827" strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={CX} y1={CY + INNER_R} x2={CX} y2={CY + OUTER_R} stroke="#111827" strokeWidth={STROKE} strokeLinecap="round" />
      {/* clickable regions */}
      <path
        d={`M ${CX} ${CY - INNER_R} A ${INNER_R} ${INNER_R} 0 0 0 ${CX} ${CY + INNER_R}
            L ${CX - OUTER_R} ${CY} A ${OUTER_R} ${OUTER_R} 0 0 1 ${CX} ${CY - OUTER_R} Z`}
        fill="transparent" className="cursor-pointer" onClick={() => fire("M")}
      />
      <path
        d={`M ${CX} ${CY - INNER_R} A ${INNER_R} ${INNER_R} 0 0 1 ${CX} ${CY + INNER_R}
            L ${CX + OUTER_R} ${CY} A ${OUTER_R} ${OUTER_R} 0 0 0 ${CX} ${CY - OUTER_R} Z`}
        fill="transparent" className="cursor-pointer" onClick={() => fire("D")}
      />
      <path
        d={`M ${CX - INNER_R} ${CY} A ${INNER_R} ${INNER_R} 0 0 1 ${CX + INNER_R} ${CY}
            L ${CX} ${CY - OUTER_R} A ${OUTER_R} ${OUTER_R} 0 0 0 ${CX - OUTER_R} ${CY} Z`}
        fill="transparent" className="cursor-pointer" onClick={() => fire("B")}
      />
      <path
        d={`M ${CX - INNER_R} ${CY} A ${INNER_R} ${INNER_R} 0 0 0 ${CX + INNER_R} ${CY}
            L ${CX} ${CY + OUTER_R} A ${OUTER_R} ${OUTER_R} 0 0 1 ${CX - OUTER_R} ${CY} Z`}
        fill="transparent" className="cursor-pointer" onClick={() => fire("L")}
      />
      <circle cx={CX} cy={CY} r={INNER_R - 1} fill="transparent" className="cursor-pointer" onClick={() => fire("C")} />
    </svg>
  );
};

export default function ToothChart() {
  const { toothTypes, toggleToothType, hasModalOpen, patientId, patients } = useToothStore();

  const [confirmToggle, setConfirmToggle] = useState<null | { adult: number; isMilk: boolean }>(null);

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
  const cancelToggleAction = () => setConfirmToggle(null);

  /** Render one tooth (active), with optional passive dimmed behind, scaled to 44px width. */
  const renderToothBlock = (adult: number, milk: number | null) => {
    const isMilk = toothTypes[adult.toString()] === "milk";
    const active = isMilk && milk ? milk : adult;
    const passive = isMilk && milk ? adult : milk;
    const isExcluded = isChild && excludedTeeth.includes(adult);

    // A 44px-wide column that holds a visually 66px-tall scaled tooth (from 96px).
    return (
      <div
        key={adult}
        className={`relative ${CELL_W_CLASS} group ${isExcluded ? "opacity-30 pointer-events-none" : ""}`}
        style={{ height: `${SCALED_H}px` }}
      >
        {/* PASSIVE dimmed tooth behind (scaled) */}
        {passive && (
          <div className="absolute left-1/2 top-0 -translate-x-1/2 z-0 opacity-0 pointer-events-none"
               style={{
                 width: `${TOOTH_NATIVE_W}px`,
                 height: `${TOOTH_NATIVE_H}px`,
                 transform: `translateX(-50%) scale(${SCALE})`,
                 transformOrigin: "top center",
               }}>
            <Tooth number={passive} dimmed />
          </div>
        )}

        {/* ACTIVE tooth (scaled) */}
        <div
          className="absolute left-1/2 top-0 z-10"
          style={{
            width: `${TOOTH_NATIVE_W}px`,
            height: `${TOOTH_NATIVE_H}px`,
            transform: `translateX(-50%) scale(${SCALE})`,
            transformOrigin: "top center",
          }}
        >
          <Tooth number={active} allowToggle={!!milk && !isExcluded} />
        </div>

        {milk && (
          <button
            onClick={() => handleToggleClick(adult, isMilk)}
            title="Toggle between adult and milk tooth"
            className={`absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-white rounded shadow hover:bg-gray-100 ${
              isExcluded ? "hidden" : ""
            }`}
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

  /** Cell stacks tooth + occlusal centered within the 44px column. */
  const UpperCell = ({ adult, milk }: { adult: number; milk: number | null }) => (
    <div className={`${CELL_W_CLASS} flex flex-col items-center`}>
      {renderToothBlock(adult, milk)}
      <div
        className={`${CELL_W_CLASS} flex justify-center`}
        style={{ marginTop: UPPER_MT, transform: `translateX(${OCCLUSAL_DX}px)` }}
      >
        <Occlusal />
      </div>
    </div>
  );

  const LowerCell = ({ adult, milk }: { adult: number; milk: number | null }) => (
    <div className={`${CELL_W_CLASS} flex flex-col items-center`}>
      <div
        className={`${CELL_W_CLASS} flex justify-center`}
        style={{ marginBottom: LOWER_MB, transform: `translateX(${OCCLUSAL_DX}px)` }}
      >
        <Occlusal />
      </div>
      {renderToothBlock(adult, milk)}
    </div>
  );

  return (
    <div
      className={`flex flex-col ${VERTICAL_GAP} items-center justify-center px-2 sm:px-6 py-8 transition ${
        hasModalOpen ? "pointer-events-none blur-[1px]" : ""
      }`}
    >
      {/* UPPER teeth row */}
      <div className="flex flex-row gap-20 max-w-full justify-center mt-2">
        {/* Upper Left (18-11) */}
        <div className="flex flex-row gap-10">
          {upperLeftQuadrant.map(({ adult, milk }) => (
            <UpperCell key={adult} adult={adult} milk={milk} />
          ))}
        </div>
        {/* Upper Right (21-28) */}
        <div className="flex flex-row gap-10">
          {upperRightQuadrant.map(({ adult, milk }) => (
            <UpperCell key={adult} adult={adult} milk={milk} />
          ))}
        </div>
      </div>

      {/* LOWER teeth row */}
      <div className="flex flex-row gap-20 max-w-full justify-center mb-2">
        {/* Lower LEFT (48-41) */}
        <div className="flex flex-row gap-10">
          {lowerLeftQuadrant.map(({ adult, milk }) => (
            <LowerCell key={adult} adult={adult} milk={milk} />
          ))}
        </div>
        {/* Lower RIGHT (31-38) */}
        <div className="flex flex-row gap-10">
          {lowerRightQuadrant.map(({ adult, milk }) => (
            <LowerCell key={adult} adult={adult} milk={milk} />
          ))}
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
