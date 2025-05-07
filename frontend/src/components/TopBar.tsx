import React from 'react';
import useAuthStore from '../store/useAuthStore';
import useProjectStore from '../store/useProjectStore';
import api from '../services/api';

export default function TopBar() {
  const token = useAuthStore(state=>state.token);
  const setToken = useAuthStore(state=>state.setToken);
  const projectName = useProjectStore(state=>state.projectName);
  const elements = useProjectStore(state=>state.elements);

  const logout = () => setToken(null);
  const save = async () => await api.post('/projects', { name: projectName, config: { elements } }, { headers: { Authorization: `Bearer ${token}` } });

  return (
    <header className="h-16 bg-white shadow flex items-center px-4">
      <h1 className="text-xl font-bold">{projectName}</h1>
      <div className="ml-auto space-x-2">
        <button onClick={save} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
      </div>
    </header>
  );
}