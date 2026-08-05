import { describe, expect, it } from "vitest";
import { makeTodo, NOW } from "@/test/factories";
import { getAvailableTodoActions } from "@/lib/todo-actions";
import { cancelTodo, completeTodo, createTodo, deleteTodo, markTodoUnable, reopenTodo, startTodo, updateTodoRecord } from "@/lib/todos";

describe("todo permission matrix", () => {
  it("permits Front Desk lifecycle actions except department start", () => {
    const todo = makeTodo();
    expect(createTodo({ roomNumber: 101, type: "HOUSEKEEPING_REQUEST", priority: "NORMAL", details: "Extra Towels", quantity: 1, note: null }, NOW).status).toBe("OPEN");
    expect(updateTodoRecord(todo, { roomNumber: 101, type: "HOUSEKEEPING_REQUEST", priority: "URGENT", details: "Extra Towels", quantity: 2, note: null }, "Front Desk", NOW)).not.toBeNull();
    expect(completeTodo(todo, "FRONT_DESK", undefined, NOW)).not.toBeNull();
    expect(reopenTodo(makeTodo({ status: "UNABLE_TO_COMPLETE" }), "FRONT_DESK", NOW)).not.toBeNull();
    expect(cancelTodo(todo, "FRONT_DESK", "Duplicate", NOW)).not.toBeNull();
    expect(deleteTodo(todo, "Front Desk", NOW)).not.toBeNull();
    expect(startTodo(todo, "FRONT_DESK", NOW)).toBeNull();
  });

  it("permits departments only on matching in-scope requests", () => {
    const hk = makeTodo({ status: "IN_PROGRESS", startedAt: NOW, startedBy: "Housekeeping Supervisor" });
    const mx = makeTodo({ id: "mx", type: "MAINTENANCE_ISSUE", quantity: null, status: "IN_PROGRESS", startedAt: NOW, startedBy: "Maintenance Manager" });
    expect(startTodo(makeTodo(), "HOUSEKEEPING_SUPERVISOR", NOW)).not.toBeNull();
    expect(completeTodo(hk, "HOUSEKEEPING_SUPERVISOR", "done", NOW)).not.toBeNull();
    expect(markTodoUnable(hk, "HOUSEKEEPING_SUPERVISOR", "No Room Access", "locked", NOW)).not.toBeNull();
    expect(startTodo(makeTodo({ type: "MAINTENANCE_ISSUE", quantity: null }), "HOUSEKEEPING_SUPERVISOR", NOW)).toBeNull();
    expect(completeTodo(hk, "MAINTENANCE_MANAGER", "done", NOW)).toBeNull();
    expect(completeTodo(mx, "MAINTENANCE_MANAGER", "done", NOW)).not.toBeNull();
    expect(reopenTodo(hk, "HOUSEKEEPING_SUPERVISOR", NOW)).toBeNull();
    expect(cancelTodo(mx, "MAINTENANCE_MANAGER", "Duplicate", NOW)).toBeNull();
  });

  it("centralizes UI action availability", () => {
    expect(getAvailableTodoActions(makeTodo(), "FRONT_DESK")).toEqual(["EDIT", "COMPLETE", "CANCEL", "DELETE"]);
  });
});
