import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

/**
 * Firebase configuration & Initialization
 * Reference: https://firebase.google.com/docs/storage/web/start
 */

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT,
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESS,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// firebase.initializeApp(firebaseConfig);
export const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);
