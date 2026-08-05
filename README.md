# Hotel Ops Web

A Netlify-ready Next.js App Router demo for a compact hotel operations dashboard prototype.

## New prototype features

- Header **Create To-do** action for quick Front Desk entry.
- Shared searchable **Room Number** field for quick create and room-based to-do creation.
- Room search by partial room number with floor grouping preserved.
- Demo role switching for Front Desk, Housekeeping Supervisor, and Maintenance Manager views.
- Housekeeping and Maintenance queues with department completion actions.
- Active and recently completed to-dos in Room Details.
- Housekeeping and Maintenance indicators derived only from open to-dos.
- Dynamic Log Book entries created when to-dos are added or completed.
- Local browser persistence with `localStorage` under `hotel-ops-web:prototype:v2`.

## Demo roles

The header includes a compact **Demo role** selector with these prototype views:

- **Front Desk**: operational dashboard, room board, room search, quick to-do creation, Room Details, completed room history, and Log Book.
- **Housekeeping Supervisor**: focused Housekeeping queue for open guest and room requests, plus recently completed Housekeeping requests.
- **Maintenance Manager**: focused Maintenance queue for open maintenance issues, plus recently completed Maintenance issues.

Role switching is demo functionality only. It is not authentication, does not create user accounts, and does not enforce server-side permissions.

## Completion workflow

The prototype supports a single-browser cross-department workflow:

Front Desk creates a Housekeeping Request or Maintenance Issue → the matching department role sees it in an open queue → the department marks it completed → Front Desk sees the completed result in Room Details and the Log Book.

Completed items store a completion timestamp and readable role label, such as `Housekeeping Supervisor` or `Maintenance Manager`.

## Searchable Room Number field

The shared Room Number field is a searchable combobox:

- Users can type directly to filter by room number.
- Options display numeric room numbers only, such as `204`, without repeating `Room` in every option.
- Floor headings may group results.
- Only valid hotel room numbers may be selected or submitted.
- Invalid typed room numbers are rejected with `Select a valid room number.`

## Indicator legend

- No icon = no active item.
- Green exclamation = open Housekeeping Request.
- Red exclamation = open Maintenance Issue.
- Both icons = both Housekeeping Request and Maintenance Issue are open.

Indicators are derived only from open to-dos. Completing one type removes only that type's indicator, and completed items never create indicators.

## Prototype persistence and migration

Created to-dos, completed to-dos, completion metadata, and generated Log Book entries are stored only in the current browser's `localStorage` under state version 2.

On load, the app first checks `hotel-ops-web:prototype:v2`. If no valid v2 state exists, it checks `hotel-ops-web:prototype:v1`, migrates valid v1 to-dos by adding `completedAt: null` and `completedBy: null`, preserves existing IDs and Log Book entries, and saves the migrated result as v2. Malformed storage falls back to deterministic seeded v2 data without crashing.

Persistence is browser-specific and device-specific. Clearing browser storage removes created prototype data and returns the demo to seeded data.

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

This prototype intentionally does not include real authentication, employee accounts, a database, cross-device sharing, real-time synchronization, push/email/SMS notifications, individual employee assignment, additional task statuses, API routes, server actions, editable modules, or production persistence. Completion occurs within the same browser prototype.
