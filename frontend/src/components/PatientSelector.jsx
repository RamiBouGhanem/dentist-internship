import React, { useEffect, useState } from 'react';
import { useToothStore } from '../store/useToothStore';

export default function PatientSelector() {
  const patients = useToothStore((state) => state.patients);
  const fetchPatients = useToothStore((state) => state.fetchPatients);
  const setPatientId = useToothStore((state) => state.setPatientId);
  const loadPatientData = useToothStore((state) => state.loadPatientData);

  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [hasSelected, setHasSelected] = useState(false); 

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      setHasSelected(false);
      return;
    }

    const results = patients.filter((p) =>
      p.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFiltered(results);
    setHasSelected(false);
  }, [query, patients]);

  const handleSelect = async (patient) => {
    setQuery(patient.name);
    setPatientId(patient._id);
    await loadPatientData();
    setFiltered([]);
    setHasSelected(true);
  };

  return (
    <div className="mb-6 relative max-w-xl mx-auto text-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search and select patient..."
        className="p-2 w-full border rounded shadow-sm"
      />

      {filtered.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-40 overflow-auto">
          {filtered.map((p) => (
            <li
              key={p._id}
              onClick={() => handleSelect(p)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
            >
              {p.name} ({p.gender}, {p.age ?? 'N/A'})
            </li>
          ))}
        </ul>
      )}

      {query && filtered.length === 0 && !hasSelected && (
        <p className="mt-2 text-sm text-gray-500 italic">No match found.</p>
      )}
    </div>
  );
}
