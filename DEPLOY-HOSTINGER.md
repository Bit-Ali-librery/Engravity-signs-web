# Guía de deployment a Hostinger — engravitysigns.com

Esta guía te lleva paso a paso desde tu carpeta local (`E:\Engravity- website`) hasta tener el sitio funcionando en `https://www.engravitysigns.com`.

---

## ¿Qué subir y qué NO subir?

### ✅ SÍ subir (todo lo necesario para que el sitio funcione)

```
✓ index.html
✓ 404.html
✓ .htaccess              ← muy importante, controla HTTPS, clean URLs, cache
✓ robots.txt
✓ sitemap.xml
✓ about/index.html
✓ blog/                  ← toda la carpeta (index + 6 artículos)
✓ changelog/index.html
✓ docs/index.html
✓ docs/quick-start.html
✓ download/index.html
✓ pricing/index.html
✓ showcase/index.html
✓ assets/images/*.png    ← todas las imágenes
✓ src/styles/global.css
✓ src/js/main.js
```

### ❌ NO subir (no son necesarios y consumen espacio)

```
✗ node_modules/          ← ENORME y solo sirve para desarrollo local
✗ package.json           ← config de Node, no se usa en producción
✗ package-lock.json      ← lock de dependencias
✗ vite.config.js         ← config del dev server
✗ copiar-imagenes.bat    ← script local
✗ setup-images.ps1       ← script local
✗ DEPLOY-HOSTINGER.md    ← este archivo (es solo para ti)
✗ ima/                   ← carpeta personal (revísala antes de borrar)
✗ 1.jpeg, 2.jpeg, Engra 1.jpeg, engravity signs.jpeg, novedades.jpeg
                         ← imágenes sueltas en raíz, no las usa el sitio
```

---

## Paso 1 — Comprime los archivos a subir

1. Abre `E:\Engravity- website` en el Explorador de Windows.
2. Selecciona **solo lo de la lista "SÍ subir"** (puedes seleccionar todo y luego deseleccionar lo de "NO subir").
3. Click derecho → **Enviar a → Carpeta comprimida (ZIP)**.
4. Nombra el zip `engravity-website.zip`.

**Tip**: para asegurarte que `.htaccess` se incluye en el zip, fíjate que aparezca en la previsualización (Windows a veces lo oculta porque empieza con punto — habilita "Mostrar archivos ocultos" si no lo ves).

---

## Paso 2 — Subir al hPanel de Hostinger

1. Entra a [hpanel.hostinger.com](https://hpanel.hostinger.com) con tus credenciales.
2. En la sección de tu hosting, busca **Files → File Manager** (Administrador de Archivos).
3. Navega a la carpeta `public_html/` (es la carpeta raíz del sitio web — todo lo que pongas ahí es lo que se sirve en `engravitysigns.com`).
4. **IMPORTANTE**: si ya hay archivos viejos en `public_html/` (como un `default.php` de prueba de Hostinger, o un sitio anterior), bórralos primero o muévelos a una subcarpeta como `_backup/`.
5. Click en **Upload** (botón con ícono de flecha hacia arriba) → arrastra `engravity-website.zip`.
6. Espera a que termine de subir.
7. Click derecho sobre el zip → **Extract** (Extraer).
8. Confirma extraer en `public_html/`.
9. Una vez extraído, borra el zip si quieres (ya no se necesita).

---

## Paso 3 — Verificar que `.htaccess` está activo

Hostinger usa Apache, que respeta `.htaccess` automáticamente. Para confirmar:

1. Abre `https://www.engravitysigns.com` — debería cargar la página principal.
2. Prueba escribir `http://engravitysigns.com` (sin https, sin www) — debería redirigir automáticamente a `https://www.engravitysigns.com`.
3. Prueba `https://www.engravitysigns.com/blog/madera-y-metal` (sin .html) — debería abrir el artículo.

Si algo de esto no funciona:
- Verifica que `.htaccess` se haya subido correctamente al `public_html/`.
- En el File Manager, click derecho en `.htaccess` → **Permissions** → debería ser `0644`.

---

## Paso 4 — Activar SSL (HTTPS)

Si todavía no está activo el certificado HTTPS:

1. En hPanel → **Security → SSL**.
2. Selecciona el dominio `engravitysigns.com`.
3. Click en **Install SSL** (Hostinger te da uno gratis con Let's Encrypt).
4. Espera 5-15 minutos a que se propague.
5. Prueba `https://www.engravitysigns.com` — debería cargar con candado verde.

---

## Paso 5 — Verificación post-deployment

Abre estas URLs y confirma que cargan bien:

- [ ] `https://www.engravitysigns.com/` (home)
- [ ] `https://www.engravitysigns.com/about/`
- [ ] `https://www.engravitysigns.com/pricing/`
- [ ] `https://www.engravitysigns.com/docs/`
- [ ] `https://www.engravitysigns.com/blog/`
- [ ] `https://www.engravitysigns.com/showcase/`
- [ ] `https://www.engravitysigns.com/download/`
- [ ] `https://www.engravitysigns.com/sitemap.xml`
- [ ] `https://www.engravitysigns.com/robots.txt`
- [ ] `https://www.engravitysigns.com/blog/madera-y-metal` (clean URL sin .html)
- [ ] Una URL inventada como `https://www.engravitysigns.com/no-existe` — debe mostrar tu 404

---

## Paso 6 — Submit a Google Search Console (opcional pero recomendado)

1. Entra a [search.google.com/search-console](https://search.google.com/search-console).
2. Agrega `engravitysigns.com` como propiedad.
3. Verifica la propiedad (Hostinger te puede agregar el TXT record).
4. Sube tu sitemap: `https://www.engravitysigns.com/sitemap.xml`.

Esto le dice a Google que tu sitio existe y le da el mapa completo de páginas.

---

## Errores comunes y cómo arreglarlos

### "El sitio carga pero los estilos no aparecen"
- Verifica que la carpeta `src/` se haya subido completa con `src/styles/global.css` adentro.
- Limpia caché del navegador (Ctrl+Shift+R).

### "Las imágenes no cargan"
- Verifica que `assets/images/` se subió completo.
- Algunas rutas usan `./assets/images/` (relativas), funcionan tanto en local como en producción si la estructura es la misma.

### "Aparece un error 500"
- Suele ser por una línea inválida en `.htaccess`. Renómbralo a `.htaccess.bak` temporalmente para ver si el sitio carga sin él. Si carga, revisa qué módulo de Apache no tienes habilitado en tu plan.

### "El dominio no apunta al sitio"
- Verifica en hPanel → **Domains** que `engravitysigns.com` esté listado y apuntando a este hosting.
- Si compraste el dominio en otro lado, actualiza los nameservers a los de Hostinger:
  - `ns1.dns-parking.com`
  - `ns2.dns-parking.com`
- La propagación DNS puede tardar 24-48 horas.

---

## Después del primer deployment

Para futuras actualizaciones, no necesitas volver a subir todo. Solo los archivos que cambiaron:

1. En el File Manager, abre la carpeta donde está el archivo modificado.
2. Borra el archivo viejo, sube el nuevo.
3. O usa la opción **Edit** del File Manager para hacer cambios chicos directo en el navegador.

Cuando subas un cambio en CSS o JS y no lo veas reflejado, sube el número de versión en los `<link>` y `<script>` (de `?v=8` a `?v=9`) para forzar refresh del caché del navegador.

---

¿Dudas? Avísanos cualquier cosa que no funcione.
