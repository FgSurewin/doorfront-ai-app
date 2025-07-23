import { initializeFirebase } from '../firebase/firebaseUtils';
import { useContext, useEffect } from 'react';
import { ConfigContext } from '../App';

export function FirebaseInitWrapper() {
  const config = useContext(ConfigContext);

  useEffect(() => {
    if (config?.REACT_APP_FIREBASE_API_KEY) {
      initializeFirebase({
        apiKey: config.REACT_APP_FIREBASE_API_KEY,
        authDomain: config.REACT_APP_FIREBASE_AUTH,
        projectId: config.REACT_APP_FIREBASE_PROJECT,
        storageBucket: config.REACT_APP_FIREBASE_BUCKET,
        messagingSenderId: config.REACT_APP_FIREBASE_MESS,
        appId: config.REACT_APP_FIREBASE_APP_ID,
      });
    }
  }, [config]);

  return null; // or children if you want to wrap something
}
