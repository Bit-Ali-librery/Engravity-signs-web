// ════════════════════════════════════════════════════════════════════
// Firebase Configuration — Engravity Signs (Blaze)
// ════════════════════════════════════════════════════════════════════
//
// IS IT SAFE TO HAVE THIS PUBLIC? YES. Security lives in Firestore
// Security Rules + Authorized Domains in Firebase Auth, NOT in hiding
// the apiKey. This is standard for every Firebase web project.
// ════════════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLlyAUD6_h7YcScw8puU3ENKytGRBOg04",
  authDomain: "engravity-signs.firebaseapp.com",
  projectId: "engravity-signs",
  storageBucket: "engravity-signs.firebasestorage.app",
  messagingSenderId: "250312785941",
  appId: "1:250312785941:web:f22e6b998c9d222a770e1c",
  measurementId: "G-FYK9WRMHQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
