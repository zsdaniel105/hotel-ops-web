import { beforeEach, describe, expect, it } from "vitest";
import { makeLogBookEntry, makePrototypeState, makeTodo } from "@/test/factories";
import { loadPrototypeState, migratePrototypeState, parseStoredPrototypeState, PROTOTYPE_STORAGE_KEY, PROTOTYPE_STORAGE_KEY_V1, PROTOTYPE_STORAGE_KEY_V3, savePrototypeState, SEEDED_PROTOTYPE_STATE } from "@/lib/prototype-storage";

describe("prototype storage and migration", () => {
  beforeEach(() => window.localStorage.clear());

  it("loads valid v4 data and preserves metadata", () => {
    const state = makePrototypeState({ todos: [makeTodo({ startedAt: "2026-08-05T10:05:00.000Z", unableReason: "No Room Access" })], logEntries: [makeLogBookEntry()] });
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(state));
    expect(loadPrototypeState()).toEqual(state);
  });

  it("migrates v3 defaults while preserving known fields", () => {
    const migrated = migratePrototypeState({ version: 3, todos: [{ id: "old", roomNumber: 202, type: "HOUSEKEEPING_REQUEST", details: "Toiletries", quantity: 3, note: "note", status: "COMPLETED", createdAt: "2026-08-01T00:00:00.000Z", updatedAt: "2026-08-01T01:00:00.000Z", updatedBy: "Front Desk", completedAt: "2026-08-01T02:00:00.000Z", completedBy: "Front Desk", deletedAt: null, deletedBy: null }], logEntries: [{ id: "log", createdAt: "2026-08-01T00:00:00.000Z", roomNumber: 202, message: "Existing", category: "Housekeeping", todoId: "old" }] });
    expect(migrated.version).toBe(4);
    expect(migrated.todos[0]).toMatchObject({ id: "old", roomNumber: 202, priority: "NORMAL", startedAt: null, startedBy: null, resolutionNote: null, unableReason: null, cancellationReason: null });
    expect(migrated.logEntries[0].message).toBe("Existing");
  });

  it("migrates v1 and v2 into valid v4 state", () => {
    for (const version of [1, 2] as const) {
      expect(migratePrototypeState({ version, todos: [{ id: `todo-${version}`, roomNumber: 101, type: "MAINTENANCE_ISSUE", details: "Lighting Issue" }], logEntries: [] }).version).toBe(4);
    }
  });

  it("handles malformed persistence safely", () => {
    expect(parseStoredPrototypeState("{bad json")).toBeNull();
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify({ nope: true }));
    expect(loadPrototypeState()).toEqual(SEEDED_PROTOTYPE_STATE);
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify({ version: 4, todos: [{ bad: true }], logEntries: [{ bad: true }] }));
    expect(loadPrototypeState()).toEqual({ version: 4, todos: [], logEntries: [] });
  });

  it("saves v4 and persists migrated older versions without deleting old keys", () => {
    const state = makePrototypeState();
    savePrototypeState(state);
    expect(JSON.parse(window.localStorage.getItem(PROTOTYPE_STORAGE_KEY) ?? "{}").version).toBe(4);
    window.localStorage.clear();
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY_V3, JSON.stringify({ version: 3, todos: [], logEntries: [] }));
    expect(loadPrototypeState().version).toBe(4);
    expect(window.localStorage.getItem(PROTOTYPE_STORAGE_KEY)).not.toBeNull();
    expect(window.localStorage.getItem(PROTOTYPE_STORAGE_KEY_V3)).not.toBeNull();
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY_V1, JSON.stringify({ version: 1, todos: [], logEntries: [] }));
    expect(window.localStorage.getItem(PROTOTYPE_STORAGE_KEY_V1)).not.toBeNull();
  });
});
