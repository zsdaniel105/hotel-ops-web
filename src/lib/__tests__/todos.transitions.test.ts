import { describe, expect, it } from "vitest";
import { makeTodo, NOW } from "@/test/factories";
import { cancelTodo, completeTodo, createTodo, deleteTodo, markTodoUnable, reopenTodo, startTodo, updateTodoRecord } from "@/lib/todos";

describe("todo transitions", () => {
  it("creates open requests without mutating the draft", () => {
    const draft = { roomNumber: 101, type: "HOUSEKEEPING_REQUEST" as const, priority: "URGENT" as const, details: "Extra Towels", quantity: 2, note: "  deliver  " };
    const todo = createTodo(draft, NOW);
    expect(todo).toMatchObject({ status: "OPEN", priority: "URGENT", createdAt: NOW, updatedAt: NOW, startedAt: null, completedAt: null, unableAt: null, cancelledAt: null, deletedAt: null, note: "deliver" });
    expect(draft.note).toBe("  deliver  ");
  });

  it("starts only matching department open requests and preserves the source", () => {
    const original = makeTodo();
    expect(startTodo(original, "HOUSEKEEPING_SUPERVISOR", NOW)).toMatchObject({ status: "IN_PROGRESS", startedAt: NOW, startedBy: "Housekeeping Supervisor", updatedAt: NOW });
    expect(startTodo(makeTodo({ type: "MAINTENANCE_ISSUE", quantity: null }), "MAINTENANCE_MANAGER", NOW)).toMatchObject({ startedBy: "Maintenance Manager" });
    expect(startTodo(original, "MAINTENANCE_MANAGER", NOW)).toBeNull();
    expect(startTodo(makeTodo({ status: "IN_PROGRESS" }), "HOUSEKEEPING_SUPERVISOR", NOW)).toBeNull();
    expect(startTodo(original, "FRONT_DESK", NOW)).toBeNull();
    expect(original.status).toBe("OPEN");
  });

  it("completes permitted requests with trimmed optional resolution", () => {
    const inProgress = makeTodo({ status: "IN_PROGRESS", startedAt: NOW, startedBy: "Housekeeping Supervisor" });
    expect(completeTodo(inProgress, "HOUSEKEEPING_SUPERVISOR", "  done  ", NOW)).toMatchObject({ status: "COMPLETED", completedAt: NOW, completedBy: "Housekeeping Supervisor", resolutionNote: "done" });
    expect(completeTodo(makeTodo(), "FRONT_DESK", "   ", NOW)).toMatchObject({ status: "COMPLETED", completedBy: "Front Desk", resolutionNote: null });
    expect(completeTodo(inProgress, "MAINTENANCE_MANAGER", undefined, NOW)).toBeNull();
    expect(completeTodo(makeTodo({ status: "COMPLETED" }), "FRONT_DESK", undefined, NOW)).toBeNull();
    expect(inProgress.status).toBe("IN_PROGRESS");
  });

  it("marks unable, reopens, cancels, deletes, and edits using role-safe rules", () => {
    const inProgress = makeTodo({ status: "IN_PROGRESS", startedAt: NOW, startedBy: "Housekeeping Supervisor" });
    const unable = markTodoUnable(inProgress, "HOUSEKEEPING_SUPERVISOR", "No Room Access", "  Guest out  ", NOW);
    expect(unable).toMatchObject({ status: "UNABLE_TO_COMPLETE", unableReason: "No Room Access", unableNote: "Guest out" });
    expect(markTodoUnable(inProgress, "MAINTENANCE_MANAGER", "No Room Access", "Guest out", NOW)).toBeNull();
    expect(markTodoUnable(makeTodo(), "HOUSEKEEPING_SUPERVISOR", "No Room Access", "Guest out", NOW)).toBeNull();
    expect(unable && reopenTodo(unable, "FRONT_DESK", NOW)).toMatchObject({ status: "OPEN", startedAt: null, unableAt: null });
    expect(unable && reopenTodo(unable, "HOUSEKEEPING_SUPERVISOR", NOW)).toBeNull();
    expect(cancelTodo(makeTodo(), "FRONT_DESK", "Duplicate", NOW)).toMatchObject({ status: "CANCELLED", cancellationReason: "Duplicate" });
    expect(cancelTodo(makeTodo(), "HOUSEKEEPING_SUPERVISOR", "Duplicate", NOW)).toBeNull();
    const completed = completeTodo(inProgress, "HOUSEKEEPING_SUPERVISOR", "done", NOW)!;
    expect(deleteTodo(completed, "Front Desk", NOW)).toMatchObject({ status: "DELETED", completedAt: NOW, deletedAt: NOW });
    expect(deleteTodo(makeTodo({ status: "DELETED" }), "Front Desk", NOW)).toBeNull();
  });

  it("edits without no-op churn and reopens rerouted active work", () => {
    const todo = makeTodo({ status: "IN_PROGRESS", startedAt: NOW, startedBy: "Housekeeping Supervisor" });
    const draft = { roomNumber: 101, type: "HOUSEKEEPING_REQUEST" as const, priority: "NORMAL" as const, details: "Extra Towels", quantity: 2, note: null };
    expect(updateTodoRecord(todo, draft, "Front Desk", NOW)).toBeNull();
    expect(updateTodoRecord(todo, { ...draft, priority: "URGENT" }, "Front Desk", NOW)).toMatchObject({ status: "IN_PROGRESS", priority: "URGENT" });
    expect(updateTodoRecord(todo, { ...draft, roomNumber: 102 }, "Front Desk", NOW)).toMatchObject({ status: "OPEN", startedAt: null });
    expect(updateTodoRecord(todo, { ...draft, type: "MAINTENANCE_ISSUE", quantity: 9 }, "Front Desk", NOW)).toMatchObject({ status: "OPEN", quantity: null });
    expect(updateTodoRecord(makeTodo({ status: "COMPLETED" }), { ...draft, details: "Extra Pillows" }, "Front Desk", NOW)).toMatchObject({ status: "COMPLETED" });
  });
});
