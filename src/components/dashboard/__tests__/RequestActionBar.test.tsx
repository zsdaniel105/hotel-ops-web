import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestActionBar } from "@/components/dashboard/Dashboard";
import { makeTodo } from "@/test/factories";

describe("RequestActionBar", () => {
  it.each([
    ["FRONT_DESK", makeTodo(), ["Edit", "Complete", "Cancel Request", "Delete Request"]],
    ["FRONT_DESK", makeTodo({ status: "UNABLE_TO_COMPLETE" }), ["Edit", "Reopen", "Cancel Request", "Delete Request"]],
    ["FRONT_DESK", makeTodo({ status: "COMPLETED" }), ["Edit", "Delete Request"]],
    ["HOUSEKEEPING_SUPERVISOR", makeTodo(), ["Start Work"]],
    ["HOUSEKEEPING_SUPERVISOR", makeTodo({ status: "IN_PROGRESS" }), ["Complete", "Unable to Complete"]],
    ["HOUSEKEEPING_SUPERVISOR", makeTodo({ type: "MAINTENANCE_ISSUE", quantity: null }), []],
    ["MAINTENANCE_MANAGER", makeTodo({ type: "MAINTENANCE_ISSUE", quantity: null }), ["Start Work"]],
  ] as const)("shows allowed actions for %s", (role, todo, labels) => {
    render(<RequestActionBar role={role} todo={todo} onAction={vi.fn()} />);
    for (const label of labels) expect(screen.getByRole("button", { name: label })).toBeVisible();
  });
});
