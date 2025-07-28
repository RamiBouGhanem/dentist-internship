import React from 'react';
import { useToothStore } from '../store/useToothStore';
import { X, FileText, CalendarDays, StickyNote } from 'lucide-react';

export default function ProcedureModal() {
  const {
    selectedProcedure,
    clearSelectedProcedure,
  } = useToothStore();

  if (!selectedProcedure) return null;

  const { proc, toothNumber } = selectedProcedure;
  const color = proc.color || '#2563eb'; // fallback blue if undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-md relative border-t-4" style={{ borderTopColor: color }}>
        {/* Close Button */}
        <button
          onClick={clearSelectedProcedure}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <FileText size={24} style={{ color }} />
          <h2 className="text-xl font-semibold" style={{ color }}>
            Procedure Details
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🦷 Tooth:</span>
            <span className="text-gray-900 font-medium text-base">{toothNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">💼 Procedure:</span>
            <span className="text-gray-900 font-medium">{proc.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-gray-500" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Date Added</div>
              <div className="text-gray-900 font-medium">
                {proc.createdAt ? new Date(proc.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <StickyNote size={18} className="text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-gray-500 text-xs uppercase">Notes</div>
              <div className="bg-gray-100 rounded-md p-3 whitespace-pre-wrap text-gray-800 font-normal border border-gray-200">
                {proc.notes || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
