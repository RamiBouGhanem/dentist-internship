import React, { useState, useEffect } from "react";
import ProcedureItem from "./ProcedureItem";
import { procedureCategories } from "../constants/procedureGroups";
import { useToothStore } from "../store/useToothStore";

export default function Toolbar() {
  const patients = useToothStore((state) => state.patients);
  const patientId = useToothStore((state) => state.patientId);
  const patient = patients.find((p) => p._id === patientId);
  const dentitionType = patient?.dentitionType || "adult";

  const pedoCategory = procedureCategories.find(
    (cat) => cat.title === "Pediatric (Pedo)"
  );

  const filteredCategories =
    dentitionType === "child" ? (pedoCategory ? [pedoCategory] : []) : procedureCategories;

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  useEffect(() => {
    // Reset category index when switching patient type
    setSelectedCategoryIndex(0);
  }, [dentitionType]);

  const selectedCategory = filteredCategories[selectedCategoryIndex];

  if (!selectedCategory) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dropdown filter — hidden for child patients */}
      {dentitionType !== "child" && (
        <div className="flex justify-center mb-4">
          <select
            value={selectedCategoryIndex}
            onChange={(e) => setSelectedCategoryIndex(parseInt(e.target.value))}
            className="border px-4 py-2 rounded text-sm shadow-sm bg-white"
          >
            {filteredCategories.map((cat, index) => (
              <option key={cat.title} value={index}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Category Display */}
      <div className="w-full">
        <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">
          {selectedCategory.title}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {selectedCategory.procedures.map((proc) => (
            <ProcedureItem key={proc.type} type={proc.type} color={proc.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
