import axios from 'axios';

const BASE_URL = 'http://localhost:3333/patients';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Types
export interface Procedure {
  type: string;
  color: string;
  [key: string]: any;
}

export interface PatientData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  dentistId?: string;
  teethData?: Record<number, Procedure[]>;
}

// API calls
export const createPatient = (data: PatientData) =>
  axios.post(`${BASE_URL}`, data, getAuthConfig());

export const getAllPatients = () =>
  axios.get(`${BASE_URL}`, getAuthConfig());

export const getPatientById = (id: string) =>
  axios.get(`${BASE_URL}/${id}`, getAuthConfig());

export const addProcedureAPI = (
  id: string,
  toothNumber: number,
  procedure: Procedure
) =>
  axios.patch(
    `${BASE_URL}/${id}/teeth/${toothNumber}/add-procedure`,
    procedure,
    getAuthConfig()
  );

export const removeProcedureAPI = (
  id: string,
  toothNumber: number,
  index: number
) =>
  axios.delete(
    `${BASE_URL}/${id}/teeth/${toothNumber}/procedures/${index}`,
    getAuthConfig()
  );

export const updatePatientProcedures = (
  id: string,
  teethData: Record<number, Procedure[]>
) =>
  axios.patch(`${BASE_URL}/${id}`, { teethData }, getAuthConfig());
