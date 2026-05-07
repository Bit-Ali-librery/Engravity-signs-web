# Guía paso a paso: configurar Firebase para Engravity

Esta guía te lleva de cero a tener Firebase conectado al sitio. Yo ya dejé todo el código JavaScript listo — tú solo necesitas hacer la configuración en la consola de Firebase y pegar las credenciales en un archivo.

**Tiempo estimado: 15-20 minutos.**

---

## Paso 1 — Crear el proyecto

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y entra con tu cuenta.
2. Click en **"Add project"** (Agregar proyecto).
3. Nombre del proyecto: `engravity-signs` (o el que prefieras — Firebase añade un sufijo único automáticamente, así que el nombre real será algo como `engravity-signs-a1b2c`).
4. Continuar.
5. **Google Analytics:** puedes habilitarlo o saltarlo. Si lo habilitas, te pide vincular una cuenta de Analytics — escoge "Default Account for Firebase" si no tienes una.
6. Click en **Create project**.
7. Espera ~30 segundos a que termine.

---

## Paso 2 — Verificar que estás en plan Blaze

1. En la barra lateral izquierda, abajo, deberías ver **"Spark"** o **"Blaze"** como tu plan actual.
2. Como dijiste que tienes Blaze: bien, ya tienes acceso a todo lo que necesitamos (Firestore, Cloud Functions, Storage).
3. **Importante:** Blaze es pay-as-you-go pero el **free tier mensual es generoso** (50k lecturas en Firestore, 20k escrituras, 1 GB de Storage gratis cada mes). Para un sitio recién lanzado no deberías pagar nada los primeros meses.

---

## Paso 3 — Registrar la web app

1. En la página principal de tu proyecto, busca el ícono **`</>`** (Web) en la sección "Get started by adding Firebase to your app". Clic ahí.
2. Nickname: `Engravity Web` (no se ve en ningún lado público, solo es etiqueta).
3. **NO marques** "Also set up Firebase Hosting" (vas a usar Hostinger, no Firebase Hosting).
4. Click en **Register app**.
5. Te aparecerá una pantalla con un bloque de código que se ve así:

```js
const firebaseConfig = {
  apiKey: "AIzaSyA-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "engravity-signs-xxxxx.firebaseapp.com",
  projectId: "engravity-signs-xxxxx",
  storageBucket: "engravity-signs-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-ABCDEF1234"
};
```

6. **¡Copia ese bloque entero!** Lo vas a pegar en un archivo en un momento.
7. Click en **Continue to console**.

---

## Paso 4 — Pegar la config en el sitio

1. Abre `E:\Engravity- website\src\js\firebase-config.js` (yo lo creé como placeholder).
2. Reemplaza el objeto `firebaseConfig` con el que copiaste de Firebase.
3. Guarda el archivo.

Ese archivo es público (se sube al sitio y cualquiera puede ver el `apiKey`). Eso es **normal y esperado** — la seguridad de Firebase no está en ocultar el apiKey, sino en las **Security Rules** de Firestore y los **Authorized Domains** de Auth, que configuras en los siguientes pasos.

---

## Paso 5 — Habilitar Email/Password Authentication

1. En el menú lateral izquierdo, click en **Build → Authentication**.
2. Click en **Get started**.
3. Pestaña **Sign-in method** → busca **Email/Password** → click en él.
4. Activa el toggle de **Enable** (el primero).
5. **NO** actives "Email link (passwordless sign-in)" por ahora — eso es opcional para más adelante.
6. **Save**.

---

## Paso 6 — Agregar dominios autorizados

Por defecto, Firebase permite auth solo desde `localhost` y un par de dominios temporales. Hay que agregar tu dominio real.

1. En **Authentication → Settings** (pestaña arriba) → **Authorized domains**.
2. Click en **Add domain**.
3. Agrega: `engravitysigns.com`
4. Click en **Add domain** otra vez.
5. Agrega: `www.engravitysigns.com`
6. Listo. Ahora el login va a funcionar desde tu dominio real.

---

## Paso 7 — Crear la base de datos Firestore

