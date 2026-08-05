import type { DemoRole, LogBookEntry, Todo, TodoType } from "@/types/hotel-operations";

export const HOUSEKEEPING_OPTIONS = ["Towel Set", "Extra Towels", "Extra Pillows", "Toiletries", "Linen Replacement", "Missing Room Item", "Other"] as const;
export const MAINTENANCE_OPTIONS = ["Air Conditioner Not Cooling", "Television Not Working", "Sink Leaking", "Slow-Draining Sink", "Toilet Issue", "Door Lock Issue", "Lighting Issue", "Other"] as const;

export const ROLE_LABELS: Record<DemoRole, string> = { FRONT_DESK: "Front Desk", HOUSEKEEPING_SUPERVISOR: "Housekeeping Supervisor", MAINTENANCE_MANAGER: "Maintenance Manager" };

export type TodoDraft = { roomNumber: number; type: TodoType; details: string; quantity: number | null; note: string | null };
export type TodoUpdate = Partial<TodoDraft>;

export function getOpenTodos(todos: Todo[]) { return todos.filter((todo) => todo.status === "OPEN").sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function getCompletedTodos(todos: Todo[]) { return todos.filter((todo) => todo.status === "COMPLETED").sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")); }
export function getTodosForRoom(todos: Todo[], roomNumber: number) { return getOpenTodos(todos).filter((todo) => todo.roomNumber === roomNumber); }
export function getCompletedTodosForRoom(todos: Todo[], roomNumber: number) { return getCompletedTodos(todos).filter((todo) => todo.roomNumber === roomNumber); }
export function getOpenTodosForRole(todos: Todo[], role: DemoRole) { const type = getTodoTypeForRole(role); return type ? getOpenTodos(todos).filter((todo) => todo.type === type) : []; }
export function getCompletedTodosForRole(todos: Todo[], role: DemoRole) { const type = getTodoTypeForRole(role); return type ? getCompletedTodos(todos).filter((todo) => todo.type === type) : []; }

export function getRoomOperationalIndicators(todos: Todo[], roomNumber: number) {
  const roomTodos = getTodosForRoom(todos, roomNumber);
  return { hasHousekeeping: roomTodos.some((todo) => todo.type === "HOUSEKEEPING_REQUEST"), hasMaintenance: roomTodos.some((todo) => todo.type === "MAINTENANCE_ISSUE") };
}

export function getOpenTodoCounts(todos: Todo[]) {
  const openTodos = getOpenTodos(todos);
  return { total: openTodos.length, housekeeping: openTodos.filter((todo) => todo.type === "HOUSEKEEPING_REQUEST").length, maintenance: openTodos.filter((todo) => todo.type === "MAINTENANCE_ISSUE").length };
}

export function createStableId(prefix: string) { if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`; return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }
export function createTodo(draft: TodoDraft, createdAt = new Date().toISOString()): Todo { return { id: createStableId("todo"), status: "OPEN", createdAt, completedAt: null, completedBy: null, ...draft }; }

export function updateTodoRecord(todo: Todo, draft: TodoUpdate, _updatedBy: string): Todo | null {
  const nextTodo: Todo = { ...todo, ...draft };
  return hasTodoChanged(todo, nextTodo) ? nextTodo : null;
}

export function completeTodo(todo: Todo, completedBy: string, completedAt = new Date().toISOString()): Todo { return { ...todo, status: "COMPLETED", completedAt, completedBy }; }
export function deleteTodo(todo: Todo): Todo { return { ...todo, status: "DELETED" }; }

export function createTodoLogEntry(todo: Todo): LogBookEntry {
  const isHousekeeping = todo.type === "HOUSEKEEPING_REQUEST";
  return { id: createStableId("log"), createdAt: todo.createdAt, roomNumber: todo.roomNumber, category: isHousekeeping ? "Housekeeping" : "Maintenance", todoId: todo.id, message: isHousekeeping ? `${formatQuantity(todo.quantity)} ${todo.details.toLowerCase()} requested for Room ${todo.roomNumber}.` : `Maintenance issue reported for Room ${todo.roomNumber}: ${todo.details}.` };
}

export function createCompletionLogEntry(todo: Todo): LogBookEntry {
  const isHousekeeping = todo.type === "HOUSEKEEPING_REQUEST";
  return { id: createStableId("log"), createdAt: todo.completedAt ?? new Date().toISOString(), roomNumber: todo.roomNumber, category: isHousekeeping ? "Housekeeping" : "Maintenance", todoId: todo.id, message: `${isHousekeeping ? "Housekeeping request" : "Maintenance issue"} completed for Room ${todo.roomNumber}: ${todo.details}.` };
}

export function createUpdateLogEntry(before: Todo, after: Todo): LogBookEntry {
  const isHousekeeping = after.type === "HOUSEKEEPING_REQUEST";
  return { id: createStableId("log"), createdAt: new Date().toISOString(), roomNumber: after.roomNumber, category: isHousekeeping ? "Housekeeping" : "Maintenance", todoId: after.id, message: `${isHousekeeping ? "Housekeeping request" : "Maintenance issue"} updated for Room ${after.roomNumber}: ${before.details} → ${after.details}.` };
}

export function createDeletionLogEntry(todo: Todo): LogBookEntry {
  const isHousekeeping = todo.type === "HOUSEKEEPING_REQUEST";
  return { id: createStableId("log"), createdAt: new Date().toISOString(), roomNumber: todo.roomNumber, category: isHousekeeping ? "Housekeeping" : "Maintenance", todoId: todo.id, message: `${isHousekeeping ? "Housekeeping request" : "Maintenance issue"} deleted for Room ${todo.roomNumber}: ${todo.details}.` };
}

function getTodoTypeForRole(role: DemoRole): TodoType | null { if (role === "HOUSEKEEPING_SUPERVISOR") return "HOUSEKEEPING_REQUEST"; if (role === "MAINTENANCE_MANAGER") return "MAINTENANCE_ISSUE"; return null; }
function formatQuantity(quantity: number | null) { if (quantity === 1) return "One"; if (quantity === 2) return "Two"; return `${quantity ?? 1}`; }
export function getTodoTypeLabel(type: TodoType) { return type === "HOUSEKEEPING_REQUEST" ? "Housekeeping Request" : "Maintenance Issue"; }

function hasTodoChanged(before: Todo, after: Todo) { return before.roomNumber !== after.roomNumber || before.type !== after.type || before.details !== after.details || before.quantity !== after.quantity || before.note !== after.note; }
