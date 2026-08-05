import { PRIORITY_PRESENTATION, STATUS_PRESENTATION } from "@/lib/presentation";
import type { TodoPriority, TodoStatus } from "@/types/hotel-operations";

const tones = {
  neutral: "border-teal-200 bg-teal-50 text-teal-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  success: "border-green-200 bg-green-50 text-green-800",
  muted: "border-slate-300 bg-slate-100 text-slate-700",
  danger: "border-red-300 bg-red-50 text-red-800",
};

export function StatusBadge({ status }: { status: TodoStatus }) {
  const presentation = STATUS_PRESENTATION[status];
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${tones[presentation.tone]}`}>{presentation.label}</span>;
}

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  const presentation = PRIORITY_PRESENTATION[priority];
  return <span aria-label={`Priority: ${presentation.label}`} className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${tones[presentation.tone]}`}>{presentation.label}</span>;
}
