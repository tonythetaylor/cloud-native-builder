import create from 'zustand';
import { ProjectOut } from '../types'; // define this interface to match your backend schema

type Element = { type: string; label: string; x: number; y: number };

interface ProjectState {
  projects: ProjectOut[];
  currentProjectId: number | null;
  projectName: string;
  elements: Element[];
  setProjects: (projects: ProjectOut[]) => void;
  selectProject: (id: number, config: Element[], name: string) => void;
  setElements: (els: Element[]) => void;
  addElement: (el: Element) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProjectId: null,
  projectName: 'New Architecture',
  elements: [],
  setProjects: (projects) => set({ projects }),
  selectProject: (id, config, name) =>
    set({ currentProjectId: id, elements: config, projectName: name }),
  setElements: (els) => set({ elements: els }),
  addElement: (el) =>
    set((state) => ({ elements: [...state.elements, el] })),
}));

export default useProjectStore;