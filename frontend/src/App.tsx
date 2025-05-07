import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import useAuthStore from './store/useAuthStore';

export default function App() {
  const token = useAuthStore(state => state.token);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={token ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}