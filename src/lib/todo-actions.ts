import { getTodoTypeForRole } from "@/lib/todos";
import type { DemoRole, Todo } from "@/types/hotel-operations";

export type TodoAction = "EDIT" | "START" | "COMPLETE" | "MARK_UNABLE" | "REOPEN" | "CANCEL" | "DELETE";

export function getAvailableTodoActions(todo: Todo, role: DemoRole): TodoAction[] {
  if (todo.status === "DELETED") return [];
  const actions: TodoAction[] = [];
  const departmentMatches = getTodoTypeForRole(role) === todo.type;
  if (role === "FRONT_DESK") {
    actions.push("EDIT");
    if (todo.status === "OPEN" || todo.status === "IN_PROGRESS") actions.push("COMPLETE");
    if (todo.status === "UNABLE_TO_COMPLETE") actions.push("REOPEN");
    if (todo.status === "OPEN" || todo.status === "IN_PROGRESS" || todo.status === "UNABLE_TO_COMPLETE") actions.push("CANCEL");
    actions.push("DELETE");
    return actions;
  }
  if (!departmentMatches) return [];
  if (todo.status === "OPEN") actions.push("START");
  if (todo.status === "IN_PROGRESS") actions.push("COMPLETE", "MARK_UNABLE");
  return actions;
}
