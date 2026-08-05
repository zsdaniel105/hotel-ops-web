import type { LogBookEntry, PrototypeState, Todo } from "@/types/hotel-operations";

export const PROTOTYPE_STORAGE_KEY_V1 = "hotel-ops-web:prototype:v1";
export const PROTOTYPE_STORAGE_KEY = "hotel-ops-web:prototype:v2";

type V1Todo = Omit<Todo, "completedAt" | "completedBy"> & { completedAt?: string | null; completedBy?: string | null };
type V1State = { version: 1; todos: V1Todo[]; logEntries: LogBookEntry[] };

export const SEEDED_PROTOTYPE_STATE: PrototypeState = {
  version: 2,
  todos: [
    { id: "seed-todo-204", roomNumber: 204, type: "HOUSEKEEPING_REQUEST", details: "Towel Set", quantity: 2, note: "Guest requested delivery to the room.", status: "OPEN", createdAt: "2026-08-05T10:24:00.000Z", completedAt: null, completedBy: null },
    { id: "seed-todo-317", roomNumber: 317, type: "MAINTENANCE_ISSUE", details: "Slow-Draining Sink", quantity: null, note: "Reported during room turnover.", status: "OPEN", createdAt: "2026-08-05T09:48:00.000Z", completedAt: null, completedBy: null },
    { id: "seed-todo-508", roomNumber: 508, type: "HOUSEKEEPING_REQUEST", details: "Missing Robe", quantity: 1, note: "Flagged for Housekeeping supervisor review.", status: "OPEN", createdAt: "2026-08-05T07:40:00.000Z", completedAt: null, completedBy: null },
    { id: "seed-todo-112-completed", roomNumber: 112, type: "HOUSEKEEPING_REQUEST", details: "Extra Pillows", quantity: 2, note: null, status: "COMPLETED", createdAt: "2026-08-04T17:20:00.000Z", completedAt: "2026-08-04T17:42:00.000Z", completedBy: "Housekeeping Supervisor" },
  ],
  logEntries: [
    { id: "seed-log-204", createdAt: "2026-08-05T10:24:00.000Z", roomNumber: 204, message: "Two towel sets requested for Room 204.", category: "Housekeeping", todoId: "seed-todo-204" },
    { id: "seed-log-317", createdAt: "2026-08-05T09:48:00.000Z", roomNumber: 317, message: "Maintenance issue reported for Room 317: Slow-Draining Sink.", category: "Maintenance", todoId: "seed-todo-317" },
    { id: "seed-log-operations-1", createdAt: "2026-08-05T08:15:00.000Z", roomNumber: null, message: "Night audit completed with no escalations.", category: "Operations", todoId: null },
    { id: "seed-log-508", createdAt: "2026-08-05T07:40:00.000Z", roomNumber: 508, message: "One missing robe requested for Room 508.", category: "Housekeeping", todoId: "seed-todo-508" },
    { id: "seed-log-112-completed", createdAt: "2026-08-04T17:42:00.000Z", roomNumber: 112, message: "Housekeeping request completed for Room 112: Extra Pillows.", category: "Housekeeping", todoId: "seed-todo-112-completed" },
  ],
};

export function loadPrototypeState(): PrototypeState {
  if (typeof window === "undefined") return SEEDED_PROTOTYPE_STATE;
  const v2 = readStoredValue(PROTOTYPE_STORAGE_KEY);
  if (isPrototypeState(v2)) return v2;
  const v1 = readStoredValue(PROTOTYPE_STORAGE_KEY_V1);
  if (isV1PrototypeState(v1)) {
    const migrated = migrateV1State(v1);
    savePrototypeState(migrated);
    return migrated;
  }
  return SEEDED_PROTOTYPE_STATE;
}

export function savePrototypeState(state: PrototypeState) { if (typeof window === "undefined") return; window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(state)); }

function readStoredValue(key: string) { try { const storedValue = window.localStorage.getItem(key); return storedValue ? (JSON.parse(storedValue) as unknown) : null; } catch { return null; } }
function migrateV1State(state: V1State): PrototypeState { return { version: 2, todos: state.todos.map((todo) => ({ ...todo, status: todo.status === "COMPLETED" ? "COMPLETED" : "OPEN", completedAt: todo.completedAt ?? null, completedBy: todo.completedBy ?? null })), logEntries: state.logEntries }; }
function isPrototypeState(value: unknown): value is PrototypeState { if (!value || typeof value !== "object") return false; const candidate = value as Partial<PrototypeState>; return candidate.version === 2 && Array.isArray(candidate.todos) && Array.isArray(candidate.logEntries); }
function isV1PrototypeState(value: unknown): value is V1State { if (!value || typeof value !== "object") return false; const candidate = value as Partial<V1State>; return candidate.version === 1 && Array.isArray(candidate.todos) && Array.isArray(candidate.logEntries); }
