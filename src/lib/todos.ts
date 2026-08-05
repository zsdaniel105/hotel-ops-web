import { REQUEST_TYPE_PRESENTATION, STATUS_PRESENTATION, isActiveStatus } from "@/lib/presentation";
import type { ActorLabel, DemoRole, LogBookEntry, Todo, TodoPriority, TodoStatus, TodoType } from "@/types/hotel-operations";
export const HOUSEKEEPING_OPTIONS = ["Towel Set", "Extra Towels", "Extra Pillows", "Toiletries", "Linen Replacement", "Missing Room Item", "Missing Robe", "Other"] as const;
export const MAINTENANCE_OPTIONS = ["Air Conditioner Not Cooling", "Television Not Working", "Sink Leaking", "Slow-Draining Sink", "Toilet Issue", "Door Lock Issue", "Lighting Issue", "Other"] as const;
export const HOUSEKEEPING_UNABLE_REASONS = ["Do Not Disturb", "Guest Refused", "No Room Access", "Item Unavailable", "Duplicate Request", "Wrong Department", "Other"] as const;
export const MAINTENANCE_UNABLE_REASONS = ["Parts Required", "Vendor Required", "No Room Access", "Issue Not Found", "Duplicate Issue", "Wrong Department", "Other"] as const;
export const CANCELLATION_REASONS = ["Guest No Longer Needs Item", "Issue Resolved", "Duplicate Request", "Request Entered in Error", "Guest Checked Out", "Other"] as const;
export const ROLE_LABELS: Record<DemoRole, ActorLabel> = { FRONT_DESK: "Front Desk", HOUSEKEEPING_SUPERVISOR: "Housekeeping Supervisor", MAINTENANCE_MANAGER: "Maintenance Manager" };
export type TodoDraft = { roomNumber: number; type: TodoType; priority: TodoPriority; details: string; quantity: number | null; note: string | null };
export type TodoUpdate = TodoDraft;
export function getTodoTypeLabel(type: TodoType): string { return REQUEST_TYPE_PRESENTATION[type].label; }
export function getTodoTypeShortLabel(type: TodoType): string { return REQUEST_TYPE_PRESENTATION[type].shortLabel; }
export function getStatusLabel(status: TodoStatus): string { return STATUS_PRESENTATION[status].label; }
export function createStableId(prefix: string): string { if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`; return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }
export function getTodoTypeForRole(role: DemoRole): TodoType | null { if (role === "HOUSEKEEPING_SUPERVISOR") return "HOUSEKEEPING_REQUEST"; if (role === "MAINTENANCE_MANAGER") return "MAINTENANCE_ISSUE"; return null; }
function canAct(todo: Todo, role: DemoRole): boolean { const type = getTodoTypeForRole(role); return Boolean(type && todo.type === type); }
function cleanNote(note: string | null | undefined): string | null { return note?.trim() || null; }
export function createTodo(draft: TodoDraft, createdAt = new Date().toISOString()): Todo { return { id: createStableId("todo"), ...draft, quantity: draft.type === "HOUSEKEEPING_REQUEST" ? draft.quantity : null, note: cleanNote(draft.note), status: "OPEN", createdAt, updatedAt: createdAt, updatedBy: "Front Desk", startedAt: null, startedBy: null, completedAt: null, completedBy: null, resolutionNote: null, unableAt: null, unableBy: null, unableReason: null, unableNote: null, cancelledAt: null, cancelledBy: null, cancellationReason: null, deletedAt: null, deletedBy: null }; }
export function updateTodoRecord(todo: Todo, draft: TodoUpdate, actor: ActorLabel, updatedAt = new Date().toISOString()): Todo | null { if (todo.status === "DELETED") return null; const normalized = { ...draft, quantity: draft.type === "HOUSEKEEPING_REQUEST" ? draft.quantity : null, note: cleanNote(draft.note) }; const routeChanged = normalized.roomNumber !== todo.roomNumber || normalized.type !== todo.type; const changed = routeChanged || normalized.priority !== todo.priority || normalized.details !== todo.details || normalized.quantity !== todo.quantity || normalized.note !== todo.note; if (!changed) return null; let next: Todo = { ...todo, ...normalized, updatedAt, updatedBy: actor }; if (routeChanged && (todo.status === "IN_PROGRESS" || todo.status === "UNABLE_TO_COMPLETE")) next = { ...next, status: "OPEN", startedAt: null, startedBy: null, unableAt: null, unableBy: null, unableReason: null, unableNote: null }; return next; }
export function startTodo(todo: Todo, role: DemoRole, startedAt = new Date().toISOString()): Todo | null { if (todo.status !== "OPEN" || !canAct(todo, role)) return null; const actor = ROLE_LABELS[role]; return { ...todo, status: "IN_PROGRESS", startedAt, startedBy: actor, updatedAt: startedAt, updatedBy: actor }; }
export function completeTodo(todo: Todo, role: DemoRole, note?: string, completedAt = new Date().toISOString()): Todo | null { const actor = ROLE_LABELS[role]; const frontDeskAllowed = role === "FRONT_DESK" && (todo.status === "OPEN" || todo.status === "IN_PROGRESS"); const deptAllowed = canAct(todo, role) && todo.status === "IN_PROGRESS"; if ((!frontDeskAllowed && !deptAllowed) || todo.status === "DELETED") return null; return { ...todo, status: "COMPLETED", completedAt, completedBy: actor, resolutionNote: cleanNote(note), unableAt: null, unableBy: null, unableReason: null, unableNote: null, updatedAt: completedAt, updatedBy: actor }; }
export function markTodoUnable(todo: Todo, role: DemoRole, reason: string, note: string, unableAt = new Date().toISOString()): Todo | null { const clean = cleanNote(note); if (todo.status !== "IN_PROGRESS" || !canAct(todo, role) || !reason || !clean) return null; const actor = ROLE_LABELS[role]; return { ...todo, status: "UNABLE_TO_COMPLETE", unableAt, unableBy: actor, unableReason: reason, unableNote: clean, updatedAt: unableAt, updatedBy: actor }; }
export function reopenTodo(todo: Todo, role: DemoRole, reopenedAt = new Date().toISOString()): Todo | null { if (role !== "FRONT_DESK" || todo.status !== "UNABLE_TO_COMPLETE") return null; return { ...todo, status: "OPEN", startedAt: null, startedBy: null, unableAt: null, unableBy: null, unableReason: null, unableNote: null, updatedAt: reopenedAt, updatedBy: "Front Desk" }; }
export function cancelTodo(todo: Todo, role: DemoRole, reason: string, cancelledAt = new Date().toISOString()): Todo | null { const clean = cleanNote(reason); if (role !== "FRONT_DESK" || !clean || !(todo.status === "OPEN" || todo.status === "IN_PROGRESS" || todo.status === "UNABLE_TO_COMPLETE")) return null; return { ...todo, status: "CANCELLED", cancelledAt, cancelledBy: "Front Desk", cancellationReason: clean, updatedAt: cancelledAt, updatedBy: "Front Desk" }; }
export function deleteTodo(todo: Todo, actor: ActorLabel, deletedAt = new Date().toISOString()): Todo | null { if (todo.status === "DELETED") return null; return { ...todo, status: "DELETED", deletedAt, deletedBy: actor, updatedAt: deletedAt, updatedBy: actor }; }
export function getVisibleTodos(todos: Todo[]): Todo[] { return todos.filter((todo) => todo.status !== "DELETED"); }
export function getActiveTodos(todos: Todo[]): Todo[] { return todos.filter((todo) => isActiveStatus(todo.status)); }
function compareCreatedThenId(a: Todo, b: Todo): number {
  const created = a.createdAt.localeCompare(b.createdAt);
  return created || a.id.localeCompare(b.id);
}

function compareUpdatedNewestThenId(a: Todo, b: Todo): number {
  const updated = b.updatedAt.localeCompare(a.updatedAt);
  return updated || compareCreatedThenId(a, b);
}

export function sortPriorityOldest(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "URGENT" ? -1 : 1;
    return compareCreatedThenId(a, b);
  });
}
export function getOpenTodos(todos: Todo[]): Todo[] { return sortPriorityOldest(todos.filter((todo) => todo.status === "OPEN")); }
export function getInProgressTodos(todos: Todo[]): Todo[] { return sortPriorityOldest(todos.filter((todo) => todo.status === "IN_PROGRESS")); }
export function getUnableTodos(todos: Todo[]): Todo[] { return sortPriorityOldest(todos.filter((todo) => todo.status === "UNABLE_TO_COMPLETE")); }
export function getCompletedTodos(todos: Todo[]): Todo[] {
  return todos
    .filter((todo) => todo.status === "COMPLETED")
    .sort((a, b) => {
      const completed = (b.completedAt ?? b.updatedAt).localeCompare(a.completedAt ?? a.updatedAt);
      return completed || compareCreatedThenId(a, b);
    });
}
export function getCancelledTodos(todos: Todo[]): Todo[] {
  return todos
    .filter((todo) => todo.status === "CANCELLED")
    .sort((a, b) => {
      const cancelled = (b.cancelledAt ?? b.updatedAt).localeCompare(a.cancelledAt ?? a.updatedAt);
      return cancelled || compareCreatedThenId(a, b);
    });
}
export function getAllVisibleTodos(todos: Todo[]): Todo[] {
  return getVisibleTodos(todos).sort(compareUpdatedNewestThenId);
}
export function getTodosForRoom(todos: Todo[], roomNumber: number): Todo[] { return sortPriorityOldest(getActiveTodos(todos).filter((todo) => todo.roomNumber === roomNumber)); }
export function getCompletedTodosForRoom(todos: Todo[], roomNumber: number): Todo[] { return getCompletedTodos(todos).filter((todo) => todo.roomNumber === roomNumber); }
export function getCancelledTodosForRoom(todos: Todo[], roomNumber: number): Todo[] { return getCancelledTodos(todos).filter((todo) => todo.roomNumber === roomNumber); }
export function getTodosForRole(todos: Todo[], role: DemoRole, status?: TodoStatus): Todo[] { const type = getTodoTypeForRole(role); if (!type) return []; const scoped = todos.filter((todo) => todo.type === type && todo.status !== "DELETED" && todo.status !== "CANCELLED" && (!status || todo.status === status)); return status === "COMPLETED" ? getCompletedTodos(scoped) : sortPriorityOldest(scoped); }
export function getDepartmentCounts(todos: Todo[], role: DemoRole, now = new Date()): { new: number; inProgress: number; unable: number; completedToday: number } { const type = getTodoTypeForRole(role); if (!type) return { new: 0, inProgress: 0, unable: 0, completedToday: 0 }; return { new: todos.filter((t) => t.type === type && t.status === "OPEN").length, inProgress: todos.filter((t) => t.type === type && t.status === "IN_PROGRESS").length, unable: todos.filter((t) => t.type === type && t.status === "UNABLE_TO_COMPLETE").length, completedToday: todos.filter((t) => t.type === type && t.status === "COMPLETED" && t.completedAt && isSameLocalDay(t.completedAt, now)).length }; }
export function getFrontDeskCounts(todos: Todo[]): Record<"OPEN" | "IN_PROGRESS" | "UNABLE_TO_COMPLETE" | "COMPLETED" | "CANCELLED" | "ALL", number> { const visible = getVisibleTodos(todos); return { OPEN: visible.filter((t) => t.status === "OPEN").length, IN_PROGRESS: visible.filter((t) => t.status === "IN_PROGRESS").length, UNABLE_TO_COMPLETE: visible.filter((t) => t.status === "UNABLE_TO_COMPLETE").length, COMPLETED: visible.filter((t) => t.status === "COMPLETED").length, CANCELLED: visible.filter((t) => t.status === "CANCELLED").length, ALL: visible.length }; }
export function getRoomOperationalIndicators(todos: Todo[], roomNumber: number): { hasHousekeeping: boolean; hasMaintenance: boolean } { const roomTodos = getActiveTodos(todos).filter((todo) => todo.roomNumber === roomNumber); return { hasHousekeeping: roomTodos.some((todo) => todo.type === "HOUSEKEEPING_REQUEST"), hasMaintenance: roomTodos.some((todo) => todo.type === "MAINTENANCE_ISSUE") }; }
export function createTodoLogEntry(todo: Todo): LogBookEntry { return entry(todo, "CREATED", `Created by Front Desk for Room ${todo.roomNumber}: ${todo.details}.`, "Front Desk"); }
export function createUpdateLogEntry(before: Todo, after: Todo): LogBookEntry { const rerouted = before.status !== after.status && after.status === "OPEN"; return entry(after, rerouted ? "REOPENED" : "UPDATED", rerouted ? `Request rerouted and reopened for Room ${after.roomNumber}: ${after.details}.` : `Request updated for Room ${after.roomNumber}: ${after.details}.`, after.updatedBy); }
export function createStartLogEntry(todo: Todo): LogBookEntry { return entry(todo, "STARTED", `Work started for Room ${todo.roomNumber}: ${todo.details}.`, todo.startedBy); }
export function createCompletionLogEntry(todo: Todo): LogBookEntry { return entry(todo, "COMPLETED", `${getTodoTypeShortLabel(todo.type)} completed for Room ${todo.roomNumber}: ${todo.details}.`, todo.completedBy, null, todo.resolutionNote); }
export function createUnableLogEntry(todo: Todo): LogBookEntry { return entry(todo, "UNABLE_TO_COMPLETE", `Unable to complete request for Room ${todo.roomNumber}: ${todo.details}.`, todo.unableBy, todo.unableReason, todo.unableNote); }
export function createReopenLogEntry(todo: Todo): LogBookEntry { return entry(todo, "REOPENED", `Request reopened for Room ${todo.roomNumber}: ${todo.details}.`, todo.updatedBy); }
export function createCancellationLogEntry(todo: Todo): LogBookEntry { return entry(todo, "CANCELLED", `Request cancelled for Room ${todo.roomNumber}: ${todo.details}.`, todo.cancelledBy, todo.cancellationReason); }
export function createDeletionLogEntry(todo: Todo): LogBookEntry { return entry(todo, "DELETED", `${getTodoTypeShortLabel(todo.type)} deleted for Room ${todo.roomNumber}: ${todo.details}.`, todo.deletedBy); }
function entry(todo: Todo, eventType: LogBookEntry["eventType"], message: string, actor: ActorLabel | null, reason: string | null = null, note: string | null = null): LogBookEntry { return { id: createStableId("log"), createdAt: todo.updatedAt, roomNumber: todo.roomNumber, message, category: todo.type === "HOUSEKEEPING_REQUEST" ? "Housekeeping" : "Maintenance", todoId: todo.id, eventType, actor, reason, note }; }
export function isSameLocalDay(value: string, now: Date): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
