# Estructura de Firestore — Engravity

Diagrama de las colecciones de Firestore que el sitio usa. **No tienes que crear estas colecciones manualmente** — se crean solas la primera vez que se escribe un documento ahí. Esto es solo referencia.

---

## Colección `users/`

Una entrada por usuario. El ID del documento es el `uid` que Firebase Auth genera al crear la cuenta.

**Path:** `users/{uid}`

```
users/
  └── {uid}/
      ├── uid:          string   (mismo que el ID del documento)
      ├── email:        string
      ├── displayName:  string
      ├── plan:         "free" | "student" | "professional" | "industrial" | "studio"
      ├── role:         "user" | "admin"
      ├── createdAt:    timestamp
      ├── lastLogin:    timestamp
      └── preferences:  map
          ├── language:   "es" | "en" | "fr"
          └── newsletter: boolean
```

**Quién puede leerlo:** solo el dueño (controlado por Security Rules).
**Quién puede escribirlo:** el dueño puede actualizar `displayName` y `preferences`. El `plan` y `role` solo se cambian desde Cloud Functions (más adelante, cuando agreguemos pagos con Stripe).

---

## Colección `subscriptions/` (preparada, no se usa aún)

Una entrada por suscripción activa. Se va a llenar cuando integremos Stripe.

**Path:** `subscriptions/{subscriptionId}`

```
subscriptions/
  └── {subscriptionId}/
      ├── userId:           string  (UID del usuario dueño)
      ├── plan:             "professional" | "industrial" | "studio"
      ├── status:           "active" | "canceled" | "past_due" | "trialing"
      ├── billingCycle:     "monthly" | "annual"
      ├── currentPeriodEnd: timestamp
      ├── stripeSubId:      string  (id en Stripe — para cruzar con webhooks)
      ├── createdAt:        timestamp
      └── canceledAt:       timestamp | null
```

**Quién puede leerlo:** solo el dueño (matching `userId == auth.uid`).
**Quién puede escribirlo:** **nadie desde el cliente.** Solo desde Cloud Functions disparadas por webhooks de Stripe.

---

## Colección `payments/` (preparada, no se usa aún)

Historial de transacciones individuales. Una entrada por cada cobro exitoso o fallido.

**Path:** `payments/{paymentId}`

```
payments/
  └── {paymentId}/
      ├── userId:           string
      ├── subscriptionId:   string  (FK a subscriptions/)
      ├── amount:           number  (en centavos: 4900 = $49.00 USD)
      ├── currency:         "usd" | "mxn" | "eur"
      ├── status:           "succeeded" | "failed" | "refunded"
      ├── stripeChargeId:   string
      ├── description:      string  (ej: "Plan Profesional - Mayo 2026")
      └── createdAt:        timestamp
```

**Quién puede leerlo:** solo el dueño.
**Quién puede escribirlo:** solo Cloud Functions.

---

## Diagrama de relaciones

```
┌─────────────────┐
│ Firebase Auth   │
│  (sistema)      │
└────────┬────────┘
         │ genera uid
         ▼
┌─────────────────┐
│ users/{uid}     │  ← perfil del usuario
└────────┬────────┘
         │ userId
         ▼
┌─────────────────────┐
│ subscriptions/{id}  │  ← una suscripción activa
└────────┬────────────┘
         │ subscriptionId
         ▼
┌─────────────────┐
│ payments/{id}   │  ← historial de cargos
└─────────────────┘
```

---

## A futuro: colecciones que vamos a agregar

Cuando llegue el momento, aquí dejo planeadas las colecciones para features adicionales:

### `projects/` — diseños guardados del usuario

```
projects/
  └── {projectId}/
      ├── userId:        string
      ├── name:          string
      ├── thumbnailUrl:  string  (en Cloud Storage)
      ├── data:          map     (el JSON del diseño)
      ├── adaValid:      boolean
      ├── lastModified:  timestamp
      └── createdAt:     timestamp
```

### `templates/` — plantillas públicas de la comunidad

```
templates/
  └── {templateId}/
      ├── createdBy:     string  (uid del autor)
      ├── name:          string
      ├── category:      "ada" | "exterior" | "dimensional" | ...
      ├── downloads:     number
      ├── isPublic:      boolean
      └── createdAt:     timestamp
```

---

## Cómo monitorear costos

Las reglas que dejé minimizan lecturas/escrituras innecesarias:
- El perfil de usuario se lee **una vez al cargar el dashboard**
- `lastLogin` se actualiza solo cuando hay un login nuevo (no en cada page view)
- Los listados de subscriptions/payments cargan solo del usuario que las pide

Con esto, el free tier de Blaze ($300 mensuales gratis del trial inicial + free tier permanente) te debería alcanzar para los primeros cientos de usuarios sin pagar nada.

Si quieres ver consumo en tiempo real:
**Firebase Console → Firestore → Usage tab**
