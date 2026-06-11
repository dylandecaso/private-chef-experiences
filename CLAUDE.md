# Private Chef Experiences — Emanuel Aciar

Landing page de una sola página (one-page) para un chef privado, con panel de
administración para editar el contenido. Bilingüe (Español / Inglés).

## Stack

- **React 19** + **Vite 8** (sin TypeScript — todo `.jsx`)
- **Tailwind CSS v4** vía `@tailwindcss/vite` (NO hay `tailwind.config.js`; los
  tokens de marca viven en `@theme` dentro de `src/index.css`)
- **React Router** (`react-router-dom`) — solo para separar el sitio público
  de `/admin`
- **Vercel** para hosting + **funciones serverless** (`api/`) + **Vercel Blob**
  (almacén del contenido editable e imágenes)
- **Resend** para el formulario de contacto (envío de emails)
- **Google OAuth** (`@react-oauth/google`) para el login del panel admin

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (Vite) → http://localhost:5173
npm run build      # build de producción (sale a dist/)
npm run preview    # previsualizar el build
npm run lint       # ESLint
```

> Nota: las funciones de `api/` NO corren con `npm run dev` (eso es solo Vite).
> Para probar el backend localmente se usa `vercel dev`. En producción Vercel
> las sirve automáticamente.

## Estructura

```
src/
  main.jsx                 # entry; monta el router (sitio público + /admin)
  App.jsx                  # arma el sitio público (orden de las secciones)
  index.css                # Tailwind v4 + tokens de marca (@theme) + animaciones
  components/              # secciones del sitio público
    Header.jsx             # nav fija, responsive, toggle EN/ES, CTA
    Hero.jsx               # video de fondo + eyebrow + botón CTA
    HeroBio.jsx            # 3 párrafos de bio + video de fondo + audio narración
    HeroAudioButton.jsx    # chip de audio (narración del bio)
    Services.jsx, Experiences.jsx, Gallery.jsx, FinalCTA.jsx,
    ContactForm.jsx, Footer.jsx, WhatsAppButton.jsx
    navLinks.js            # fuente única de los links del nav (Header + Footer)
  i18n/
    LanguageContext.jsx    # estado del idioma (EN/ES) + hook useLanguage()
    translations.js        # textos de UI fijos (nav, labels, etc.)
  content/
    ContentContext.jsx     # carga el contenido editable (del Blob / fallback)
    defaultContent.js      # contenido por defecto (seed + fallback)
  admin/                   # panel /admin
    AdminApp.jsx, AdminLogin.jsx, AuthContext.jsx
    editors/               # un editor por sección (HeroEditor, etc.)
  lib/                     # helpers (contactLinks, etc.)

api/                       # funciones serverless de Vercel
  content.js               # GET contenido público
  contact.js               # POST formulario de contacto (Resend)
  admin/                   # endpoints protegidos (content, upload, delete-image)
  _lib/                    # blobStore (Vercel Blob) + verifyAdmin (OAuth)

public/
  videos/                  # videos de fondo (hero-desktop.mp4, etc.)
  images/                  # imágenes (hero, experiences, gallery)
```

## Contenido editable vs. textos fijos

- **Contenido editable** (textos de las secciones, imágenes, videos): vive en
  `defaultContent.js` como seed/fallback y se sobrescribe desde `/admin`, que
  guarda en **Vercel Blob**. Se lee vía `ContentContext` / `useContent()`.
- **Textos de UI fijos** (labels del nav, botones): en `i18n/translations.js`,
  leídos con `t('clave')` del `useLanguage()`.
- Cada campo bilingüe es un objeto `{ en: '...', es: '...' }`. Se selecciona con
  un helper `pick(field)` = `field?.[lang] ?? field?.en ?? ''`.

## Tokens de marca (colores)

Definidos en `src/index.css` dentro de `@theme`. Se usan como utilidades de
Tailwind (`text-gold`, `bg-ink`, `border-line`, etc.):

- `ink` `#050505` (fondo principal), `ink-2`, `ink-3`
- `gold` `#c49a5a` (acento), `bronze` `#8a6a3a`
- `cream` `#f5f1ea` (texto), `muted` `#b8b2a8`
- `line` = gold @ 25% (bordes sutiles)
- Fuentes: `font-serif` (Playfair Display) para títulos/marca, `font-sans`
  (Inter) para el cuerpo.

## Variables de entorno

Definidas en `.env.local` (NO se commitea) — ver `.env.example` para la lista
completa:

- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — formulario de contacto
- `VITE_GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_ID` — login del admin (Google OAuth)
- `ADMIN_EMAILS` — whitelist de emails permitidos en `/admin`
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (auto-inyectado en producción)

En producción estas variables se configuran en el dashboard de Vercel
(Project → Settings → Environment Variables).

## Deploy

- **Hosting:** Vercel. Cada push a `main` despliega automáticamente.
- **SPA rewrites:** `vercel.json` reenvía todo a `index.html` excepto `api/`,
  `videos/`, `images/`, `assets/` y archivos con extensión.
- **Repo:** https://github.com/dylandecaso/private-chef-experiences

## Convenciones

- Responsive: breakpoints de Tailwind por defecto (`sm` 640, `md` 768,
  `lg` 1024, `xl` 1280). El `Header` tiene tiers cuidados: móvil (hamburguesa),
  banda compacta `lg` (1024–1279), y completo `xl` (≥1280). Probar SIEMPRE en
  **español** (etiquetas más largas = peor caso) al tocar el layout del header.
- Los videos van versionados en el repo (`public/videos/`), no en Blob.
- Animaciones y respeto a `prefers-reduced-motion` se definen en `index.css`.
- Commits y push: solo a `main`. El deploy es automático tras el push.
