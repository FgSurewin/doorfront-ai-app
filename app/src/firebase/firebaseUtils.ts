// firebase/firebaseUtils.ts
import { initializeApp, FirebaseApp } from "firebase/app";

let firebaseApp: FirebaseApp | null = null;

export function initializeFirebase(config: any): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeApp(config);
  }
  return firebaseApp;
}
