# Hotel Ops Web

A Netlify-ready Next.js App Router demo for a hotel operations dashboard foundation.

## Included in this PR

- TypeScript, Tailwind CSS, ESLint, npm, and the `src/` directory structure.
- `@/*` import alias configured in TypeScript.
- Responsive English-only application shell.
- Static demo dashboard tiles for Lost & Found, Announcements, Calendar, and Log Book.
- 180 compact room tiles grouped by floor, with 30 rooms on each of six floors.
- Green `Clear` status and red `Open item` status with visible text and icon indicators.
- Seeded open items for Rooms 204, 317, and 508.
- Accessible room-detail dialog with non-functional placeholder request actions.

## Getting started

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Product limitations

This foundation is static demo content only. It does not include request creation, request completion, role switching, localStorage, a database, authentication, API routes, server actions, editable modules, Vitest, or React Testing Library.
