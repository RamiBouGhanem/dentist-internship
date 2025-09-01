import React, { useRef } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

interface ProcedureItemProps {
  type: string;
  color: string;
  onClick?: () => void; // allow selecting by click
}

/**
 * A compact, touch-friendly “chip”:
 * - Circular color swatch (drag handle)
 * - Label underneath
 * - Hover tooltip for long names
 */
export default function ProcedureItem({ type, color, onClick }: ProcedureItemProps) {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "procedure",
    item: { type, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // SVG data URL preview (drag ghost)
  const previewSrc = `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
      <circle cx='32' cy='32' r='28' fill='${encodeURIComponent(color)}' />
      <text x='32' y='38' font-size='18' text-anchor='middle' fill='white' font-family='Arial'>${
        type[0] ?? ""
      }</text>
    </svg>
  `;

  return (
    <>
      <DragPreviewImage connect={preview} src={previewSrc} />
      <div className="flex flex-col items-center text-center select-none">
        <div
          ref={(node) => {
            if (node) drag(node);
            dragRef.current = node;
          }}
          onClick={onClick}
          className={[
            "relative group w-14 h-14 md:w-16 md:h-16 rounded-full",
            "flex items-center justify-center text-white font-bold",
            "cursor-pointer shadow-sm border border-black/5",
            "transition active:scale-95",
          ].join(" ")}
          style={{ backgroundColor: color, opacity: isDragging ? 0.5 : 1 }}
          title={type}
        >
          {(type?.[0] || "").toUpperCase()}

          {/* Subtle tooltip on hover for desktops */}
          <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-10">
            {type}
          </div>
        </div>

        {/* Label under the circle */}
        <div className="mt-1 w-full px-1">
          <span className="block text-[11px] md:text-xs text-gray-700 truncate">
            {type}
          </span>
        </div>
      </div>
    </>
  );
}
