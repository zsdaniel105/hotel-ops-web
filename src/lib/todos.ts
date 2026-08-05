import type { LogBookEntry, Todo, TodoType } from "@/types/hotel-operations";

export const HOUSEKEEPING_OPTIONS = ["Towel Set", "Extra Towels", "Extra Pillows", "Toiletries", "Linen Replacement", "Missing Room Item", "Other"] as const;
export const MAINTENANCE_OPTIONS = ["Air Conditioner Not Cooling", "Television Not Working", "Sink Leaking", "Slow-Draining Sink", "Toilet Issue", "Door Lock Issue", "Lighting Issue", "Other"] as const;

export type TodoDraft = {
  roomNumber: number;
  type: TodoType;
  details: string;
  quantity: number | null;
  note: string | null;
};

export function getTodosForRoom(todos: Todo[], roomNumber: number) {
  return todos.filter((todo) => todo.roomNumber === roomNumber && todo.status === "OPEN");
}

export function getRoomOperationalIndicators(todos: Todo[], roomNumber: number) {
  const roomTodos = getTodosForRoom(todos, roomNumber);
  return {
    hasHousekeeping: roomTodos.some((todo) => todo.type === "HOUSEKEEPING_REQUEST"),
    hasMaintenance: roomTodos.some((todo) => todo.type === "MAINTENANCE_ISSUE"),
  };
}

export function getOpenTodoCounts(todos: Todo[]) {
  const openTodos = todos.filter((todo) => todo.status === "OPEN");
  return {
    total: openTodos.length,
    housekeeping: openTodos.filter((todo) => todo.type === "HOUSEKEEPING_REQUEST").length,
    maintenance: openTodos.filter((todo) => todo.type === "MAINTENANCE_ISSUE").length,
  };
}

export function createStableId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTodo(draft: TodoDraft, createdAt = new Date().toISOString()): Todo {
  return { id: createStableId("todo"), status: "OPEN", createdAt, ...draft };
}

export function createTodoLogEntry(todo: Todo): LogBookEntry {
  const isHousekeeping = todo.type === "HOUSEKEEPING_REQUEST";
  return {
    id: createStableId("log"),
    createdAt: todo.createdAt,
    roomNumber: todo.roomNumber,
    category: isHousekeeping ? "Housekeeping" : "Maintenance",
    todoId: todo.id,
    message: isHousekeeping
      ? `${formatQuantity(todo.quantity)} ${todo.details.toLowerCase()} requested for Room ${todo.roomNumber}.`
      : `Maintenance issue reported for Room ${todo.roomNumber}: ${todo.details}.`,
  };
}

function formatQuantity(quantity: number | null) {
  if (quantity === 1) return "One";
  if (quantity === 2) return "Two";
  return `${quantity ?? 1}`;
}

export function getTodoTypeLabel(type: TodoType) {
  return type === "HOUSEKEEPING_REQUEST" ? "Housekeeping Request" : "Maintenance Issue";
}
