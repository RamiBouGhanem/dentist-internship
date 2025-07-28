// components/ProcedureHistoryDrawer.tsx
import React, { useState } from 'react';
import { useToothStore } from '../store/useToothStore';
import { Clock, FileText, Search } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProcedureHistoryDrawer({ open, onClose }: Props) {
  const { teethData, patients, patientId } = useToothStore();
  const [filter, setFilter] = useState('');

  if (!patientId) return null;

  const patient = patients.find((p) => p._id === patientId);
  const history: { tooth: string; proc: any }[] = [];

  for (const tooth in teethData) {
    for (const proc of teethData[tooth]) {
      history.push({ tooth, proc });
    }
  }

  // Filter history
  const filtered = history.filter(({ tooth, proc }) => {
    const search = filter.toLowerCase();
    return (
      tooth.includes(search) ||
      proc.type?.toLowerCase().includes(search) ||
      proc.notes?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity z-40 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" /> Procedure History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Patient Info & Filter */}
        <div className="px-6 py-3 border-b flex items-center gap-3">
          <div className="text-sm text-gray-600 font-medium">
            Patient: <strong>{patient?.name}</strong>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by Tooth Number..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* History Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-130px)] space-y-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">
              No matching procedures found.
            </p>
          ) : (
            filtered.map(({ tooth, proc }, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">
                    Tooth #{tooth}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: proc.color, color: 'white' }}
                  >
                    {proc.type}
                  </span>
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                  <Clock size={14} />
                  {proc.createdAt
                    ? new Date(proc.createdAt).toLocaleString()
                    : '—'}
                </div>

                {proc.notes && (
                  <div className="mt-2 flex items-start gap-2 text-sm">
                    <FileText size={16} className="text-gray-400 mt-1" />
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-gray-700 whitespace-pre-wrap w-full">
                      {proc.notes}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
