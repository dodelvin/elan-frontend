/**
 * lib/firebase.ts
 * ---------------
 * Initialises the Firebase client SDK on the frontend. Reads the public
 * Firebase config from Vite environment variables (VITE_FIREBASE_*) which
 * are loaded from the .env.local file at the project root.
 *
 * Exports the auth singleton so AuthContext can register the
 * onAuthStateChanged listener.
 *
 * Contains:
 *   - app   the FirebaseApp instance
 *   - auth  the Firebase Auth client
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Variables related to the Firebase project config
// All values are public — protection comes from Firestore security rules,
// not from secrecy of these strings.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
