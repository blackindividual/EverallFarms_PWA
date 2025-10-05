# EverallFarm_Lite PWA (Foundation)

Installable, offline-first PWA scaffold matching the Lite app’s monochrome style.

What’s ready
- PWA plugin + manifest (standalone, black/white, autoUpdate)
- Service worker registered; app shell precached
- iOS meta tags and Apple touch icon
- Tailwind + Poppins with black/white base styles
- Clean vertical MVVM folders (empty placeholders)

Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview the build
- `npm run icons` – generate icons from `public/logo-source.png`

Icons
1) Place your PNG at `public/logo-source.png` (square recommended).
2) Run `npm run icons`.
3) This writes: `public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png`, and `apple-touch-icon-180.png`.

Structure (high-level)
- `src/app/` – app setup (PWA registration), later: routes/theme
- `src/core/` – shared types/utilities/constants
- `src/features/<feature>/{model,vm,ui,data}` – vertical MVVM per feature
- `src/data/` – Dexie DB + repositories (coming next)
