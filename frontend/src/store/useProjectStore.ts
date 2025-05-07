import create from 'zustand';

type Element = { type: string; label: string; x: number; y: number };
interface ProjectState { projectName: string; elements: Element[]; setElements: (els: Element[]) => void; addElement: (el: Element) => void; }
const useProjectStore = create<ProjectState>((set) => ({ projectName: 'New Architecture', elements: [], setElements: (els) => set({ elements: els }), addElement: (el) => set(state => ({ elements: [...state.elements, el] })) }));
export default useProjectStore;