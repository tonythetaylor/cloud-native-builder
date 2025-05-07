import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useProjectStore from '../store/useProjectStore';
import { NewProjectModal } from './NewProjectModal';

export default function TopBar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const { projects, setProjects, selectProject } = useProjectStore();

  const createProject = async (name: string) => {
    const res = await api.post(
      '/projects',
      { name, config: { elements: [] } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProjects([...projects, res.data]);
    selectProject(res.data.id, [], res.data.name);
    setModalOpen(false);
  };

  return (
    <header className="h-16 bg-white shadow flex items-center px-4">
      <h1 className="text-xl font-bold">{useProjectStore((s) => s.projectName)}</h1>
      <div className="ml-auto space-x-2">
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          New
        </button>
        {/* … Save / Logout buttons … */}
      </div>

      {isModalOpen && (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onCreate={createProject}
        />
      )}
    </header>
  );
}
