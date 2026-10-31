import React, { useEffect, type ReactNode } from 'react';
import { supabaseAuthRepository } from '../../features/authentication/data/supabaseAuthRepository';
import { useAuthStore } from '../../features/authentication/presentation/useAuthStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    supabaseAuthRepository
      .getUser()
      .then(setUser)
      .catch(() => setUser(null));

    return supabaseAuthRepository.onAuthStateChange(setUser);
  }, [setUser]);

  return <>{children}</>;
}
