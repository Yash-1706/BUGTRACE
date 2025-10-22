import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData) => {
        set({
          user: userData,
          token: userData.token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      initializeAuth: () => {
        const state = get();
        const isAuthenticated = !!(state.token && state.user);
        if (state.isAuthenticated !== isAuthenticated) {
          set({ isAuthenticated });
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);

export default useAuthStore;