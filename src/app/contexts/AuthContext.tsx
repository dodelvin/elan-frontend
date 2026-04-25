/**
 * contexts/AuthContext.tsx
 * ------------------------
 * Single source of truth for "is the user signed in?" Wraps the rest of
 * the app so any screen can read the current user / sign in / sign out
 * via the useAuth() hook.
 *
 * Listens to Firebase Auth state changes and mirrors them into local
 * React state, so UI always reflects the real auth status.
 *
 * Contains:
 *   - <AuthProvider />   wrap-the-app provider
 *   - useAuth()          hook returning { user, loading, signUp, signIn, signOut }
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { apiPost } from '../lib/api';

// Variables related to the context shape
interface AuthContextValue {
  user: User | null;                                          // currently signed-in Firebase user, or null
  loading: boolean;                                            // true until the first auth check resolves
  signUp:  (name: string, email: string, password: string) => Promise<void>;
  signIn:  (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider
 * Takes children. Subscribes to Firebase auth state on mount, exposes
 * sign-up / sign-in / sign-out methods that wrap the Firebase SDK.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Variables related to live auth state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe once on mount; the unsubscribe cleans up on unmount.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * signUp
   * Takes display name, email, password. Creates the Firebase Auth user,
   * sets the display name, then calls POST /api/auth/signup so the
   * backend creates the matching Firestore profile doc.
   */
  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const idToken = await cred.user.getIdToken();
    await apiPost('/api/auth/signup', { idToken, name });
  };

  /**
   * signIn
   * Takes email + password. Signs in via Firebase Auth, then notifies
   * the backend so it can update lastLoginAt or bootstrap a missing
   * profile doc.
   */
const signIn = async (email: string, password: string): Promise<void> => {
  try {
    // alert('Step 1: calling Firebase signInWithEmailAndPassword...');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // alert('Step 2: Firebase auth succeeded, getting token...');
    const idToken = await cred.user.getIdToken();
    // alert('Step 3: got token, calling backend...');
    await apiPost('/api/auth/signin', { idToken });
    // alert('Step 4: all done!');
  } catch (err: any) {
    // alert(`signIn FAILED at: ${err.code || 'unknown'}\nMessage: ${err.message || err}`);
    throw err;
  }
};

  /**
   * signOut
   * No arguments. Signs out via the Firebase SDK; onAuthStateChanged
   * fires immediately and clears the local user state.
   */
  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 * No arguments. Returns the auth context value. Throws if called
 * outside of <AuthProvider /> — prevents silent bugs from missing
 * providers.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
