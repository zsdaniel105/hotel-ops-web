import type { PrototypeState } from "@/types/hotel-operations";

export const PROTOTYPE_STORAGE_KEY = "hotel-ops-web:prototype:v1";

export const SEEDED_PROTOTYPE_STATE: PrototypeState = {
  version: 1,
  todos: [
    { id: "seed-todo-204", roomNumber: 204, type: "HOUSEKEEPING_REQUEST", details: "Towel set", quantity: 2, note: "Guest requested delivery to the room.", status: "OPEN", createdAt: "2026-08-05T10:24:00.000Z" },
    { id: "seed-todo-317", roomNumber: 317, type: "MAINTENANCE_ISSUE", details: "Slow-draining sink", quantity: null, note: "Reported during room turnover.", status: "OPEN", createdAt: "2026-08-05T09:48:00.000Z" },
    { id: "seed-todo-508", roomNumber: 508, type: "HOUSEKEEPING_REQUEST", details: "Missing robe", quantity: 1, note: "Flagged for Housekeeping supervisor review.", status: "OPEN", createdAt: "2026-08-05T07:40:00.000Z" },
  ],
  logEntries: [
    { id: "seed-log-204", createdAt: "2026-08-05T10:24:00.000Z", roomNumber: 204, message: "Two towel sets requested for Room 204.", category: "Housekeeping", todoId: "seed-todo-204" },
    { id: "seed-log-317", createdAt: "2026-08-05T09:48:00.000Z", roomNumber: 317, message: "Maintenance issue reported for Room 317: Slow-draining sink.", category: "Maintenance", todoId: "seed-todo-317" },
    { id: "seed-log-operations-1", createdAt: "2026-08-05T08:15:00.000Z", roomNumber: null, message: "Night audit completed with no escalations.", category: "Operations", todoId: null },
    { id: "seed-log-508", createdAt: "2026-08-05T07:40:00.000Z", roomNumber: 508, message: "One missing robe requested for Room 508.", category: "Housekeeping", todoId: "seed-todo-508" },
    { id: "seed-log-operations-2", createdAt: "2026-08-05T07:05:00.000Z", roomNumber: null, message: "Breakfast staffing confirmed for the morning rush.", category: "Operations", todoId: null },
  ],
};

export function loadPrototypeState(): PrototypeState {
  if (typeof window === "undefined") return SEEDED_PROTOTYPE_STATE;
  try {
    const storedValue = window.localStorage.getItem(PROTOTYPE_STORAGE_KEY);
    if (!storedValue) return SEEDED_PROTOTYPE_STATE;
    const parsed = JSON.parse(storedValue) as unknown;
    return isPrototypeState(parsed) ? parsed : SEEDED_PROTOTYPE_STATE;
  } catch {
    return SEEDED_PROTOTYPE_STATE;
  }
}

export function savePrototypeState(state: PrototypeState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(state));
}

function isPrototypeState(value: unknown): value is PrototypeState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PrototypeState>;
  return candidate.version === 1 && Array.isArray(candidate.todos) && Array.isArray(candidate.logEntries);
}
