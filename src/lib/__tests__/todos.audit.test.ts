import { describe, expect, it } from "vitest";
import { makeLogBookEntry, makeTodo, NOW } from "@/test/factories";
import { createCancellationLogEntry, createCompletionLogEntry, createDeletionLogEntry, createReopenLogEntry, createStartLogEntry, createTodoLogEntry, createUnableLogEntry, createUpdateLogEntry, getPropertyLogBook, getRequestTimeline } from "@/lib/todos";

describe("todo audit and timelines", () => {
  it("creates one typed log entry for each domain event", () => {
    const todo = makeTodo({ updatedAt: NOW });
    const entries = [createTodoLogEntry(todo), createUpdateLogEntry(makeTodo(), todo), createStartLogEntry({ ...todo, startedBy: "Housekeeping Supervisor" }), createCompletionLogEntry({ ...todo, completedBy: "Front Desk", resolutionNote: "Done" }), createUnableLogEntry({ ...todo, unableBy: "Housekeeping Supervisor", unableReason: "No Room Access", unableNote: "Locked" }), createReopenLogEntry(todo), createCancellationLogEntry({ ...todo, cancelledBy: "Front Desk", cancellationReason: "Duplicate" }), createDeletionLogEntry({ ...todo, deletedBy: "Front Desk" })];
    expect(entries.map((entry) => entry.eventType)).toEqual(["CREATED", "UPDATED", "STARTED", "COMPLETED", "UNABLE_TO_COMPLETE", "REOPENED", "CANCELLED", "DELETED"]);
    expect(entries.every((entry) => entry.todoId === todo.id && entry.roomNumber === todo.roomNumber)).toBe(true);
    expect(entries.find((entry) => entry.eventType === "UNABLE_TO_COMPLETE")?.reason).toBe("No Room Access");
    expect(entries.find((entry) => entry.eventType === "COMPLETED")?.note).toBe("Done");
  });

  it("sorts request timelines oldest first and property log newest first", () => {
    const entries = [makeLogBookEntry({ id: "new", createdAt: "2026-08-05T12:00:00.000Z" }), makeLogBookEntry({ id: "old", createdAt: "2026-08-05T09:00:00.000Z" }), makeLogBookEntry({ id: "other", todoId: "other" })];
    expect(getRequestTimeline(entries, "todo-1").map((entry) => entry.id)).toEqual(["old", "new"]);
    expect(getPropertyLogBook(entries).map((entry) => entry.id)[0]).toBe("new");
  });
});
