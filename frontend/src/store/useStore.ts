import { create } from 'zustand'

type Element = { type: string; label: string; x: number; y: number };

interface Store {
  projectName: string;
  elements: Element[];
  addElement: (el: Element) => void;
}

const useStore = create<Store>((set) => ({
  projectName: 'New Architecture',
  elements: [],
  addElement: (el) => set(state => ({ elements: [...state.elements, el] }))
}));

export default useStore;
