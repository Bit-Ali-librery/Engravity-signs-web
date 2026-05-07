// ════════════════════════════════════════════════════════════════════
// Firebase Configuration
// ════════════════════════════════════════════════════════════════════
//
// REEMPLAZA los valores de abajo con la config que te da Firebase.
// Para obtenerla:
//   1. Ve a console.firebase.google.com
//   2. Selecciona tu proyecto Engravity
//   3. ⚙️ Project settings → General → Your apps → "Engravity Web"
//   4. Scroll hasta "SDK setup and configuration" → copia el objeto firebaseConfig
//
// ¿Es seguro tener esto público? SÍ. La seguridad está en las
// Security Rules de Firestore + Authorized Domains de Auth, NO en ocultar
// el apiKey. Esto es estándar en todo proyecto web con Firebase.
// ════════════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ─── PEGAR AQUÍ TU CONFIG REAL ───
const firebaseConfig = {
  apiKey: "REEMPLAZAR-CON-TU-API-KEY",
  authDomain: "engravity-signs-XXXXX.firebaseapp.com",
  projectId: "engravity-signs-XXXXX",
  storageBucket: "engravity-signs-XXXXX.appspot.com",
  messagingSenderId: "REEMPLAZAR",
  appId: "REEMPLAZAR"
};
// ─────────────────────────────────

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
