// Firebase configuration and initialization

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate config to fail fast with clear error
const validateConfig = () => {
  const missing = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMsg = `Missing Firebase configuration keys: ${missing.join(', ')}. Check your .env.local file.`;
    if (typeof window !== 'undefined') {
      console.error(errorMsg);
    }
  }
};

validateConfig();

// Initialize Firebase only once
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'AIzaSyCHBeEV24zkxXn1B9kL3bhtQhndU-1wGKQ';

if (getApps().length > 0) {
  try {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    if (typeof window !== 'undefined') {
      throw error;
    }
  }
} else if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // Don't throw during build to allow prerendering of static parts
    if (typeof window !== 'undefined') {
      throw error;
    }
  }
} else {
  // If we are in the browser and config is missing, warn the user
  if (typeof window !== 'undefined') {
    console.warn("Firebase configuration is missing. Authentication and database features will not work.");
  }
}

export { auth, db };
export default app;
