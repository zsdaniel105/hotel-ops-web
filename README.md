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
- Dynamic Log Book entries created when requests are added, updated, completed, or deleted.
- Local browser persistence with `localStorage` under `hotel-ops-web:prototype:v3`.


## Front Desk Request Management

The Front Desk dashboard includes a compact **Requests** panel for all non-deleted Housekeeping Requests and Maintenance Issues. The panel provides **Open**, **Completed**, and **All** tabs with live counts. Open requests are sorted newest first, completed requests are sorted by completion time, and All is sorted by most recent activity.

Selecting a request opens the shared **Request Details** drawer. Front Desk can review the room, request type, status, details, quantity when applicable, note, creation time, last updated time, and completion metadata when present. The same drawer opens from the Requests panel and from active or completed request entries in Room Details.

Open requests can be edited, marked completed by Front Desk, or deleted. Completed requests can be edited or deleted, but cannot be completed again.

## Edit behavior

**Edit Request** allows Front Desk to change Room Number, Request Type, Request Item / Issue, Quantity for Housekeeping Requests, and Optional Note. The request ID, original creation timestamp, status, completion timestamp, completion actor, deletion timestamp, and deletion actor are preserved. Saving a real change records `updatedAt` and `updatedBy: Front Desk`; a no-op edit does not add audit noise.

Custom request details are preserved by initializing the details selector as `Other` and pre-filling the custom details field. Changing a Housekeeping Request to a Maintenance Issue clears quantity; changing a Maintenance Issue to a Housekeeping Request requires a whole-number quantity greater than zero.

## Soft deletion

**Delete Request** uses soft deletion. Deletion hides the request from Requests, Room Details, room indicators, department queues, and normal counts, but keeps the record in local prototype state for audit integrity. Restore and permanent deletion are intentionally not implemented.

## Audit Log Book

The Log Book keeps historical creation and completion entries and now adds concise update and deletion entries. Editing or deleting a request never rewrites older Log Book entries.

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

Created requests, edits, completions, soft deletions, completion metadata, update/delete metadata, and generated Log Book entries are stored only in the current browser's `localStorage` under state version 3 at `hotel-ops-web:prototype:v3`.

On load, the app checks for valid v3 state first. If unavailable, it checks valid v2 state, migrates each request by adding `updatedAt`, `updatedBy`, `deletedAt`, and `deletedBy`, preserves existing IDs, request content, completion metadata, and Log Book entries, then saves the migrated result as v3. If v2 is unavailable, valid v1 data is migrated directly to v3 by preserving the existing v1 behavior, setting requests to open, adding empty completion metadata, and adding v3 update/delete metadata. Malformed storage falls back to deterministic seeded v3 data without crashing.

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
npm run check
```

## Prototype limitations

This prototype intentionally does not include real authentication or server-enforced Front Desk permissions, employee accounts, a database, cross-device sharing, real-time synchronization, push/email/SMS notifications, individual employee assignment, additional task statuses, API routes, server actions, editable modules, or production persistence. Completion occurs within the same browser prototype.
