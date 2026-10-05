# Hotel Ops v2 architecture

Hotel Ops remains one Next.js application. The production boundary is one Cloudflare Worker with D1 (`DB`) as the operational source of truth, a private R2 bucket (`ATTACHMENTS`), and one Durable Object namespace (`PROPERTY_REALTIME`) keyed by property. Browser storage remains untouched solely for prototype regression and a future explicit import; it is not a production fallback.

All records are scoped by `property_id`. API mutations follow authenticate → authorize → validate → parameterized D1 write/batch → audit → small realtime invalidation. The initial APIs demonstrate that boundary for sessions, tasks, and task comments. Central permission grants deny unknown capabilities. Growing queues are cursor/limit bounded. Important mutable rows carry a version for optimistic concurrency.

The migrations cover existing module snapshots plus normalized operational tasks, assignments, comments, notifications, attachments, recurrence, inspections, assets, MOD notes, calendar events, SLA rules, and append-only audit events. Signed/template-dependent records retain immutable JSON snapshots. Production initialization contains configuration only and never fake guest or employee data.

## Privacy and security

Cloudflare Access is the authentication perimeter. Runtime code reads the Access-authenticated identity from Worker request metadata and maps it to an active internal user; production never trusts a client-supplied email or role. Local identity headers are accepted only when `LOCAL_DEV=true`. D1 and R2 bindings remain server-only. Attachment objects use generated keys and require an authorized metadata lookup before retrieval. The configured MIME allowlist is JPEG, PNG, WebP, and PDF with a 10 MiB default; malware scanning is not implemented.

Incident and Lost & Found records are marked sensitive and must be filtered by module policy before search or retrieval. Realtime messages contain identifiers/invalidation types, not complete records. User-entered text is rendered as React text, never raw HTML.

## Migration state

The legacy UI continues to use validated localStorage while server-backed screens are integrated incrementally. This avoids silently destroying prototype data, but means the visible legacy modules are not yet production-migrated. No dual-write or silent D1 fallback exists.