1. En el menú lateral, **Build → Firestore Database**.
2. Click en **Create database**.
3. **Modo:** elige **Start in production mode** (modo bloqueado por defecto — vamos a abrir solo lo necesario con reglas en el siguiente paso).
4. **Location:** elige la región más cercana a tu audiencia. Para América Latina lo más recomendable es `southamerica-east1` (São Paulo) o `us-central1` (más barato y rápido para EE.UU.). **OJO:** la región **NO se puede cambiar después**, escógela bien.
5. **Enable**.
6. Espera ~30 segundos.

---

## Paso 8 — Pegar las Security Rules

Las reglas de seguridad son lo que protege tus datos. Sin esto, cualquier persona podría leer/escribir cualquier cosa.

1. En **Firestore Database → Rules**.
2. Borra todo el contenido del editor.
3. Pega exactamente esto (yo te lo dejo también en `E:\Engravity- website\firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Cada usuario solo lee/escribe SU propio documento de perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Subscripciones: lee solo el dueño, escritura solo desde Cloud Functions / admin
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // se escribe desde backend (Stripe webhooks futuros)
    }

    // Pagos: igual, solo lee el dueño
    match /payments/{paymentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    // Cualquier otra colección: bloqueada por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click en **Publish**.

---

## Paso 9 — Verificar en local

Abre tu sitio (la versión local de Hostinger o `index.html` directo) y prueba:

1. Click en **"Empieza Gratis"** → llena el formulario de registro → debe crear el usuario.
2. Ve a `console.firebase.google.com` → **Authentication → Users**: debes ver tu nuevo usuario listado con su email.
3. Ve a **Firestore Database → Data**: debes ver una colección `users/` con un documento que tiene tu UID y datos del perfil (nombre, email, plan: "free").
4. Click en **"Log In"** y mete el email/contraseña que registraste — debe entrar y aparecer un botón "Mi cuenta" en el navbar.

---

## Paso 10 — Subir a Hostinger

Una vez que probaste en local que funciona:

1. Asegúrate de que `src/js/firebase-config.js` tiene tu config real (no el placeholder).
2. Sube los archivos a Hostinger siguiendo `DEPLOY-HOSTINGER.md`.

---

## Costos: qué esperar

Plan Blaze + sitio nuevo + tráfico bajo = **probablemente $0 los primeros meses**.

El free tier mensual incluye:
- 50,000 lecturas de Firestore
- 20,000 escrituras
- 1 GB de almacenamiento
- 10 GB de bandwidth de hosting (no aplica, usas Hostinger)
- 50,000 autenticaciones

**Cuándo empezarías a pagar:**
- Si tienes ~500 usuarios activos diarios haciendo varias acciones cada uno
- Si almacenas archivos pesados (videos, mockups grandes) en Firebase Storage
- Si configuras Cloud Functions con mucho tráfico

**Cómo ponerle un tope de presupuesto:**
1. En Firebase → ⚙️ → **Usage and billing → Details and settings**.
2. Click en **Modify plan**.
3. Configura un **budget alert** a $5/mes para recibir email si te acercas. Es protección anti-sustos.

---

## Errores comunes

### "Firebase: Error (auth/configuration-not-found)"
- No habilitaste Email/Password en Authentication. Vuelve al Paso 5.

### "Firebase: Error (auth/unauthorized-domain)"
- Estás probando desde un dominio que no agregaste a Authorized Domains. Vuelve al Paso 6.

### "Missing or insufficient permissions" al leer/escribir Firestore
- Las Security Rules están bloqueando. Verifica que pegaste correctamente las reglas del Paso 8.

### El usuario se crea en Auth pero no en Firestore
- Es porque `auth.js` falló al crear el documento. Abre la consola del navegador (F12) y mira el error.

---

## Lo que sigue (no es para hoy)

Cuando ya esté funcionando lo básico, podemos agregar:
- **Reset password** por email (5 min más)
- **Email verification** para validar correos reales
- **Stripe integration** para pagos reales (necesita más setup)
- **Google Sign-In** (1 click)
- **Cloud Functions** para tareas backend (procesar webhooks de Stripe, mandar emails, etc.)

Pero todo eso después. Primero que funcione el login básico.

---

¿Atorado en algún paso? Avísame cuál y lo desbloqueamos.
