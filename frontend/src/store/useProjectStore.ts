import { create } from 'zustand'
import { ProjectOut } from '../types'; // define this interface to match your backend schema

export interface Element {
  type: string;
  label: string;
  x: number;
  y: number;
  // add any inspector properties here, e.g.:
  instanceType?: string;
  encryptionEnabled?: boolean;
}

export interface ProjectState {
  projects: ProjectOut[];
  currentProjectId: number | null;
  projectName: string;
  elements: Element[];
  selectedIndex: number | null;
  setProjects: (projects: ProjectOut[]) => void;
  selectProject: (id: number, config: Element[], name: string) => void;
  setElements: (els: Element[]) => void;
  addElement: (el: Element) => void;
  selectElement: (idx: number | null) => void;
  updateElement: (idx: number, props: Partial<Element>) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProjectId: null,
  projectName: 'New Architecture',
  elements: [],
  selectedIndex: null,
  setProjects: (projects) => set({ projects }),
  selectProject: (id, config, name) => set({ currentProjectId: id, elements: config, projectName: name, selectedIndex: null }),
  setElements: (els) => set({ elements: els }),
  addElement: (el) => set((state) => ({ elements: [...state.elements, el] })),
  selectElement: (idx) => set({ selectedIndex: idx }),
  updateElement: (idx, props) => set((state) => {
    const elements = [...state.elements];
    elements[idx] = { ...elements[idx], ...props };
    return { elements };
  }),
}));

export default useProjectStore;