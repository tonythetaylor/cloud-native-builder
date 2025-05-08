// store/useAuthStore.ts
import create from 'zustand'

interface AuthState {
  token: string | null;
  setToken: (t: string | null) => void;
}

export default create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) localStorage.setItem("token", token);
    else    localStorage.removeItem("token");
    set({ token });
  },
}));

