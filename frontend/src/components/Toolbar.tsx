import React, { useEffect, useMemo, useState } from "react";
import { procedureCategories } from "../constants/procedureGroups";
import { useToothStore } from "../store/useToothStore";

import {
  Syringe,
  Scissors,
  Wrench,
  Sparkles,
  Leaf,
  Users,
  Ruler,
  MoreHorizontal,
  Circle,
  CheckCircle2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Category title -> icon + color styling */
const CAT_STYLES: Record<
  string,
  {
    underlineClass: string;     // small pill under label
    icon: LucideIcon;           // icon component
    textClass: string;          // text/icon color
    ringClass: string;          // focus ring color
    hoverTintClass: string;     // light hover bg
    borderClass: string;        // border color accent
  }
> = {
  "Endodontic (Root Canal Treatments)": {
    underlineClass: "bg-emerald-500",
    icon: Syringe,
    textClass: "text-emerald-700",
    ringClass: "focus-visible:ring-emerald-500",
    hoverTintClass: "hover:bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  "Surgical Procedures": {
    underlineClass: "bg-blue-500",
    icon: Scissors,
    textClass: "text-blue-700",
    ringClass: "focus-visible:ring-blue-500",
    hoverTintClass: "hover:bg-blue-50",
    borderClass: "border-blue-200",
  },
  "Restorative & Prosthodontics": {
    underlineClass: "bg-violet-500",
    icon: Wrench,
    textClass: "text-violet-700",
    ringClass: "focus-visible:ring-violet-500",
    hoverTintClass: "hover:bg-violet-50",
    borderClass: "border-violet-200",
  },
  "Cosmetic & Whitening": {
    underlineClass: "bg-pink-400",
    icon: Sparkles,
    textClass: "text-pink-700",
    ringClass: "focus-visible:ring-pink-500",
    hoverTintClass: "hover:bg-pink-50",
    borderClass: "border-pink-200",
  },
  "Periodontal Treatments": {
    underlineClass: "bg-teal-500",
    icon: Leaf,
    textClass: "text-teal-700",
    ringClass: "focus-visible:ring-teal-500",
    hoverTintClass: "hover:bg-teal-50",
    borderClass: "border-teal-200",
  },
  "Pediatric (Pedo)": {
    underlineClass: "bg-sky-600",
    icon: Users,
    textClass: "text-sky-700",
    ringClass: "focus-visible:ring-sky-500",
    hoverTintClass: "hover:bg-sky-50",
    borderClass: "border-sky-200",
  },
  Orthodontics: {
    underlineClass: "bg-red-400",
    icon: Ruler,
    textClass: "text-red-700",
    ringClass: "focus-visible:ring-red-500",
    hoverTintClass: "hover:bg-red-50",
    borderClass: "border-red-200",
  },
  Miscellaneous: {
    underlineClass: "bg-slate-500",
    icon: MoreHorizontal,
    textClass: "text-slate-700",
    ringClass: "focus-visible:ring-slate-500",
    hoverTintClass: "hover:bg-slate-50",
    borderClass: "border-slate-200",
  },
};

export default function Toolbar() {
  // Patient lookup
  const patients = useToothStore((s) => s.patients);
  const patientId = useToothStore((s) => s.patientId);
  const patient = useMemo(
    () => patients.find((p) => p._id === patientId),
    [patients, patientId]
  );

  // Store API
  const selectProcedureForAdd = useToothStore((s) => s.selectProcedureForAdd);
  const clearSelectedForAdd = useToothStore((s) => s.clearSelectedForAdd);
  const selectedProcedureForAdd = useToothStore((s) => s.selectedProcedureForAdd);

  const categories = procedureCategories ?? [];
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);

  // Reset UI & clear selection on patient change
  useEffect(() => {
    setSelectedCategoryIndex(-1);
    clearSelectedForAdd();
  }, [patientId, clearSelectedForAdd]);

  // ESC clears selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelectedForAdd();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearSelectedForAdd]);

  if (!categories.length) {
    return (
      <div className="w-full px-4 py-6">
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
          No procedure categories found. Make sure{" "}
          <code className="mx-1 rounded bg-gray-100 px-1 py-0.5">
            constants/procedureGroups.ts
          </code>{" "}
          exports <code>procedureCategories</code>.
        </div>
      </div>
    );
  }

  const handleClickCategory = (idx: number) =>
    setSelectedCategoryIndex((prev) => (prev === idx ? -1 : idx));

  const armProcedure = (type: string, color: string) =>
    selectProcedureForAdd({ type, color });

  const clearArmed = () => clearSelectedForAdd();

  const isArmed = (type: string) =>
    !!selectedProcedureForAdd && selectedProcedureForAdd.type === type;

  const selectedCategory =
    selectedCategoryIndex >= 0 ? categories[selectedCategoryIndex] : undefined;

  return (
    <div className="w-full">
      {/* categories row */}
      <div
        className="
          w-full rounded-xl overflow-hidden border
          border-gray-200
          bg-gradient-to-b from-white to-gray-50
          "
      >
        <div
          className="flex w-full items-stretch"
          role="tablist"
          aria-label="Procedure categories"
        >
          {categories.map((cat, idx) => {
            const isActive = idx === selectedCategoryIndex;
            const style =
              CAT_STYLES[cat.title] ||
              {
                underlineClass: "bg-gray-300",
                icon: Circle,
                textClass: "text-gray-700",
                ringClass: "focus-visible:ring-gray-500",
                hoverTintClass: "hover:bg-gray-50",
                borderClass: "border-gray-200",
              };
            const Icon = style.icon;

            return (
              <button
                key={cat.title}
                role="tab"
                aria-selected={isActive}
                aria-controls={`category-panel-${idx}`}
                id={`category-tab-${idx}`}
                onClick={() => handleClickCategory(idx)}
                title={cat.title}
                className={[
                  "flex-1 min-w-0",
                  "flex flex-col items-center justify-center gap-1",
                  "px-2 sm:px-3 py-3 border-r last:border-r-0",
                  style.borderClass,
                  isActive
                    ? `bg-white font-semibold text-gray-900 shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.04)]`
                    : `text-gray-700 ${style.hoverTintClass}`,
                  "focus:outline-none",
                  style.ringClass,
                  "focus-visible:ring-2",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "w-5 h-5 transition-colors",
                    isActive ? style.textClass : "text-gray-500",
                  ].join(" ")}
                />
                <span className="text-[11px] md:text-xs text-center truncate w-full">
                  {cat.title}
                </span>
                <span
                  className={[
                    "mt-1 h-1.5 w-8 rounded-full",
                    style.underlineClass,
                    isActive ? "opacity-100" : "opacity-40",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* procedures list */}
      {selectedCategory && (
        <div
          id={`category-panel-${selectedCategoryIndex}`}
          role="tabpanel"
          aria-labelledby={`category-tab-${selectedCategoryIndex}`}
          className="mt-4 md:mt-5"
        >
          <div
            className="
              rounded-xl border border-gray-200
              bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60
              shadow-sm
            "
          >
            <div className="px-4 py-3 md:py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-b from-gray-50 to-white">
              <h3 className="text-sm md:text-base font-semibold text-gray-800">
                {selectedCategory.title}
              </h3>
              {selectedProcedureForAdd && (
                <button
                  onClick={clearArmed}
                  className="
                    text-xs flex items-center gap-1 text-indigo-700
                    bg-indigo-50/80 hover:bg-indigo-100
                    border border-indigo-200 rounded
                    px-2.5 py-1.5
                  "
                  title="Clear selection (Esc)"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>

            {selectedCategory.procedures?.length ? (
              <div className="p-3 md:p-4 grid gap-2 sm:gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {selectedCategory.procedures.map((proc) => {
                  const armed = isArmed(proc.type);
                  return (
                    <button
                      key={`${selectedCategory.title}-${proc.type}`}
                      type="button"
                      onClick={() => armProcedure(proc.type, proc.color)}
                      className={[
                        "group relative flex items-center gap-2",
                        "px-2.5 py-2 rounded-md border text-sm transition",
                        armed
                          ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200"
                          : "border-gray-200 hover:border-gray-300",
                        "text-gray-800",
                      ].join(" ")}
                      title={`Select: ${proc.type}`}
                      style={{
                        // subtle left color spine + very light tint on hover
                        backgroundImage:
                          "linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                      }}
                    >
                      {/* color spine */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 h-full w-1.5 rounded-l-md"
                        style={{ backgroundColor: proc.color }}
                      />
                      {/* color dot */}
                      <span
                        aria-hidden
                        className="inline-block w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: proc.color }}
                      />
                      <span className="truncate">{proc.type}</span>
                      {armed && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto" />
                      )}
                      {/* hover tint based on the procedure color */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: hexToRgba(proc.color, 0.06) }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">
                No procedures defined for{" "}
                <strong>{selectedCategory.title}</strong>.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----- helpers ----- */

/** Convert #RRGGBB or #RGB to rgba() with given alpha */
function hexToRgba(hex: string, alpha = 1) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  const bigint = parseInt(h || "000000", 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
