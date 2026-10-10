# DevFest Montreal 2026 Web App

Official website for **DevFest Montreal 2026** (8th Edition · November 6, 2026 at Ax.c Hub), built with Next.js 16 App Router, static export, and localized routing (`/en`, `/fr`).

## Stack

- **Framework:** Next.js 16 (App Router, `output: 'export'`)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Internationalization:** `next-intl` (`en` and `fr` locales)
- **Icons & Motion:** `lucide-react`, `react-icons`, `framer-motion`

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
│   ├── [locale]/              # Localized routes (/en, /fr)
│   │   ├── agenda/            # Alias route re-exporting SchedulePage
│   │   ├── code-of-conduct/   # Code of Conduct page
│   │   ├── faq/               # Interactive FAQ page
│   │   ├── schedule/          # Event Agendas, Room tracks & TRON Space Navigator
│   │   ├── speakers/          # Confirmed Speakers grid with category filters & search
│   │   ├── team/              # Organizers team page
│   │   ├── layout.tsx         # Locale shell (header, footer, providers)
│   │   └── page.tsx           # Home landing page (hero, stats, about, gallery, sponsors)
│   ├── globals.css            # Global styles, retro 80s & blueprint grid utilities
│   └── page.tsx               # Root redirect to default locale
├── components/
│   ├── common/                # Shared layout & UI components (header shell, footer, section header, social links)
│   ├── faq/                   # FAQ accordion component
│   ├── gallery/               # Past editions photo gallery grid
│   ├── home/                  # Hero, stats, countdown HUD, ticker, about section, navigation
│   ├── schedule/              # Overall TL;DR agenda, room agendas, and interactive TRON Space Navigator map
│   ├── speakers/              # Speakers grid, session badges, GDE/Googler pills, search & filter controls
│   └── sponsors/              # Partner & sponsor tier cards
├── i18n/
│   ├── navigation.ts          # Localized Link & navigation helpers
│   ├── request.ts             # next-intl namespace loader
│   └── routing.ts             # Supported locales & default locale config
└── messages/
    ├── en/                    # English translation JSON namespaces
    └── fr/                    # French translation JSON namespaces
```

## Localization & data sync

- Add or update message keys in both `src/messages/en/*.json` and `src/messages/fr/*.json`:
  - `common.json`, `metadata.json`, `header.json`, `home.json`, `gallery.json`, `footer.json`, `sponsors.json`, `team.json`, `schedule.json`, `speakers.json`, `code-of-conduct.json`, `faq.json`
- Register any new namespace in `src/i18n/request.ts`.
- Consume translations in Server/Client components with `getTranslations` or `useTranslations`.
- When adding or moving a session in `src/messages/{en,fr}/schedule.json`, also update `getSessionLocation` in `src/components/speakers/speakers-grid.tsx` and the room metadata in `src/components/schedule/tron-space-navigator.tsx`. The schedule page supports deep-linking to specific room tabs via `/schedule?room=<roomId>#room-<roomId>`.

## Developer experience scripts

- `npm run dev` – Start local Next.js development server
- `npm run build` – Build static production export (`out/`)
- `npm run lint` – Run ESLint
- `npm run lint:fix` – Run ESLint with automatic fixes
- `npm run typecheck` – Run TypeScript compiler check (`tsc --noEmit`)
- `npm run format` – Format codebase with Prettier
- `npm run format:check` – Verify formatting with Prettier
- `npm run check` – Run `lint` + `typecheck` + `build`

## GitHub Pages deployment

- Static export is enabled via `output: 'export'` in `next.config.ts`.
- Workflow file: `.github/workflows/nextjs.yml`.

## CI parity check (local Docker)

To run the same install/build flow used in GitHub Actions:

```bash
docker build -f Dockerfile.ci -t devfest2026-ci .
```

## Makefile shortcuts

```bash
make ci
make lint
make build
make check
make docker-ci
```
