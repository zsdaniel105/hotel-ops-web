/** Minimal structural Cloudflare binding types; `wrangler types` may replace these in deployment. */
export interface D1Result<T = unknown> { results: T[]; success: boolean; meta?: Record<string, unknown> }
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
export interface D1Database { prepare(query: string): D1PreparedStatement; batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> }
export interface R2ObjectBody { body: ReadableStream; httpEtag: string; size: number; }
export interface R2Bucket { put(key: string, value: ReadableStream | ArrayBuffer, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }): Promise<unknown>; get(key: string): Promise<R2ObjectBody | null>; delete(key: string): Promise<void> }
export interface RealtimeNamespace { get(id: unknown): { fetch(request: Request): Promise<Response> }; idFromName(name: string): unknown }
export interface CloudflareEnv { DB: D1Database; ATTACHMENTS: R2Bucket; PROPERTY_REALTIME: RealtimeNamespace; LOCAL_DEV?: string; LOCAL_DEV_EMAIL?: string; ACCESS_AUD?: string; MAX_UPLOAD_BYTES?: string }

/**
 * Vinext exposes Worker bindings through its runtime adapter. Keeping resolution here
 * prevents bindings from leaking into browser modules and makes repositories testable.
 */
export function getCloudflareEnv(): CloudflareEnv {
  const bindings = (globalThis as typeof globalThis & { __HOTEL_OPS_ENV?: CloudflareEnv }).__HOTEL_OPS_ENV;
  if (!bindings?.DB) throw new Error("Cloudflare bindings are unavailable");
  return bindings;
}
