// ════════════════════════════════════════════════════════════════════
// Engravity — Auth Module
// ════════════════════════════════════════════════════════════════════
// Maneja signup, login, logout, observer de sesión y creación del
// documento de perfil en Firestore. Reemplaza el handleAuth() viejo
// que solo hacía un alert.
// ════════════════════════════════════════════════════════════════════

import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ─── Utilidades de UI ───
function showAuthError(modalId, message) {
  let modal = document.getElementById(modalId);
  if (!modal) return;
  let errBox = modal.querySelector('.auth-error');
  if (!errBox) {
    errBox = document.createElement('div');
    errBox.className = 'auth-error';
    errBox.style.cssText = 'background: rgba(255,80,80,0.12); border: 1px solid rgba(255,80,80,0.4); color: #ff8888; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;';
    const form = modal.querySelector('form');
    if (form) form.insertBefore(errBox, form.firstChild);
  }
  errBox.textContent = message;
  errBox.style.display = 'block';
}

function clearAuthError(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const errBox = modal.querySelector('.auth-error');
  if (errBox) errBox.style.display = 'none';
}

function setLoading(modalId, loading) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const btn = modal.querySelector('button[type="submit"]');
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Procesando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// ─── Mensajes de error en español ───
function translateAuthError(code) {
  const map = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email. Intenta iniciar sesión.',
    'auth/invalid-email': 'El email no es válido.',
    'auth/weak-password': 'La contraseña es muy débil. Usa al menos 6 caracteres.',
    'auth/user-not-found': 'No existe una cuenta con ese email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento e intenta de nuevo.',
    'auth/network-request-failed': 'Sin conexión. Verifica tu internet.',
    'auth/configuration-not-found': 'Auth no está configurado. Habilita Email/Password en Firebase.',
    'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase.'
  };
  return map[code] || `Error: ${code}`;
}

// ─── Crear documento de usuario en Firestore ───
async function createUserProfile(user, extra = {}) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) return; // ya existe, no sobrescribir

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: extra.displayName || user.displayName || '',
    plan: 'free',                  // free / professional / industrial / studio
    role: 'user',                  // user / admin
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    preferences: {
      language: document.documentElement.lang || 'es',
      newsletter: true
    }
  });
}

// ─── Actualizar lastLogin ───
async function updateLastLogin(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn('No se pudo actualizar lastLogin:', e);
  }
}

// ─── SIGN UP ───
export async function signUp(event) {
  event.preventDefault();
  const form = event.target;
  const modalId = 'signupModal';
  clearAuthError(modalId);
  setLoading(modalId, true);

  const inputs = form.querySelectorAll('input');
  const name = inputs[0]?.value.trim() || '';
  const email = inputs[1]?.value.trim() || '';
  const password = inputs[2]?.value || '';

  if (password.length < 6) {
    showAuthError(modalId, 'La contraseña debe tener al menos 6 caracteres.');
    setLoading(modalId, false);
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    await createUserProfile(cred.user, { displayName: name });

    // Cerrar modal y redirigir al dashboard
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    window.location.href = dashboardUrl();
  } catch (e) {
    console.error('Signup error:', e);
    showAuthError(modalId, translateAuthError(e.code));
  } finally {
    setLoading(modalId, false);
  }
}

// ─── LOG IN ───
export async function logIn(event) {
  event.preventDefault();
  const form = event.target;
  const modalId = 'loginModal';
  clearAuthError(modalId);
  setLoading(modalId, true);

  const inputs = form.querySelectorAll('input');
  const email = inputs[0]?.value.trim() || '';
  const password = inputs[1]?.value || '';

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(cred.user);

    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    window.location.href = dashboardUrl();
  } catch (e) {
    console.error('Login error:', e);
    showAuthError(modalId, translateAuthError(e.code));
  } finally {
    setLoading(modalId, false);
  }
}

// ─── LOG OUT ───
export async function logOut() {
  try {
    await signOut(auth);
    window.location.href = homeUrl();
  } catch (e) {
    console.error('Logout error:', e);
    alert('No se pudo cerrar sesión. Intenta de nuevo.');
  }
}

// ─── RESET PASSWORD ───
export async function resetPassword(email) {
  if (!email) {
    alert('Escribe tu email primero para enviarte el link de recuperación.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Te enviamos un email para restablecer tu contraseña.');
  } catch (e) {
    console.error('Reset error:', e);
    alert(translateAuthError(e.code));
  }
}

// ─── OBSERVER DE SESIÓN ───
// Actualiza el navbar según el estado de auth.
export function watchAuthState() {
  onAuthStateChanged(auth, (user) => {
    const loginBtns = document.querySelectorAll('.login-btn');
    const signupBtns = document.querySelectorAll('[onclick*="signupModal"]');

    if (user) {
      // Usuario logueado: cambiar "Log In" por "Mi cuenta"
      loginBtns.forEach(btn => {
        btn.textContent = 'Mi cuenta';
        btn.onclick = () => { window.location.href = dashboardUrl(); };
      });
      signupBtns.forEach(btn => {
        if (btn.classList.contains('btn-primary') && !btn.classList.contains('login-btn')) {
          btn.textContent = 'Dashboard';
          btn.onclick = () => { window.location.href = dashboardUrl(); };
        }
      });
    } else {
      // Sin sesión: estado original
      loginBtns.forEach(btn => {
        if (btn.dataset.i18n) return;
        btn.textContent = 'Log In';
        btn.onclick = () => { window.openModal && window.openModal('loginModal'); };
      });
    }
  });
}

// ─── HELPERS de URL ───
// En producción (engravitysigns.com) usamos rutas absolutas.
// En local (file://) usamos relativas calculadas según profundidad.
function dashboardUrl() {
  if (window.location.protocol === 'file:') {
    return calculateRelative('dashboard/');
  }
  return '/dashboard/';
}

function homeUrl() {
  if (window.location.protocol === 'file:') {
    return calculateRelative('index.html');
  }
  return '/';
}

function calculateRelative(target) {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && !s.includes('.html'));
  // segments contiene las carpetas de profundidad (sin filename)
  const depth = segments.length;
  if (depth === 0) return target;
  return '../'.repeat(depth) + target;
}

// ─── EXPONER FUNCIONES GLOBALMENTE para los onclick="" del HTML ───
window.signUp = signUp;
window.logIn = logIn;
window.logOut = logOut;
window.resetPassword = resetPassword;

// Sobrescribir handleAuth viejo (que era un alert simulado)
window.handleAuth = (event) => {
  // Detectar si es login o signup según el modal del que viene
  const form = event.target;
  const modal = form.closest('.modal-overlay');
  if (!modal) return;
  if (modal.id === 'signupModal') return signUp(event);
  if (modal.id === 'loginModal') return logIn(event);
};

// Iniciar el observer apenas cargue
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', watchAuthState);
} else {
  watchAuthState();
}
