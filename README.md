# Hotel Ops Web

A Netlify-ready Next.js App Router demo for a compact hotel operations dashboard prototype.

## New prototype features

- Header **Create To-do** action for quick Front Desk entry.
- Shared searchable **Room Number** field for quick create and room-based request creation.
- Demo role switching for Front Desk, Housekeeping Supervisor, and Maintenance Manager views.
- Professional Front Desk request tabs for Open, In Progress, Needs Attention, Completed, Cancelled, and All requests.
- Department workspaces with New, In Progress, Unable, and Completed tabs, compact metrics, search, and operational sorting.
- Request priority with Normal and Urgent options; urgent active requests sort ahead of normal requests without turning rows bright red.
- Start Work, completion with optional resolution notes, Unable to Complete reporting, Front Desk reopen, cancellation, and soft deletion workflows.
- Request Activity timelines powered by linked Log Book entries.
- Active and recent room request groups with Housekeeping and Maintenance room indicators.
- Local browser persistence with `localStorage` under `hotel-ops-web:prototype:v4`.

## Demo roles

The header includes a compact **Demo role** selector with these prototype views:

- **Front Desk**: operational dashboard, room board, room search, quick request creation, full request management, Needs Attention review, cancellation, Room Details, and Log Book.
- **Housekeeping Supervisor**: Housekeeping Operations workspace for Housekeeping Requests only.
- **Maintenance Manager**: Maintenance Operations workspace for Maintenance Issues only.

Role switching is demo functionality only. It is not authentication, does not create user accounts, and does not enforce server-side permissions.

## Advanced Request Lifecycle

The primary operational path is:

```text
Open → In Progress → Completed
```

The alternate attention path is:

```text
Open / In Progress → Unable to Complete → Reopened or Cancelled
```

Departments start matching Open requests with **Start Work**. In Progress requests can then be completed with an optional resolution note or marked Unable to Complete with a role-specific reason and required note. Front Desk can complete active requests, reopen unable requests back to Open, cancel active or unable requests, edit requests, or soft-delete records that should be hidden from normal product views.

## Priority

Requests support **Normal** and **Urgent** priority. Normal is the default for newly created and migrated requests. Urgent requests display a compact badge and sort first in active queues; requests within the same priority sort oldest first so older operational work remains visible.

## Department Workspaces

Housekeeping and Maintenance dashboards include compact summary metrics for **New**, **In Progress**, **Needs Attention**, and **Completed Today**. Department tabs are:

- **New**: matching Open requests.
- **In Progress**: matching requests currently being worked.
- **Unable**: matching requests that require Front Desk attention.
- **Completed**: matching completed requests.

Department search matches room number, request details, and Front Desk notes. Active queues default to **Priority and Oldest** sorting, and completed work is shown newest first.

## Resolution and Unable Reporting

Completion supports optional resolution notes, such as what was delivered, reset, replaced, or verified. Unable to Complete requires a reason and a non-whitespace note explaining why the request could not be completed. Housekeeping and Maintenance use different reason lists. Unable requests remain active room issues and appear in Front Desk **Needs Attention** until Front Desk reopens or cancels them.

## Request Activity Timeline

Linked Log Book entries power both the property-level Log Book and each request's Activity timeline. Request details filter Log Book entries by `todoId`, sort them oldest first, and show event label, actor, exact timestamp, optional reason, and optional note.

## Cancellation and soft deletion

**Cancelled** means Front Desk intentionally withdrew an active or unable request and preserved it in normal operational history. Cancelled requests leave active queues and no longer create room indicators. **Delete** remains a soft-delete action for records that should be hidden from normal product views while retaining audit metadata.

## Indicator legend

- No icon = no active request.
- Green exclamation = active Housekeeping Request.
- Red exclamation = active Maintenance Issue.
- Both icons = both Housekeeping Request and Maintenance Issue are active.

Room indicators are produced by Open, In Progress, and Unable to Complete requests. Completed, Cancelled, and Deleted requests do not create room indicators.

## Prototype persistence and migration

Prototype state version 4 is stored under `hotel-ops-web:prototype:v4`. On load, the app checks valid v4 storage first, then valid v3, v2, and v1 storage. Legacy data is migrated to v4 by preserving IDs, room numbers, request types, details, quantities, notes, created metadata, updated metadata, completion metadata, deletion metadata, and existing Log Book messages. Migrated requests default to `priority: "NORMAL"` and receive the new workflow metadata fields.

Malformed storage falls back to deterministic seeded v4 data without crashing. Old storage keys are not deleted automatically. Persistence is browser-specific and device-specific; clearing browser storage removes created prototype data and returns the demo to seeded data.

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

This prototype intentionally does not include real authentication, employee accounts, a database, cross-device sharing, real-time synchronization, push/email/SMS notifications, individual employee assignment, comments or chat, photos, attachments, inventory deductions, automatic SLA escalation, API routes, server actions, editable Lost & Found, editable Calendar, editable Announcements, PMS integration, native applications, PWA installation, or production persistence.
