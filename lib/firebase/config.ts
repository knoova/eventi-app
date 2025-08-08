// lib/firebase/config.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Le tue configurazioni Firebase (da sostituire con quelle reali)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null) 
  : null;

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  BUSINESSES: 'businesses',
  EVENTS: 'events',
  TICKETS: 'tickets',
  PURCHASES: 'purchases',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  CONFIG: 'config'
} as const;

// Helper per timestamp Firestore
export const serverTimestamp = () => {
  const { serverTimestamp: fsServerTimestamp } = require('firebase/firestore');
  return fsServerTimestamp();
};

export default app;