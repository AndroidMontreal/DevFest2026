# Project: DevFest Montreal 2026 Web App

This is the official website for **DevFest Montreal 2026** (November 6, 2026 at Ax.c Hub, downtown Montreal).

## Technology Stack

- **Framework:** Next.js 16 (App Router, static export via `output: 'export'`)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Internationalization (i18n):** `next-intl` for localized routing and content (`en` and `fr`).

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## Key Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready static build (`out/`).
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the code using ESLint.
- `npm run typecheck`: Runs the TypeScript compiler (`tsc --noEmit`) to check for type errors.
- `npm run format`: Formats code with Prettier.
- `npm run format:check`: Verifies code formatting with Prettier.
- `npm run check`: Runs linting, type-checking, and a production build.

## Project Structure

```text
src/
├── app/
│   ├── [locale]/              # Localized pages and layout (/en, /fr)
│   │   ├── agenda/            # Alias route re-exporting SchedulePage
│   │   ├── code-of-conduct/   # Code of Conduct page
│   │   ├── faq/               # Interactive FAQ page
│   │   ├── schedule/          # Event Agendas, Room tracks & TRON Space Navigator
│   │   ├── speakers/          # Confirmed Speakers grid with category filters & search
│   │   ├── team/              # Organizers team page
│   │   ├── layout.tsx         # Locale layout shell
│   │   └── page.tsx           # Home landing page
│   ├── globals.css            # Global styles and theme utilities
│   └── page.tsx               # Root page that redirects to the default locale
├── components/
│   ├── common/                # Shared layout & UI components
│   ├── faq/                   # FAQ accordion component
│   ├── gallery/               # Past editions photo gallery grid
│   ├── home/                  # Hero, stats, countdown HUD, ticker, about section, navigation
│   ├── schedule/              # Overall TL;DR agenda, room agendas, and TRON Space Navigator map
│   ├── speakers/              # Speakers grid, session badges, GDE/Googler pills, search & filter controls
│   └── sponsors/              # Partner & sponsor tier cards
├── i18n/                      # Internationalization configuration (routing, navigation, request)
└── messages/                  # Translation files (JSON) for each locale
    ├── en/
    └── fr/
```

## Development Conventions

- **Localization:** Keep `src/messages/en/*.json` and `src/messages/fr/*.json` in sync across all 12 namespaces (`common`, `metadata`, `header`, `home`, `gallery`, `footer`, `sponsors`, `team`, `schedule`, `speakers`, `code-of-conduct`, `faq`). Register any new namespace in `src/i18n/request.ts`.
- **Speaker & Schedule Sync:** When adding or moving a session in `src/messages/{en,fr}/schedule.json`, also update `SESSION_LOCATIONS` in `src/components/speakers/speakers-grid.tsx` and the room session arrays in `src/components/schedule/tron-space-navigator.tsx`. The schedule page supports deep-linking to specific room tabs via `/schedule?room=<roomId>#room-<roomId>`.
- **Styling:** Use Tailwind CSS utility classes for styling. Global styles and custom utility classes are in `src/app/globals.css`.
- **Code Quality:** Always run `npm run format` and `npm run check` before committing to ensure formatting, linting, types, and static export all pass cleanly.

## Deployment

The application is configured for static export to be deployed on GitHub Pages. The `.github/workflows/nextjs.yml` workflow handles the deployment process automatically.
