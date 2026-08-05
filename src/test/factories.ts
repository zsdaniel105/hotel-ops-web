import type { LogBookEntry, PrototypeState, Todo } from "@/types/hotel-operations";

export const NOW = "2026-08-05T12:00:00.000Z";
export const EARLIER = "2026-08-05T10:00:00.000Z";

export function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "todo-1",
    roomNumber: 101,
    type: "HOUSEKEEPING_REQUEST",
    priority: "NORMAL",
    details: "Extra Towels",
    quantity: 2,
    note: null,
    status: "OPEN",
    createdAt: EARLIER,
    updatedAt: EARLIER,
    updatedBy: "Front Desk",
    startedAt: null,
    startedBy: null,
    completedAt: null,
    completedBy: null,
    resolutionNote: null,
    unableAt: null,
    unableBy: null,
    unableReason: null,
    unableNote: null,
    cancelledAt: null,
    cancelledBy: null,
    cancellationReason: null,
    deletedAt: null,
    deletedBy: null,
    ...overrides,
  };
}

export function makeLogBookEntry(overrides: Partial<LogBookEntry> = {}): LogBookEntry {
  return {
    id: "log-1",
    createdAt: EARLIER,
    roomNumber: 101,
    message: "Created by Front Desk for Room 101: Extra Towels.",
    category: "Housekeeping",
    todoId: "todo-1",
    eventType: "CREATED",
    actor: "Front Desk",
    reason: null,
    note: null,
    ...overrides,
  };
}

export function makePrototypeState(overrides: Partial<PrototypeState> = {}): PrototypeState {
  return { version: 4, todos: [makeTodo()], logEntries: [makeLogBookEntry()], ...overrides };
}
