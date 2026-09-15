# Project: DevFest 2026 Web App

This is the official website for DevFest 2026.

## Technology Stack

- **Framework:** Next.js 16 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Internationalization (i18n):** `next-intl` is used for localized routing and content.
  - Supported locales: English (`en`), French (`fr`)
  - Content is statically exported.

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## Key Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready static build.
- `npm run start`: Starts the production server (for serving the built files).
- `npm run lint`: Lints the code using ESLint.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run format`: Formats code with Prettier.
- `npm run check`: A comprehensive check that runs linting, type-checking, and a build.

## Project Structure

The project follows a standard Next.js App Router structure with specific conventions for internationalization.

```text
src/
├── app/
│   ├── [locale]/        # Pages and layouts for each language
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css      # Global styles
│   └── page.tsx         # Root page that redirects to the default locale
├── components/          # Reusable React components
├── i18n/                # Internationalization configuration (routing, navigation)
└── messages/            # Translation files (JSON) for each locale
    ├── en/
    └── fr/
```

## Development Conventions

- **Localization:** To add new translated text, add the keys to the respective `*.json` files in `src/messages/en/` and `src/messages/fr/`. Make sure to register any new namespace in `src/i18n/request.ts`.
- **Styling:** Use Tailwind CSS utility classes for styling. Global styles are in `src/app/globals.css`.
- **Code Quality:** This project uses ESLint for linting and Prettier for code formatting. Always run `npm run check` before committing to ensure code quality.

## Deployment

The application is configured for static export to be deployed on GitHub Pages. The `.github/workflows/nextjs.yml` workflow handles the deployment process automatically.
