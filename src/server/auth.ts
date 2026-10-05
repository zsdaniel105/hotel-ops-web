import type { CloudflareEnv } from "./cloudflare";
import { AppError } from "./errors";
export type AppRole = "FRONT_DESK" | "HOUSEKEEPING" | "HOUSEKEEPING_SUPERVISOR" | "MAINTENANCE" | "MAINTENANCE_MANAGER" | "MANAGER" | "ADMIN";
export interface AuthUser { id: string; propertyId: string; email: string; displayName: string; role: AppRole; departmentId: string | null }
export async function authenticate(request: Request, env: CloudflareEnv): Promise<AuthUser> {
  // Cloudflare Access injects this header only after the Access policy succeeds. The
  // application never accepts a client email in production; the assertion remains
  // available for deployments that add full JWT verification at the edge wrapper.
  const accessEmail = (request as Request & { cf?: { access?: { authenticatedUserEmail?: string } } }).cf?.access?.authenticatedUserEmail;
  const localEmail = env.LOCAL_DEV === "true" ? request.headers.get("x-hotel-ops-dev-email") ?? env.LOCAL_DEV_EMAIL : null;
  const email = (accessEmail ?? localEmail)?.trim().toLowerCase();
  if (!email) throw new AppError("UNAUTHENTICATED", "Sign in through Cloudflare Access.", 401);
  const user = await env.DB.prepare(`SELECT id, property_id AS propertyId, email, display_name AS displayName, role, department_id AS departmentId FROM users WHERE email = ? AND active = 1`).bind(email).first<AuthUser>();
  if (!user) throw new AppError("FORBIDDEN", "Your Hotel Operations account is inactive or unavailable.", 403);
  return user;
}
export type Permission = "task.read" | "task.create" | "task.assign" | "task.work" | "task.comment" | "incident.read" | "admin.manage" | "attachment.manage";
const grants: Record<AppRole, ReadonlySet<Permission>> = {
  FRONT_DESK: new Set(["task.read","task.create","task.comment","incident.read","attachment.manage"]),
  HOUSEKEEPING: new Set(["task.read","task.work","task.comment","attachment.manage"]),
  HOUSEKEEPING_SUPERVISOR: new Set(["task.read","task.assign","task.work","task.comment","attachment.manage"]),
  MAINTENANCE: new Set(["task.read","task.work","task.comment","attachment.manage"]),
  MAINTENANCE_MANAGER: new Set(["task.read","task.assign","task.work","task.comment","attachment.manage"]),
  MANAGER: new Set(["task.read","task.create","task.assign","task.work","task.comment","incident.read","attachment.manage"]),
  ADMIN: new Set(["task.read","task.create","task.assign","task.work","task.comment","incident.read","admin.manage","attachment.manage"]),
};
export function authorize(user: AuthUser, permission: Permission): void { if (!grants[user.role].has(permission)) throw new AppError("FORBIDDEN", "You do not have permission for this action.", 403); }
