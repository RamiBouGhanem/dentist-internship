import React, { useState } from 'react';
import { createPatient } from '../api/patientApi';
import { useToothStore } from '../store/useToothStore';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Define types for props
interface CreatePatientFormProps {
  onSuccess?: () => void;
}

export default function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  // Updated the type for gender to be "male" | "female"
  const [form, setForm] = useState<{ name: string; age: number; gender: 'male' | 'female' }>({
    name: '',
    age: 0, // Set default age as a number
    gender: 'male',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const setPatientId = useToothStore((state) => state.setPatientId);
  const loadPatientData = useToothStore((state) => state.loadPatientData);
  const fetchPatients = useToothStore((state) => state.fetchPatients);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleGenderToggle = (gender: 'male' | 'female') => {
    setForm((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.age) newErrors.age = 'Age is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dentistId = localStorage.getItem('dentistId');
    if (!dentistId) {
      alert('No logged-in dentist');
      return;
    }

    try {
      const res = await createPatient({
        ...form,
        dentistId,
        age: form.age, // Ensure age is passed as a number
      });

      const newPatient = res.data;
      setPatientId(newPatient._id);
      await loadPatientData();
      await fetchPatients();
      setSubmitted(true);
      setForm({ name: '', age: 0, gender: 'male' });
      setErrors({});

      setTimeout(() => setSubmitted(false), 3000);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create patient', err);
    }
  };

  const bgClass = form.gender === 'female' ? 'bg-pink-50' : 'bg-blue-50';

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 p-6 rounded-xl shadow-lg border border-gray-300 transition-all ${bgClass}`}
    >
      <h2 className="text-2xl font-bold text-center text-neutral-800 mb-2">
        Add New Patient
      </h2>

      <div>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Patient Name"
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-[15px] ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-sky-600'
          } placeholder-gray-400`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.name}
          </p>
        )}
      </div>

      <div>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
          placeholder="Age"
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-[15px] ${
            errors.age
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-sky-600'
          } placeholder-gray-400`}
        />
        {errors.age && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.age}
          </p>
        )}
      </div>

      <div className="text-center">
        <p className="mb-2 text-[15px] text-neutral-600 font-medium">Gender</p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleGenderToggle('male')}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition 
              ${
                form.gender === 'male'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 border-gray-300 hover:bg-neutral-200'
              }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => handleGenderToggle('female')}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition 
              ${
                form.gender === 'female'
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 border-gray-300 hover:bg-neutral-200'
              }`}
          >
            Female
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-2.5 rounded-md shadow-sm transition"
      >
        Create Patient
      </button>

      {submitted && (
        <div className="flex items-center justify-center text-emerald-600 mt-2 gap-2 text-sm">
          <CheckCircle size={18} />
          <span>Patient created successfully!</span>
        </div>
      )}
    </form>
  );
}
