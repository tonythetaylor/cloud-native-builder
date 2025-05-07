// src/components/TopBar.tsx
import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useProjectStore, { Element } from '../store/useProjectStore';
import { NewProjectModal } from './NewProjectModal';

export default function TopBar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);

  const {
    projects,
    projectName,
    elements,
    setProjects,
    selectProject,
  } = useProjectStore();

  // Create new project
  const createProject = async (name: string) => {
    const res = await api.post(
      '/projects',
      { name, config: { elements: [] } }
    );
    setProjects([...projects, res.data]);
    selectProject(res.data.id, [], res.data.name);
    setModalOpen(false);
  };

  // Save current canvas to backend
    const saveProject = async () => {
        const projectId = useProjectStore.getState().currentProjectId;
        if (!token || projectId == null) return;
        await api.put(
         `/projects/${projectId}`,
          { name: projectName, config: { elements } }
       );
        // Optionally show a success toast here
    };

  // Export IaC as ZIP
  const exportIaC = async () => {
    const projectId = useProjectStore.getState().currentProjectId;
    if (!projectId) return;
    const response = await api.post(
      '/export/terraform',
      { project_id: projectId },
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName || 'architecture'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Logout
  const logout = () => {
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white shadow flex items-center px-4">
      <h1 className="text-xl font-bold">{projectName}</h1>
      <div className="ml-auto space-x-2">
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          New
        </button>
        <button
          onClick={saveProject}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={exportIaC}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          Export
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Logout
        </button>
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