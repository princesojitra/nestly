import { supabase } from '../../../core/network/supabaseClient';
import type { AuthRepository, AuthUser } from '../domain/AuthRepository';

function toAuthUser(user: { id: string; email?: string | null } | null | undefined): AuthUser | null {
  return user ? { id: user.id, email: user.email ?? null } : null;
}

export const supabaseAuthRepository: AuthRepository = {
  async getUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return toAuthUser(data.session?.user);
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = toAuthUser(data.user);
    if (!user) throw new Error('Sign up did not return a user.');
    return { user, needsEmailConfirmation: data.session === null };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const user = toAuthUser(data.user);
    if (!user) throw new Error('Sign in did not return a user.');
    return user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(toAuthUser(session?.user));
    });
    return () => data.subscription.unsubscribe();
  },
};
