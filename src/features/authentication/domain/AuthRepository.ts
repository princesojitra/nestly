export type AuthUser = {
  id: string;
  email: string | null;
};

export type SignUpResult = {
  user: AuthUser;
  // true when the project requires email confirmation — signUp succeeded but
  // there's no session yet, so the caller shouldn't expect to be signed in.
  needsEmailConfirmation: boolean;
};

export type AuthRepository = {
  getUser: () => Promise<AuthUser | null>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => () => void;
};
