import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handle = async () => {
    await api.post('/auth/register', { email, password });
    nav('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl mb-4">Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-2 p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 p-2 border" />
        <button onClick={handle} className="w-full bg-green-600 text-white p-2 rounded">Register</button>
        <p className="mt-4 text-center">Have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </div>
    </div>
  );
}