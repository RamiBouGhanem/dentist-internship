import React from "react";
import { useDrop } from "react-dnd";
import { useToothStore } from "../store/useToothStore";

export default function Tooth({ number }) {
  const {
    teethData,
    addProcedureToTooth,
    removeProcedureFromTooth,
  } = useToothStore();

  const procedures = teethData[number] || [];

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "procedure",
    drop: (item) => addProcedureToTooth(number, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDoubleRightClick = (event, idx) => {
    if (event.button === 2) {
      event.preventDefault();
      removeProcedureFromTooth(number, idx);
    }
  };

  const renderOverlay = (proc, idx) => {
    const sharedProps = {
      key: `overlay-${idx}`,
      onContextMenu: (e) => handleDoubleRightClick(e, idx),
      style: { cursor: "pointer" },
    };

    switch (proc.type) {
      case "Endo":
        return (
          <g {...sharedProps}>
            <path d="M45 70 C35 75, 25 85, 28 100 C30 115, 38 128, 45 130 L45 70 Z" fill={proc.color} transform="scale(1.1) translate(0.5 -5)" />
            <path d="M55 70 C65 75, 75 85, 72 100 C70 115, 62 128, 55 130 L55 70 Z" fill={proc.color} transform="scale(1.1) translate(-0.5 -5)" />
          </g>
        );
      case "Filling":
        return (
          <path {...sharedProps} d="M50 5 C35 10, 25 30, 35 40 C50 45, 65 40, 65 30 C65 20, 60 10, 50 5 Z" fill={proc.color} stroke="gray" strokeWidth={1} transform="scale(1.1) translate(0 -5)" />
        );
      case "Extraction":
        return (
          <line {...sharedProps} x1="20" y1="20" x2="80" y2="120" stroke={proc.color} strokeWidth={6} />
        );
      case "Implant":
        return (
          <path {...sharedProps} d="M50 70 L50 130" stroke={proc.color} strokeWidth={6} strokeDasharray="5,5" />
        );
      case "Crown (Zirconia)":
      case "CCM":
      case "Temporary":
        return (
          <path {...sharedProps} d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z" fill={proc.color} transform="scale(1.1) translate(0 -5)" />
        );
      case "Bridge":
        return (
          <line {...sharedProps} x1="0" y1="60" x2="100" y2="60" stroke={proc.color} strokeWidth={4} />
        );
      case "Veneer":
        return (
          <path {...sharedProps} d="M40 0 C20 10, 20 50, 40 60 C50 65, 50 5, 40 0 Z" fill={proc.color} transform="scale(1.1) translate(0 -5)" />
        );
      case "Inlay":
        return (
          <circle {...sharedProps} cx="50" cy="35" r="5" fill={proc.color} />
        );
      case "Onlay":
        return (
          <path {...sharedProps} d="M60 5 C70 10, 70 30, 60 40 C55 30, 55 10, 60 5 Z" fill={proc.color} transform="scale(1.1) translate(0 -5)" />
        );
      case "Pulpotomy":
        return (
          <circle {...sharedProps} cx="50" cy="70" r="6" fill={proc.color} />
        );
      case "Sealant":
        return (
          <path {...sharedProps} d="M50 10 C40 15, 30 25, 35 35 C50 40, 65 35, 65 25 C65 15, 60 10, 50 10 Z" fill={proc.color} opacity="0.6" transform="scale(1.1) translate(0 -5)" />
        );
      case "Ortho Band":
        return (
          <path {...sharedProps} d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z" fill="none" stroke={proc.color} strokeWidth={3} transform="scale(1.1) translate(0 -5)" />
        );
      case "Missing":
        return (
          <line {...sharedProps} x1="0" y1="0" x2="100" y2="140" stroke={proc.color} strokeWidth={4} />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={drop}
      className={`w-16 h-24 flex flex-col items-center text-xs font-semibold text-center overflow-hidden relative bg-transparent ${
        isOver ? "bg-gray-200" : ""
      }`}
    >
      <div>{number}</div>

      <div className="relative w-14 h-20 group">
        <svg viewBox="0 0 100 140" className="w-full h-full">
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
            <path d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z" fill="url(#toothCrownGradient)" stroke="none" transform="scale(1.1) translate(0 -5)" />
            <path d="M45 70 C35 75, 25 85, 28 100 C30 115, 38 128, 45 130 L45 70 Z" fill="url(#toothRootGradient)" stroke="none" transform="scale(1.1) translate(0.5 -5)" />
            <path d="M55 70 C65 75, 75 85, 72 100 C70 115, 62 128, 55 130 L55 70 Z" fill="url(#toothRootGradient)" stroke="none" transform="scale(1.1) translate(-0.5 -5)" />
            {procedures.map((p, i) => renderOverlay(p, i))}
          </g>
        </svg>
      </div>
    </div>
  );
}
