import React from 'react';
import api from '../services/api';
import useProjectStore from '../store/useProjectStore';
import { ProjectOut } from '../types';

export default function ProjectSelector() {
  const projects = useProjectStore((s) => s.projects);
  const currentId = useProjectStore((s) => s.currentProjectId);
  const selectProject = useProjectStore((s) => s.selectProject);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = projects.find((p) => p.id === +e.target.value)!;
    selectProject(project.id, project.config.elements, project.name);
  };

  return (
    <select
      value={currentId ?? ''}
      onChange={handleChange}
      className="w-full p-2 bg-gray-700 rounded"
    >
      {projects.map((p: ProjectOut) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}