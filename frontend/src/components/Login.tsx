import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore(s => s.setToken);
  const nav = useNavigate();

  const handle = async () => {
    // build form‑urlencoded body
    const params = new URLSearchParams();
    params.append('username', email);   // OAuth2PasswordRequestForm expects 'username'
    params.append('password', password);

    const res = await api.post(
      '/auth/login',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // response_model=Token → { access_token, token_type }
    setToken(res.data.access_token);
    nav('/');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border"
        />
        <button
          onClick={handle}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          No account?{' '}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}