import React, { useEffect, useState } from 'react';
import { getPatientById } from '../api/patientApi';
import { useToothStore } from '../store/useToothStore';

export default function CurrentPatientInfo() {
  const patientId = useToothStore((state) => state.patientId);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    getPatientById(patientId)
      .then((res) => setPatient(res.data))
      .catch((err) => console.error('Failed to load patient info:', err));
  }, [patientId]);

  if (!patient) return null;

  return (
    <div className="text-center mb-4 p-4 bg-white rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Patient Info</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age ?? 'N/A'}</p>
      <p><strong>Gender:</strong> {patient.gender ?? 'N/A'}</p>
    </div>
  );
}
