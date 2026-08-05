# Hotel Ops Web

A Netlify-ready Next.js App Router demo for a compact hotel operations dashboard prototype.

## New prototype features

- Header **Create To-do** action for quick Front Desk entry.
- Room-based to-do creation from the Room Details drawer.
- Room search by partial room number with floor grouping preserved.
- Housekeeping and Maintenance indicators derived from open to-dos.
- Local browser persistence with `localStorage` under `hotel-ops-web:prototype:v1`.
- Dynamic Log Book entries created when new to-dos are added.

## Indicator legend

- No icon = no active item.
- Green exclamation = Housekeeping Request.
- Red exclamation = Maintenance Issue.
- Both icons = both Housekeeping Request and Maintenance Issue active.

## Prototype persistence

Created to-dos and generated Log Book entries are stored only in the current browser's `localStorage`. This persistence is browser-specific and device-specific. It is not production multi-user persistence, and it is not shared between Front Desk and Housekeeping. Clearing browser storage removes created prototype data and returns the demo to seeded data.

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

## Prototype limitations

This prototype intentionally does not include a completion workflow, authentication, a database, real-time synchronization, a shared department view, department dashboards, API routes, server actions, editable modules, or production persistence.
