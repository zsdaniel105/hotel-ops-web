import { describe, expect, it } from "vitest";
import { makeTodo } from "@/test/factories";
import { getAllVisibleTodos, getCancelledTodos, getCompletedTodos, getDepartmentCounts, getFrontDeskCounts, getInProgressTodos, getOpenTodos, getRoomOperationalIndicators, getTodosForRole, getTodosForRoom, getUnableTodos } from "@/lib/todos";

const todos = [
  makeTodo({ id: "urgent-old", priority: "URGENT", createdAt: "2026-08-05T09:00:00.000Z" }),
  makeTodo({ id: "normal-old", createdAt: "2026-08-05T08:00:00.000Z" }),
  makeTodo({ id: "progress", status: "IN_PROGRESS", createdAt: "2026-08-05T07:00:00.000Z" }),
  makeTodo({ id: "unable", status: "UNABLE_TO_COMPLETE", createdAt: "2026-08-05T06:00:00.000Z" }),
  makeTodo({ id: "complete-new", status: "COMPLETED", completedAt: "2026-08-05T12:00:00.000Z", updatedAt: "2026-08-05T12:00:00.000Z" }),
  makeTodo({ id: "complete-old", status: "COMPLETED", completedAt: "2026-08-04T12:00:00.000Z", updatedAt: "2026-08-04T12:00:00.000Z" }),
  makeTodo({ id: "cancel", status: "CANCELLED", cancelledAt: "2026-08-05T11:00:00.000Z", updatedAt: "2026-08-05T11:00:00.000Z" }),
  makeTodo({ id: "deleted", status: "DELETED" }),
  makeTodo({ id: "mx", roomNumber: 101, type: "MAINTENANCE_ISSUE", quantity: null, status: "OPEN" }),
];

describe("todo selectors, indicators, and sorting", () => {
  it("selects status and visibility buckets", () => {
    expect(getOpenTodos(todos).map((todo) => todo.id)).toEqual(["urgent-old", "normal-old", "mx"]);
    expect(getInProgressTodos(todos)).toHaveLength(1);
    expect(getUnableTodos(todos)).toHaveLength(1);
    expect(getCompletedTodos(todos).map((todo) => todo.id)).toEqual(["complete-new", "complete-old"]);
    expect(getCancelledTodos(todos).map((todo) => todo.id)).toEqual(["cancel"]);
    expect(getAllVisibleTodos(todos).some((todo) => todo.id === "deleted")).toBe(false);
  });

  it("scopes by department, room, and completed today", () => {
    expect(getTodosForRole(todos, "HOUSEKEEPING_SUPERVISOR").every((todo) => todo.type === "HOUSEKEEPING_REQUEST")).toBe(true);
    expect(getTodosForRole(todos, "MAINTENANCE_MANAGER").every((todo) => todo.type === "MAINTENANCE_ISSUE")).toBe(true);
    expect(getTodosForRoom(todos, 101).map((todo) => todo.id).sort()).toEqual(["mx", "normal-old", "progress", "unable", "urgent-old"].sort());
    expect(getDepartmentCounts(todos, "HOUSEKEEPING_SUPERVISOR", new Date("2026-08-05T23:00:00")).completedToday).toBe(1);
    expect(getFrontDeskCounts(todos).ALL).toBe(8);
  });

  it("calculates active room indicators and excludes inactive requests", () => {
    expect(getRoomOperationalIndicators(todos, 101)).toEqual({ hasHousekeeping: true, hasMaintenance: true });
    expect(getRoomOperationalIndicators([makeTodo({ status: "COMPLETED" })], 101)).toEqual({ hasHousekeeping: false, hasMaintenance: false });
    expect(getRoomOperationalIndicators([makeTodo({ status: "UNABLE_TO_COMPLETE" })], 101).hasHousekeeping).toBe(true);
    expect(getRoomOperationalIndicators([makeTodo({ status: "CANCELLED" })], 101).hasHousekeeping).toBe(false);
  });
});
