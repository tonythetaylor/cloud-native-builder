import React, { useEffect } from 'react';
import api from '../services/api';
import useProjectStore from '../store/useProjectStore';
import TopBar from './TopBar';
import Palette from './Palette';
import Canvas from './Canvas';
import ProjectSelector from './ProjectSelector';
import InspectorPanel from './InspectorPanel';
import { ProjectOut } from '../types';

export default function Dashboard() {
  const setProjects = useProjectStore((s) => s.setProjects);
  const selectProject = useProjectStore((s) => s.selectProject);

  useEffect(() => {
    api.get<ProjectOut[]>('/projects')
      .then((res) => {
        setProjects(res.data);
        if (res.data.length) {
          const first = res.data[0];
          selectProject(first.id, first.config.elements, first.name);
        }
      })
      .catch(console.error);
  }, [setProjects, selectProject]);

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
          <ProjectSelector />
          <Palette />
        </aside>
        <main className="flex-1 bg-gray-100 p-4 relative flex">
          <Canvas />
          <InspectorPanel />
        </main>
      </div>
    </div>
  );
}