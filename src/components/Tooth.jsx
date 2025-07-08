import React from "react";
import { useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";
import { useToothStore } from "../store/useToothStore";

export default function Tooth({ number }) {
  const { teethData, addProcedureToTooth, removeProcedureFromTooth } =
    useToothStore();
  const procedures = teethData[number] || [];

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "procedure",
    drop: (item) => addProcedureToTooth(number, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Check for specific procedures to apply specialized coloring
  const hasEndo = procedures.some((p) => p.type === 'Endo');
  const fillingProcedure = procedures.find((p) => p.type === 'Filling'); // Find the filling procedure specifically

  // Define a professional color for the filling
  const professionalFillingColor = '#A9A9A9'; // A common light grey for composite fillings

  return (
    <div
      ref={drop}
      className={`w-16 h-24 flex flex-col items-center text-xs font-semibold text-center overflow-hidden relative bg-transparent ${
        isOver ? "bg-gray-200" : ""
      }`}
    >
      <div>{number}</div>

      <div className="relative w-14 h-20 group">
        {/* SVG Tooth Shape */}
        <svg viewBox="0 0 100 140" className="w-full h-full">
          {/* Define gradients for realistic colors and 3D effect */}
          <defs>
            {/* Gradient for the main Crown (Enamel/Dentin) - Whiter, softer */}
            <linearGradient id="toothCrownGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
              <stop offset="20%" stopColor="hsl(0, 0%, 98%)" />
              <stop offset="60%" stopColor="hsl(0, 0%, 95%)" />
              <stop offset="100%" stopColor="hsl(0, 0%, 90%)" />
            </linearGradient>

            {/* Gradient for the Roots (Cementum) - Beige, softer transitions */}
            <linearGradient id="toothRootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(40, 60%, 90%)" />
              <stop offset="50%" stopColor="hsl(40, 50%, 80%)" />
              <stop offset="100%" stopColor="hsl(40, 40%, 70%)" />
            </linearGradient>

            {/* Subtle radial highlight for a glossy occlusal surface */}
            <radialGradient id="occlusalGlare" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Group to apply horizontal and vertical flip transforms and overall vertical shift */}
          <g transform="translate(100 140) scale(-1 -1) translate(0 10)">
            {/* The Crown - Always use its default gradient as filling is now a separate overlay */}
            <path
              id="tooth-crown"
              d="M50 0 C25 5, 15 25, 20 45 C25 60, 35 70, 50 70 C65 70, 75 60, 80 45 C85 25, 75 5, 50 0 Z"
              fill="url(#toothCrownGradient)" // Crown remains natural color
              stroke="none"
              strokeWidth={0}
              transform="scale(1.1) translate(0 -5)"
            />

            {/* The Left Root - Conditional fill for Endo */}
            <path
              id="tooth-root-left"
              d="M45 70 C35 75, 25 85, 28 100 C30 115, 38 128, 45 130 L45 70 Z"
              fill={hasEndo ? 'red' : 'url(#toothRootGradient)'}
              stroke="none"
              strokeWidth={0}
              transform="scale(1.1) translate(0.5 -5)"
            />

            {/* The Right Root - Conditional fill for Endo */}
            <path
              id="tooth-root-right"
              d="M55 70 C65 75, 75 85, 72 100 C70 115, 62 128, 55 130 L55 70 Z"
              fill={hasEndo ? 'red' : 'url(#toothRootGradient)'}
              stroke="none"
              strokeWidth={0}
              transform="scale(1.1) translate(-0.5 -5)"
            />

            {/* A subtle highlight on the crown surface to enhance 3D realism */}
            <path
              id="occlusal-highlight-area"
              d="M50 10 C40 15, 30 25, 35 35 C50 40, 65 35, 65 25 C65 15, 60 10, 50 10 Z"
              fill="url(#occlusalGlare)"
              stroke="none"
              transform="scale(1.1) translate(0 -5)"
            />

            {/* The Top Procedure Area (now specifically for Filling) */}
            <path
              id="procedure-top"
              d="M50 5 C35 10, 25 30, 35 40 C50 45, 65 40, 65 30 C65 20, 60 10, 50 5 Z"
              fill={fillingProcedure ? professionalFillingColor : 'transparent'} // Use professional color for filling
              stroke="gray"
              strokeWidth={1}
              transform="scale(1.1) translate(0 -5)"
            />
          </g>
        </svg>

        {/* Existing small circle procedure overlays */}
        {procedures.map((p, idx) => {
          // If you want to prevent a small dot from appearing for 'Filling'
          // because it now colors the SVG path, uncomment the line below:
          // if (p.type === 'Filling') return null;

          const flippedX = (100 - (p.x ?? 50)) + "%";
          const flippedY = ((140 - (p.y ?? 70)) / 140) * 100 + "%";

          return (
            <div
              key={idx}
              className="absolute"
              style={{
                left: flippedX,
                top: flippedY,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative group">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                  title={p.type}
                ></div>
                <button
                  className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full text-[10px] hidden group-hover:block"
                  onClick={() => removeProcedureFromTooth(number, idx)}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}