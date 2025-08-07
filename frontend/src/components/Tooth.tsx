import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useToothStore } from "../store/useToothStore";
import { AlertTriangle } from "lucide-react";
import { validateProcedure, Procedure } from "../utils/procedureRules";

interface ToothProps {
  number: number;
}

export default function Tooth({ number }: ToothProps) {
  const {
    teethData,
    removeProcedureFromTooth,
    setSelectedProcedure,
    setDraftProcedure,
    showNoteModal,
    patients,
    patientId,
  } = useToothStore();

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const procedures: Procedure[] = teethData[number.toString()] || [];
  const dropRef = useRef<HTMLDivElement | null>(null);

  const patient = patients.find((p) => p._id === patientId);
  const dentitionType = patient?.dentitionType || "adult";

  const [{ isOver }, drop] = useDrop<Procedure, void, { isOver: boolean }>(
    () => ({
      accept: "procedure",
      drop: (item) => {
        const result = validateProcedure(
          procedures,
          item,
          dentitionType,
          number
        );
        if (!result.allowed) {
          setError(
            result.reason || `You cannot perform "${item.type}" on this tooth.`
          );
          return;
        }

        const draftResult = setDraftProcedure(item, number.toString());
        if (!draftResult.allowed) {
          setError(
            draftResult.reason ||
              `You cannot perform "${item.type}" on this tooth.`
          );
          return;
        }

        showNoteModal();
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    })
  );

  drop(dropRef);

  const handleDoubleRightClick = (event: React.MouseEvent, idx: number) => {
    event.preventDefault();
    setDeleteIndex(idx);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      removeProcedureFromTooth(number.toString(), deleteIndex);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => setDeleteIndex(null);

  const renderOverlay = (proc: Procedure, idx: number) => {
    const sharedProps = {
      key: `overlay-${idx}`,
      onClick: () => setSelectedProcedure(proc, number.toString()),
      onContextMenu: (e: React.MouseEvent) => handleDoubleRightClick(e, idx),
      style: { cursor: "pointer" },
    };

    switch (proc.type) {
      case "Endo":
        return (
          <g {...sharedProps}>
            <path
              d="M45 70 C35 75, 25 85, 28 100 C30 115, 38 128, 45 130 L45 70 Z"
              fill={proc.color}
              transform="scale(1.1) translate(0.5 -5)"
            />
            <path
              d="M55 70 C65 75, 75 85, 72 100 C70 115, 62 128, 55 130 L55 70 Z"
              fill={proc.color}
              transform="scale(1.1) translate(-0.5 -5)"
            />
          </g>
        );

      case "Pulpotomy":
        return (
          <circle {...sharedProps} cx="50" cy="60" r="6" fill={proc.color} />
        );

      case "Palpectomy":
        return (
          <path
            {...sharedProps}
            d="M50 60 L50 130"
            stroke={proc.color}
            strokeWidth={5}
          />
        );

      case "Apexification":
        return (
          <path
            {...sharedProps}
            d="M45 120 L50 130 L55 120 Z"
            fill={proc.color}
          />
        );

      case "Fiber Post":
        return (
          <rect
            {...sharedProps}
            x="47"
            y="80"
            width="6"
            height="30"
            fill={proc.color}
          />
        );

      case "Simple Extraction":
        return (
          <g {...sharedProps}>
            <line
              x1="30"
              y1="30"
              x2="70"
              y2="110"
              stroke={proc.color}
              strokeWidth={6}
            />
            <line
              x1="70"
              y1="30"
              x2="30"
              y2="110"
              stroke={proc.color}
              strokeWidth={6}
            />
          </g>
        );

      case "Surgical Extraction":
        return (
          <g {...sharedProps}>
            <line
              x1="30"
              y1="30"
              x2="70"
              y2="110"
              stroke={proc.color}
              strokeWidth={6}
            />
            <line
              x1="70"
              y1="30"
              x2="30"
              y2="110"
              stroke={proc.color}
              strokeWidth={6}
            />
            <path
              d="M20 20 Q50 10, 80 20"
              stroke={proc.color}
              strokeWidth={2}
              strokeDasharray="4"
              fill="none"
            />
          </g>
        );

      case "Crown Lengthening":
        return (
          <path
            {...sharedProps}
            d="M30 20 Q50 0, 70 20"
            stroke={proc.color}
            strokeWidth={4}
            fill="none"
          />
        );

      case "Gingivectomy":
        return (
          <path
            {...sharedProps}
            d="M20 25 Q30 20, 40 25 T60 25 T80 25"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Frenectomy":
        return (
          <line
            {...sharedProps}
            x1="50"
            y1="0"
            x2="50"
            y2="40"
            stroke={proc.color}
            strokeWidth={3}
          />
        );

      case "Apicoectomy":
        return (
          <path
            {...sharedProps}
            d="M45 120 L50 130 L55 120 Z"
            fill={proc.color}
          />
        );

      case "Implant":
        return (
          <path
            {...sharedProps}
            d="M50 70 L50 130"
            stroke={proc.color}
            strokeWidth={6}
            strokeDasharray="5,5"
          />
        );

      case "GBR":
        return (
          <path
            {...sharedProps}
            d="M30 120 Q50 100, 70 120"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Filling":
        return (
          <path
            {...sharedProps}
            d="M50 5 C35 10, 25 30, 35 40 C50 45, 65 40, 65 30 C65 20, 60 10, 50 5 Z"
            fill={proc.color}
            stroke="gray"
            strokeWidth={1}
            transform="scale(1.1) translate(0 -5)"
          />
        );

      case "Temporary":
        return (
          <path
            {...sharedProps}
            d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
            fill={proc.color}
            opacity="0.6"
            transform="scale(1.1) translate(0 -5)"
          />
        );

      case "Crown (Zirconia)":
      case "CCM":
        return (
          <path
            {...sharedProps}
            d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
            fill={proc.color}
            transform="scale(1.1) translate(0 -5)"
          />
        );

      case "Bridge":
        return (
          <line
            {...sharedProps}
            x1="0"
            y1="60"
            x2="100"
            y2="60"
            stroke={proc.color}
            strokeWidth={4}
          />
        );

      case "Veneer":
        return (
          <path
            {...sharedProps}
            d="M40 0 C20 10, 20 50, 40 60 C50 65, 50 5, 40 0 Z"
            fill={proc.color}
            transform="scale(1.1) translate(0 -5)"
          />
        );

      case "Inlay":
        return (
          <circle {...sharedProps} cx="50" cy="35" r="5" fill={proc.color} />
        );

      case "Onlay":
        return (
          <path
            {...sharedProps}
            d="M60 5 C70 10, 70 30, 60 40 C55 30, 55 10, 60 5 Z"
            fill={proc.color}
            transform="scale(1.1) translate(0 -5)"
          />
        );

      case "Post & Core":
        return (
          <g {...sharedProps}>
            <line
              x1="50"
              y1="70"
              x2="50"
              y2="120"
              stroke={proc.color}
              strokeWidth={4}
            />
            <circle cx="50" cy="70" r="6" fill={proc.color} />
          </g>
        );

      case "Laser Whitening":
        return (
          <g {...sharedProps}>
            <path
              d="M50 0 C30 10, 25 35, 35 55 C50 60, 65 55, 75 35 C75 15, 70 5, 50 0 Z"
              fill={proc.color}
              opacity="0.25"
              transform="scale(1.1) translate(0 -5)"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="30"
              stroke={proc.color}
              strokeWidth={2}
            />
            <line
              x1="45"
              y1="5"
              x2="55"
              y2="25"
              stroke={proc.color}
              strokeWidth={2}
            />
          </g>
        );

      case "Home Whitening":
        return (
          <ellipse
            {...sharedProps}
            cx="50"
            cy="40"
            rx="30"
            ry="12"
            fill={proc.color}
            opacity="0.2"
          />
        );

      case "Whitening Paste":
        return (
          <rect
            {...sharedProps}
            x="40"
            y="30"
            width="20"
            height="10"
            fill={proc.color}
            opacity="0.4"
            rx={3}
          />
        );

      case "Enamel Microabrasion":
        return (
          <g {...sharedProps}>
            <path
              d="M40 30 Q50 10, 60 30"
              stroke={proc.color}
              strokeWidth={3}
              fill="none"
            />
            <circle cx="45" cy="28" r="1.5" fill={proc.color} />
            <circle cx="55" cy="28" r="1.5" fill={proc.color} />
          </g>
        );

      case "Scaling and Root Planing":
        return (
          <path
            {...sharedProps}
            d="M35 75 Q50 85, 65 75 Q60 90, 40 90 Q45 100, 55 100"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Polishing":
        return (
          <path
            {...sharedProps}
            d="M40 20 Q50 10, 60 20 Q50 30, 40 20"
            fill={proc.color}
            opacity="0.3"
          />
        );

      case "Fluoride Application":
        return (
          <rect
            {...sharedProps}
            x="35"
            y="25"
            width="30"
            height="20"
            rx={6}
            fill={proc.color}
            opacity={0.2}
          />
        );

      case "Gingival Curettage":
        return (
          <path
            {...sharedProps}
            d="M25 70 Q50 80, 75 70"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Stainless Steel Crown":
        return (
          <path
            {...sharedProps}
            d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
            fill={proc.color}
            stroke="black"
            strokeWidth={1.5}
          />
        );

      case "Sealant":
        return (
          <path
            {...sharedProps}
            d="M40 30 C45 25, 55 25, 60 30 C55 35, 45 35, 40 30 Z"
            fill={proc.color}
            opacity={0.4}
          />
        );

      case "Pulpectomy":
        return (
          <g {...sharedProps}>
            <line
              x1="48"
              y1="70"
              x2="48"
              y2="130"
              stroke={proc.color}
              strokeWidth={2}
            />
            <line
              x1="52"
              y1="70"
              x2="52"
              y2="130"
              stroke={proc.color}
              strokeWidth={2}
            />
          </g>
        );

      case "Space Maintainer":
        return (
          <path
            {...sharedProps}
            d="M20 100 Q50 60, 80 100"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Fluoride Varnish":
        return (
          <path
            {...sharedProps}
            d="M35 25 Q50 10, 65 25 Q50 35, 35 25"
            fill={proc.color}
            opacity={0.3}
          />
        );

      case "Tooth Eruption Check":
        return (
          <line
            {...sharedProps}
            x1="45"
            y1="135"
            x2="55"
            y2="135"
            stroke={proc.color}
            strokeDasharray="3,3"
            strokeWidth={2}
          />
        );

      case "Oral Hygiene Instruction":
        return (
          <circle
            {...sharedProps}
            cx="50"
            cy="10"
            r="6"
            fill={proc.color}
            stroke="black"
            strokeWidth={1}
          />
        );

      case "Early Caries Detection":
        return (
          <polygon
            {...sharedProps}
            points="50,20 45,30 55,30"
            fill={proc.color}
          />
        );

      case "Topical Anesthesia":
        return (
          <ellipse
            {...sharedProps}
            cx="50"
            cy="105"
            rx="12"
            ry="8"
            fill={proc.color}
            opacity={0.5}
          />
        );

      case "Rubber Dam Placement":
        return (
          <rect
            {...sharedProps}
            x="30"
            y="5"
            width="40"
            height="70"
            rx="12"
            stroke={proc.color}
            strokeWidth={3}
            fill="none"
          />
        );

      case "Ortho Band":
        return (
          <path
            {...sharedProps}
            d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
            fill="none"
            stroke={proc.color}
            strokeWidth={3}
          />
        );

      case "Missing":
        return (
          <line
            {...sharedProps}
            x1="0"
            y1="0"
            x2="100"
            y2="140"
            stroke={proc.color}
            strokeWidth={4}
          />
        );

      default:
        return null;
    }
  };

  const isMilkTooth = number >= 51 && number <= 85;

  const milkToothLabels: Record<number, string> = {
    51: "A",
    52: "B",
    53: "C",
    54: "D",
    55: "E",
    61: "F",
    62: "G",
    63: "H",
    64: "I",
    65: "J",
    71: "K",
    72: "L",
    73: "M",
    74: "N",
    75: "O",
    81: "P",
    82: "Q",
    83: "R",
    84: "S",
    85: "T",
  };

  return (
  <>
    <div
      ref={dropRef}
      className={`w-16 h-24 flex flex-col items-center text-xs font-semibold text-center relative transition-all ${
        isOver
          ? "scale-110 shadow-xl ring-2 ring-blue-400 bg-blue-50"
          : "bg-transparent"
      } ${deleteIndex !== null || error ? "pointer-events-none" : ""}`}
    >
      {/* Tooth number: blue for milk, gray for adult */}
      <div className={isMilkTooth ? "text-blue-600" : "text-gray-800"}>
        {isMilkTooth ? milkToothLabels[number] : number}
      </div>

      <svg viewBox="0 0 100 140" className="w-14 h-20">
        <defs>
          <linearGradient id="toothCrownGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
            <stop offset="100%" stopColor="hsl(0, 0%, 90%)" />
          </linearGradient>
          <linearGradient id="toothRootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(40, 60%, 90%)" />
            <stop offset="100%" stopColor="hsl(40, 40%, 70%)" />
          </linearGradient>
        </defs>
        <g transform="translate(100 140) scale(-1 -1) translate(0 10)">
          {/* Base tooth */}
          <path
            d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
            fill="url(#toothCrownGradient)"
          />
          <path
            d="M45 70 C35 75, 25 85, 28 100 C30 115, 38 128, 45 130 L45 70 Z"
            fill="url(#toothRootGradient)"
          />
          <path
            d="M55 70 C65 75, 75 85, 72 100 C70 115, 62 128, 55 130 L55 70 Z"
            fill="url(#toothRootGradient)"
          />
          {procedures.map((p, i) => renderOverlay(p, i))}
        </g>
      </svg>
    </div>

    {/* Delete Modal */}
  {deleteIndex !== null && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={cancelDelete}
    />

    {/* Modal box */}
    <div className="relative z-[10000] bg-white rounded-xl shadow-2xl p-6 w-[400px]">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-red-600 w-6 h-6 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        Are you sure you want to remove{" "}
        <span className="font-bold text-red-500">
          {procedures[deleteIndex].type}
        </span>
        ?
      </p>
      <div className="flex justify-end gap-2">
        <button onClick={cancelDelete} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    {/* Error Modal */}
    {error && (
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div
          className="absolute inset-0 bg-black bg-opacity-40 z-[9998]"
          onClick={() => setError(null)}
        />
        <div className="relative z-[9999] bg-white rounded-xl shadow-2xl p-6 w-[400px]">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-600 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Procedure Not Allowed
            </h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)};
