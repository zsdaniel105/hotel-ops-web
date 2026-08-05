export type Room = { number: number; floor: number };
export type TodoType = "HOUSEKEEPING_REQUEST" | "MAINTENANCE_ISSUE";
export type TodoStatus = "OPEN" | "COMPLETED" | "DELETED";
export type DemoRole = "FRONT_DESK" | "HOUSEKEEPING_SUPERVISOR" | "MAINTENANCE_MANAGER";
export type ActorLabel = "Front Desk" | "Housekeeping Supervisor" | "Maintenance Manager";
export type Todo = {
  id: string; roomNumber: number; type: TodoType; details: string; quantity: number | null; note: string | null; status: TodoStatus;
  createdAt: string; updatedAt: string; updatedBy: ActorLabel | null; completedAt: string | null; completedBy: ActorLabel | null; deletedAt: string | null; deletedBy: ActorLabel | null;
};
export type LogBookEntry = { id: string; createdAt: string; roomNumber: number | null; message: string; category: "Housekeeping" | "Maintenance" | "Operations"; todoId: string | null };
export type PrototypeState = { version: 3; todos: Todo[]; logEntries: LogBookEntry[] };
