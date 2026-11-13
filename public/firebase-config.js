// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEmuRZKD8cZnufYZ8mLG1UCHVSWEr0D-g",
  authDomain: "campus-notify-69b76.firebaseapp.com",
  projectId: "campus-notify-69b76",
  storageBucket: "campus-notify-69b76.firebasestorage.app",
  messagingSenderId: "1031807241582",
  appId: "1:1031807241582:web:7bc5d277a386056c0a857f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);