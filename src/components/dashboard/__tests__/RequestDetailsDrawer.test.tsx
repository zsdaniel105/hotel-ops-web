import { describe, expect, it } from "vitest";
import { getAvailableTodoActions } from "@/lib/todo-actions";
import { makeTodo } from "@/test/factories";

describe("RequestDetailsDrawer action rules", () => {
  it("does not show invalid terminal actions", () => {
    expect(getAvailableTodoActions(makeTodo({ status: "CANCELLED" }), "FRONT_DESK")).toEqual(["EDIT", "DELETE"]);
    expect(getAvailableTodoActions(makeTodo({ status: "COMPLETED" }), "HOUSEKEEPING_SUPERVISOR")).toEqual([]);
  });
});
