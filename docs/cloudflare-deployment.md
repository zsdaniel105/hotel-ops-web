# Cloudflare deployment

## Prerequisites

Use a current Node 24 release and Cloudflare Wrangler/vinext versions supported by the current Cloudflare Next.js Workers guide. Package installation in the delivery environment blocked those packages with HTTP 403, so they are intentionally not represented by fabricated lock entries. Before deployment, install the documented adapter and Wrangler with npm, regenerate the lockfile, and replace the explicit D1 placeholder in `wrangler.jsonc` with the created resource ID.

## Resource setup

1. Run `npx wrangler login` and `npx wrangler d1 create hotel-ops`.
2. Copy the returned real ID into the `DB` entry in `wrangler.jsonc`.
3. Run `npx wrangler r2 bucket create hotel-ops-attachments`. Keep the bucket private.
4. Generate types with `npx wrangler types src/types/cloudflare-env.d.ts`.
5. Apply locally with `npx wrangler d1 migrations apply hotel-ops --local`; apply production with `npx wrangler d1 migrations apply hotel-ops --remote`.
6. Bootstrap the first administrator explicitly (never commit their email): insert a user whose normalized Access email, property, and role (`ADMIN`) are reviewed by the owner.
7. In Cloudflare Zero Trust, create a self-hosted Access application for the Worker hostname, add the intended workforce policy, and deny all other identities. Never set `LOCAL_DEV=true` in production.
8. In Workers Builds, connect `zsdaniel105/hotel-ops-web`, select the feature/main branch as appropriate, configure the supported vinext build/deploy commands, and retain the D1, R2, Durable Object, assets, and cron bindings from `wrangler.jsonc`.
9. Set `ACCESS_AUD` and any adapter-required variables/secrets using Workers settings or `wrangler secret put`; do not commit them.
10. Deploy, then verify: Access login, inactive-user rejection, property isolation, task create/comment, private attachment denial, realtime reconnect, cron idempotency, and incident PDF rendering.

## Local development

Copy `.dev.vars.example` to `.dev.vars`, change the example identity to a matching locally seeded user, apply migrations, and run the adapter's local Worker preview. The normal `npm run dev` command remains available for the legacy Next.js UI. The local identity banner/UI integration remains outstanding; never copy local bypass variables to production.

## Known limitations

The current implementation is a server foundation rather than a completed production migration: the legacy screens still use localStorage; R2 handlers, Durable Object implementation, recurrence cron handler, Access audience/JWT fallback validation, global search, notification UI, and new-module UI are not complete. No Cloudflare resources were created and no deployment was attempted. Malware scanning is not present.
