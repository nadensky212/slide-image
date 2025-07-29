// Lokasi: src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userRole: null, // 'admin' atau 'superadmin'
      login: (role) => set({ isLoggedIn: true, userRole: role }),
      logout: () => set({ isLoggedIn: false, userRole: null }),
    }),
    {
      name: 'auth-storage', // Menyimpan status login di localStorage
    }
  )
);