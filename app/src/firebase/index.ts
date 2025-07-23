// firebase/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

let firebaseApp: FirebaseApp | null = null;
let storage: FirebaseStorage | null = null;

export function initFirebase(config: any) {
  if (!firebaseApp) {
    firebaseApp = initializeApp(config);
    storage = getStorage(firebaseApp);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    throw new Error("Firebase has not been initialized yet.");
  }
  return firebaseApp;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error("Firebase Storage has not been initialized yet.");
  }
  return storage;
}
