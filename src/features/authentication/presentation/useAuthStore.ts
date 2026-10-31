import { create } from 'zustand';
import type { AuthUser } from '../domain/AuthRepository';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
}));
