# DevFest 2026 Web App

Base website project for **DevFest 2026**, built with Next.js App Router, static export, and localized routing (`/en`, `/fr`) without middleware/proxy.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- next-intl

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```text
src/
├── app/
│   ├── [locale]/        # Locale pages + locale layout
│   ├── globals.css
│   └── page.tsx         # Redirects "/" to default locale
├── i18n/
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
└── messages/
    ├── en/
    └── fr/
```

## Localization pattern

- Add new message namespaces under `src/messages/en/*.json` and `src/messages/fr/*.json`.
- Register namespaces in `src/i18n/request.ts`.
- Use namespaces in components/pages with `getTranslations` or `useTranslations`.

## Developer experience scripts

- `npm run lint` – ESLint
- `npm run typecheck` – TypeScript check
- `npm run format` – Prettier write
- `npm run format:check` – Prettier check
- `npm run check` – lint + typecheck + build

## GitHub Pages deployment

- Static export is enabled via `output: 'export'`.
- `next.config.ts` automatically sets `basePath`/`assetPrefix` during GitHub Actions builds.
- Workflow file: `.github/workflows/nextjs.yml`.
