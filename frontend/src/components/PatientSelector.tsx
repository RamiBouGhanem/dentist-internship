import React, { useEffect, useState } from 'react';
import { useToothStore } from '../store/useToothStore';
import { useQuery } from '@tanstack/react-query';

interface Patient {
  _id: string;
  name: string;
  gender: string;
  age?: number;
}

export default function PatientSelector() {
  const patients = useToothStore((state) => state.patients);
  const fetchPatients = useToothStore((state) => state.fetchPatients);
  const setPatientId = useToothStore((state) => state.setPatientId);
  const loadPatientData = useToothStore((state) => state.loadPatientData);

  const [query, setQuery] = useState<string>('');
  const [hasSelected, setHasSelected] = useState<boolean>(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const { data: filtered = [] } = useQuery<Patient[]>({
    queryKey: ['filteredPatients', query, patients],
    queryFn: () => {
      if (!query) return [];
      return patients.filter((p) =>
        p.name.toLowerCase().startsWith(query.toLowerCase())
      );
    },
    enabled: !!patients.length,
  });

  const handleSelect = async (patient: Patient) => {
    setQuery(patient.name);
    setPatientId(patient._id);
    await loadPatientData();
    setHasSelected(true); // mark as selected
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setHasSelected(false); // re-enable list if user types again
  };

  return (
    <div className="mb-6 relative max-w-xl mx-auto text-center">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search and select patient..."
        className="p-2 w-full border rounded shadow-sm"
      />

      {/* Show dropdown only when user hasn't selected yet */}
      {!hasSelected && filtered.length > 0 && (
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
