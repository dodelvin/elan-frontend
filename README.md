# ÉLAN — High-End Lifestyle Wellness Mobile Application

Senior Design Project (SITE-4790) — Frontend.

A premium wellness mobile application built with React + TypeScript, wrapped
natively for iOS via Capacitor, with a Node.js/Express backend and Firebase
Firestore database.

## Tech stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, React Router v7
- **Charts**: Recharts (used in the Analytics screen)
- **Icons**: lucide-react
- **i18n**: built-in language context (Azerbaijani / English / Russian)
- **Native wrapper**: Capacitor (iOS) — added in a later phase
- **Backend**: Node.js + Express — separate repository / folder
- **Database**: Firebase Cloud Firestore

## Project structure

```
src/
├── main.tsx                  Entry point — mounts <App /> on #root
├── styles/
│   ├── index.css             Imports globals
│   ├── globals.css           Design tokens (colors, typography), Tailwind base
│   └── default_theme.css     Extra theme variables
└── app/
    ├── App.tsx               Top-level router and layout shell
    ├── contexts/
    │   └── LanguageContext   i18n provider (az / en / ru)
    ├── translations/
    │   └── index.ts          All UI strings in 3 languages
    ├── components/
    │   ├── MobileLayout.tsx  Shared shell with bottom navigation
    │   ├── Card.tsx          Rounded white card with shadow
    │   ├── Button.tsx        Primary / secondary / outline / ghost button
    │   └── ElanLogo.tsx      Brand wordmark
    └── pages/                21 screens (one file each)
```

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

## Build for production

```bash
npm run build
npm run preview
```

## Team

- Ulkar Iskandarli (ID: 17482) — Team Lead
- Elvin Aliyev (ID: 11525)

Faculty Supervisor: Minura Hajisoy
