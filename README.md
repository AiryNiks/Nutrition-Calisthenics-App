# Mumbai Nutrition & Calisthenics Tracker

A local-first, high-density tracker built for Mumbai: quick-commerce (Blinkit/Zepto) grocery macros, custom recipe bases (makhani gravy, hung-curd marinades), and a calisthenics strength-to-weight engine that scores you against a shifting bodyweight baseline.

## Stack

Vite · React 18 · TypeScript (strict) · Tailwind CSS · Zustand (localStorage persist) · Lucide icons. No backend — all data stays in your browser.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Features

- **Macro tracking** against editable daily targets, grouped by meal slot.
- **Localized food DB** — Gokul/Amul/Mother Dairy lines, loose paneer, Zepto Farmers Market produce, Blinkit own-brand staples, ragi/bajra flours, prep bases.
- **Invoice console** — paste Blinkit/Zepto receipt text or JSON; the adapter chain parses, fuzzy-matches against the DB with confidence scores, and bulk-logs.
- **Recipe builder** — compose multi-ingredient bases with cooked-yield-aware per-100 g macros; save and log.
- **Strength-to-weight engine** — `((BW + added) / BW) × volumeRatio` per session; volume ratio is rep-based so dropping bodyweight at flat output raises your relative score.
- **iOS-feel motion** — spring cubic-beziers, press-scale feedback, reduced-motion respected. Haptics via the Web Vibration API (Android Chrome; iOS Safari ignores it silently).

## Data model

See `src/types.ts`. State persists under the `nc-store` localStorage key; theme under `nc-theme`.
