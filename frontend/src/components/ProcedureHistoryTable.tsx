import React, { useState } from "react";
import { useToothStore } from "../store/useToothStore";
import { Trash2, Search, FileText } from "lucide-react";

export default function ProcedureHistoryTable() {
  const {
    teethData,
    patients,
    patientId,
    removeProcedureFromTooth,
    updateProcedureNote,
  } = useToothStore();

  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [deleteItem, setDeleteItem] = useState<{
    tooth: string;
    idx: number;
    type: string;
    createdAt?: string;
    notes?: string;
  } | null>(null);

  if (!patientId) return null;
  const patient = patients.find((p) => p._id === patientId);

  // Convert primary tooth number to letter
  const convertPrimaryNumberToLetter = (num: number | string): string => {
    const map: Record<number, string> = {
      51: "A", 52: "B", 53: "C", 54: "D", 55: "E",
      61: "F", 62: "G", 63: "H", 64: "I", 65: "J",
      71: "K", 72: "L", 73: "M", 74: "N", 75: "O",
      81: "P", 82: "Q", 83: "R", 84: "S", 85: "T",
    };

    const toothNumber = typeof num === "string" ? parseInt(num, 10) : num;
    return map[toothNumber] || num.toString();
  };

  // Build full history list
  const history: {
    id: string;
    tooth: string;
    proc: any;
    idx: number;
  }[] = [];

  for (const tooth in teethData) {
    teethData[tooth].forEach((proc: any, idx: number) => {
      history.push({
        id: `${tooth}-${idx}`,
        tooth,
        proc,
        idx,
      });
    });
  }

  // Sort by date DESC
  history.sort((a, b) => {
    const dateA = a.proc.createdAt ? new Date(a.proc.createdAt).getTime() : 0;
    const dateB = b.proc.createdAt ? new Date(b.proc.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Apply search filter
  const filtered = history.filter(({ tooth, proc }) => {
    const search = filter.toLowerCase();
    return (
      tooth.includes(search) ||
      proc.type?.toLowerCase().includes(search) ||
      proc.notes?.toLowerCase().includes(search)
    );
  });

  const handleEnterSave = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    tooth: string,
    idx: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await updateProcedureNote(tooth, idx, comment);
      setEditingId(null);
    }
  };

  const confirmDelete = () => {
    if (deleteItem) {
      removeProcedureFromTooth(deleteItem.tooth, deleteItem.idx);
      setDeleteItem(null);
    }
  };

  return (
    <section className="mt-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Procedure History
        </h2>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md border border-gray-300">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by tooth, procedure, or notes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm w-56 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Dentist</th>
              <th className="px-4 py-2 text-left">Procedure</th>
              <th className="px-4 py-2 text-center">Tooth #</th>
              <th className="px-4 py-2 text-center">Date</th>
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No procedure history found.
                </td>
              </tr>
            ) : (
              filtered.map(({ id, tooth, proc, idx }, rowIndex) => {
                const canEdit =
                  new Date().getTime() -
                    new Date(proc.createdAt || new Date()).getTime() <=
                  24 * 60 * 60 * 1000;

                return (
                  <tr
                    key={id}
                    className={`${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2">{patient?.name}</td>
                    <td className="px-4 py-2">{proc.dentistName || "—"}</td>
                    <td className="px-4 py-2">
                      <span
                        className="px-2 py-1 rounded text-white text-xs font-semibold"
                        style={{ backgroundColor: proc.color }}
                      >
                        {proc.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      <span title={`FDI: ${tooth}`}>
                        {convertPrimaryNumberToLetter(tooth)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {proc.createdAt
                        ? new Date(proc.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    {/* Comment */}
                    <td className="px-4 py-2">
                      {editingId === id ? (
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          onKeyDown={(e) => handleEnterSave(e, tooth, idx)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:ring-1 focus:ring-blue-400"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">
                            {proc.notes || (
                              <span className="text-gray-400 italic">
                                No comment
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => {
                              if (canEdit) {
                                setEditingId(id);
                                setComment(proc.notes || "");
                              }
                            }}
                            disabled={!canEdit}
                            className={`${
                              canEdit
                                ? "text-blue-500 hover:text-blue-700"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              canEdit
                                ? "Edit comment"
                                : "Cannot edit after 24 hours"
                            }
                          >
                            <FileText size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                    {/* Delete */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => {
                          if (canEdit) {
                            setDeleteItem({
                              tooth,
                              idx,
                              type: proc.type,
                              createdAt: proc.createdAt,
                              notes: proc.notes,
                            });
                          }
                        }}
                        disabled={!canEdit}
                        className={`${
                          canEdit
                            ? "text-red-500 hover:text-red-700"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        title={
                          canEdit
                            ? "Delete procedure"
                            : "Cannot delete after 24 hours"
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setDeleteItem(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[380px]">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <Trash2 className="text-red-600 w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete procedure:{" "}
              <span className="font-bold text-red-500">{deleteItem.type}</span>?
            </p>
            {deleteItem.createdAt && (
              <p className="text-sm text-gray-500 mb-2">
                <strong>Date:</strong>{" "}
                {new Date(deleteItem.createdAt).toLocaleString()}
              </p>
            )}
            {deleteItem.notes && (
              <p className="text-sm text-gray-500">
                <strong>Notes:</strong> {deleteItem.notes}
              </p>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
