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

export const createPatient = (data) =>
  axios.post(BASE_URL, data, getAuthConfig());

export const getAllPatients = () =>
  axios.get(BASE_URL, getAuthConfig());

export const getPatientById = (id) =>
  axios.get(`${BASE_URL}/${id}`, getAuthConfig());

export const addProcedureAPI = (id, toothNumber, procedure) =>
  axios.patch(`${BASE_URL}/${id}/teeth/${toothNumber}/add-procedure`, procedure, getAuthConfig());

export const removeProcedureAPI = (id, toothNumber, index) =>
  axios.delete(`${BASE_URL}/${id}/teeth/${toothNumber}/procedures/${index}`, getAuthConfig());

export const updatePatientProcedures = (id, teethData) =>
  axios.patch(`${BASE_URL}/${id}`, { teethData }, getAuthConfig());
