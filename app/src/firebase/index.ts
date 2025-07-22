import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

/**
 * Firebase configuration & Initialization
 * Reference: https://firebase.google.com/docs/storage/web/start
 */

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT,
//   storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESS,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyCB8qmDGFvUprijjju_-8Bznc-1bfLMAwU",
  authDomain: "doorfront-354705.firebaseapp.com",
  projectId:"doorfront-354705",
  storageBucket:"doorfront-354705.appspot.com",
  messagingSenderId: "16023570979",
  appId: "1:16023570979:web:5686c1ce5c6ccad3b7ff96",
};
// firebase.initializeApp(firebaseConfig);
export const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);
