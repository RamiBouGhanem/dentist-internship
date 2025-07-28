import React, { useEffect, useRef, useState } from 'react';
import { useToothStore } from '../store/useToothStore';
import { ClipboardEdit, X } from 'lucide-react';

export default function NoteInputModal() {
  const {
    draftProcedure,
    noteModalVisible,
    saveNoteAndAddProcedure,
    hideNoteModal,
  } = useToothStore();

  const [note, setNote] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (noteModalVisible) {
      setNote('');
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [noteModalVisible]);

  if (!noteModalVisible || !draftProcedure) return null;

  const { toothNumber, proc } = draftProcedure;
  const color = proc.color || '#3b82f6'; // fallback to blue if undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-md relative"
        style={{ borderTop: `5px solid ${color}` }}
      >
        {/* Close Button */}
        <button
          onClick={hideNoteModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <ClipboardEdit size={24} style={{ color }} />
          <h2 className="text-xl font-semibold" style={{ color }}>
            Add Notes for Procedure
          </h2>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>
            <strong>Tooth:</strong> {toothNumber}
          </p>
          <p>
            <strong>Procedure:</strong> {proc.type}
          </p>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
          style={{ borderColor: color, boxShadow: `inset 0 0 0 1px ${color}` }}
          placeholder="Enter notes or observations here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={hideNoteModal}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => saveNoteAndAddProcedure(note)}
            className="px-5 py-2 text-white font-medium rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: color }}
          >
            Save & Add
          </button>
        </div>
      </div>
    </div>
  );
}
