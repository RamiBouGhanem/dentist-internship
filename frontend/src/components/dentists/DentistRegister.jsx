import React, { useState } from 'react';
import axios from 'axios';

export default function DentistRegister({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3333/auth/register', form);
      const { token, dentist } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('dentistId', dentist._id);
      onRegister(dentist);
    } catch (err) {
      setError('Email may already be taken or invalid.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Dentist Register</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-3 border rounded-md"
        required
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-3 border rounded-md"
        required
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-3 border rounded-md"
        required
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-2 rounded-md"
      >
        Register
      </button>
    </form>
  );
}
