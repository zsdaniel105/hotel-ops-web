import type { DemoRole, TodoPriority, TodoStatus, TodoType } from "@/types/hotel-operations";

export type PresentationTone = "neutral" | "info" | "warning" | "success" | "muted" | "danger";

export const STATUS_PRESENTATION: Record<TodoStatus, { label: string; tone: PresentationTone; visible: boolean }> = {
  OPEN: { label: "Open", tone: "neutral", visible: true },
  IN_PROGRESS: { label: "In Progress", tone: "info", visible: true },
  UNABLE_TO_COMPLETE: { label: "Unable to Complete", tone: "warning", visible: true },
  COMPLETED: { label: "Completed", tone: "success", visible: true },
  CANCELLED: { label: "Cancelled", tone: "muted", visible: true },
  DELETED: { label: "Deleted", tone: "danger", visible: false },
};

export const PRIORITY_PRESENTATION: Record<TodoPriority, { label: string; tone: PresentationTone }> = {
  NORMAL: { label: "Normal", tone: "muted" },
  URGENT: { label: "Urgent", tone: "warning" },
};

export const ROLE_PRESENTATION: Record<DemoRole, { label: string }> = {
  FRONT_DESK: { label: "Front Desk" },
  HOUSEKEEPING_SUPERVISOR: { label: "Housekeeping Supervisor" },
  MAINTENANCE_MANAGER: { label: "Maintenance Manager" },
};

export const REQUEST_TYPE_PRESENTATION: Record<TodoType, { label: string; shortLabel: string }> = {
  HOUSEKEEPING_REQUEST: { label: "Housekeeping Request", shortLabel: "Housekeeping request" },
  MAINTENANCE_ISSUE: { label: "Maintenance Issue", shortLabel: "Maintenance issue" },
};

export function isActiveStatus(status: TodoStatus): boolean {
  return status === "OPEN" || status === "IN_PROGRESS" || status === "UNABLE_TO_COMPLETE";
}
