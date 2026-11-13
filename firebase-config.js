// firebase-config.js
// Firebase Modular SDK Configuration for CampusNotify (CAMPUS NOTIFY project)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// =============================================================================
// PLACEHOLDER CONFIGURATION:
// Replace the values below with your real Firebase Project configuration
// from the Firebase Console (Project Settings > General > Your Apps > Web app).
// =============================================================================
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Cloud Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Also expose globally on window for convenient access across scripts
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDb = db;
}

