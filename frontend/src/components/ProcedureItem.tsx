import React, { useRef } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

interface ProcedureItemProps {
  type: string;
  color: string;
}

export default function ProcedureItem({ type, color }: ProcedureItemProps) {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "procedure",
    item: { type, color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // SVG data URL preview with the color + label
  const previewSrc = `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
      <circle cx='32' cy='32' r='28' fill='${encodeURIComponent(color)}' />
      <text x='32' y='38' font-size='18' text-anchor='middle' fill='white' font-family='Arial'>${
        type[0]
      }</text>
    </svg>
  `;

  return (
    <>
      <DragPreviewImage
        key={`${type}-${color}`}
        connect={preview}
        src={previewSrc}
      />
      <div
        ref={(node) => {
          if (node) drag(node);
          dragRef.current = node;
        }}
        className="relative group w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-md transition"
        style={{ backgroundColor: color, opacity: isDragging ? 0.5 : 1 }}
      >
        {type[0]}

        {/* Tooltip on hover */}
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-10">
          {type}
        </div>
      </div>
    </>
  );
}
