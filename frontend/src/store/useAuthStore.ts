import create from 'zustand';

interface AuthState { token: string | null; setToken: (t: string|null) => void; }
const useAuthStore = create<AuthState>((set) => ({ token: null, setToken: (t) => set({ token: t }) }));
export default useAuthStore;