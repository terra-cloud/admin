import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DBURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT
};

let app = initializeApp(firebaseConfig);
let db = getFirestore(app);

export { db };

// On app start, try to fetch the active config from the API and apply it.
// The env-var init above is a synchronous fallback; this replaces it once
// the API responds, so the correct config is used as early as possible.
fetchAndApplyActiveConfig();

export function reinitializeFirebase(apiConfig) {
  const newConfig = {
    apiKey: apiConfig.api_key || apiConfig.apiKey,
    authDomain: apiConfig.auth_domain || apiConfig.authDomain,
    databaseURL: apiConfig.db_url || apiConfig.databaseURL || null,
    projectId: apiConfig.project_id || apiConfig.projectId,
    storageBucket: apiConfig.storage_bucket || apiConfig.storageBucket,
    messagingSenderId: apiConfig.sender_id || apiConfig.messagingSenderId,
    appId: apiConfig.app_id || apiConfig.appId,
    measurementId: apiConfig.measurement_id || apiConfig.measurementId,
  };

  const name = `dynamic_${Date.now()}`;

  app = initializeApp(newConfig, name);
  db = getFirestore(app);
}

export async function fetchAndApplyActiveConfig() {
  try {
    const baseURL = import.meta.env.VITE_API_SUPPORT_URL;
    const res = await fetch(`${baseURL}/api/firebase-configs/active`);
    const data = await res.json();
    if (data?.success && data?.config) {
      reinitializeFirebase(data.config);
    }
  } catch {
    // Silently fall back to env-var config
  }
}
