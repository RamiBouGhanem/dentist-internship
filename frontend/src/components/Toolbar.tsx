import React, { useState, useEffect, useMemo } from "react";
import ProcedureItem from "./ProcedureItem";
import { procedureCategories } from "../constants/procedureGroups";
import { useToothStore } from "../store/useToothStore";
import { X, Search } from "lucide-react";

export default function Toolbar() {
  // ---- hooks must always run in the same order ----
  const patients = useToothStore((s) => s.patients);
  const patientId = useToothStore((s) => s.patientId);
  const selectedForAdd = useToothStore((s) => s.selectedProcedureForAdd);
  const clearSelectedForAdd = useToothStore((s) => s.clearSelectedForAdd);

  const patient = patients.find((p) => p._id === patientId);
  const dentitionType = patient?.dentitionType || "adult";

  const pedoCategory = procedureCategories.find((cat) => cat.title === "Pediatric (Pedo)");
  const availableCategories =
    dentitionType === "child" ? (pedoCategory ? [pedoCategory] : []) : procedureCategories;

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSelectedCategoryIndex(0);
    setQuery("");
  }, [dentitionType]);

  const selectedCategory = availableCategories[selectedCategoryIndex] ?? null;

  const filteredProcedures = useMemo(() => {
    const list = selectedCategory?.procedures ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.type.toLowerCase().includes(q));
  }, [query, selectedCategory]);

  // ---- render ----
  return (
    <aside className="w-72 shrink-0">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Procedures</h2>
            <div className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
                ${dentitionType === "child"
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"}`}
                title={`Dentition: ${dentitionType}`}
              >
                {dentitionType === "child" ? "Pediatric" : "Adult"}
              </span>
            </div>
          </div>

          {selectedForAdd && (
            <button
              onClick={clearSelectedForAdd}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
              title="Clear selected procedure"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Category selector (hidden for pedo) */}
        {dentitionType !== "child" && (
          <div className="mb-3">
            <label className="block text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategoryIndex}
              onChange={(e) => setSelectedCategoryIndex(parseInt(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableCategories.map((cat, index) => (
                <option key={cat.title} value={index}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search
        <div className="mb-3 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search procedures…"
            aria-label="Search procedures"
            className="w-full border border-gray-300 pl-9 pr-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div> */}

        {/* Selected hint */}
        {selectedForAdd && (
          <div className="mb-2 text-[12px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-1">
            <span className="font-medium">{selectedForAdd.type}</span> selected — click a tooth to apply.
          </div>
        )}

        {/* List / empty state */}
        <h3 className="text-xs font-medium text-gray-500 mb-2">
          {selectedCategory ? selectedCategory.title : "No category"}
          <span className="ml-1 text-gray-400">({filteredProcedures.length})</span>
        </h3>

        <div className="flex flex-col gap-2 max-h-[70vh] overflow-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filteredProcedures.length > 0 ? (
            filteredProcedures.map((proc) => (
              <ProcedureItem key={proc.type} type={proc.type} color={proc.color} />
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 py-4 border border-dashed rounded-md">
              {selectedCategory
                ? `No procedures match “${query}”.`
                : "No categories available."}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
