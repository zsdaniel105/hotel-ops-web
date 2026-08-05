export type Room = {
  number: number;
  floor: number;
};

export type TodoType = "HOUSEKEEPING_REQUEST" | "MAINTENANCE_ISSUE";

export type TodoStatus = "OPEN";

export type Todo = {
  id: string;
  roomNumber: number;
  type: TodoType;
  details: string;
  quantity: number | null;
  note: string | null;
  status: TodoStatus;
  createdAt: string;
};

export type LogBookEntry = {
  id: string;
  createdAt: string;
  roomNumber: number | null;
  message: string;
  category: "Housekeeping" | "Maintenance" | "Operations";
  todoId: string | null;
};

export type PrototypeState = {
  version: 1;
  todos: Todo[];
  logEntries: LogBookEntry[];
};
