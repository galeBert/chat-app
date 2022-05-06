import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseUrl: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage(initializeApp(firebaseConfig));
export const auth = getAuth();

export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();
