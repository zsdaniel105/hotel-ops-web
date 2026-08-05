import { useCallback, useEffect, useState } from "react";
import { loadPrototypeState, savePrototypeState, SEEDED_PROTOTYPE_STATE } from "@/lib/prototype-storage";
import { completeTodo as completeTodoRecord, createCompletionLogEntry, createDeletionLogEntry, createTodo, createTodoLogEntry, createUpdateLogEntry, deleteTodo as deleteTodoRecord, ROLE_LABELS, updateTodo as updateTodoRecord, type TodoDraft, type TodoUpdate } from "@/lib/todos";
import type { DemoRole, PrototypeState, Todo } from "@/types/hotel-operations";

export function usePrototypeState() {
  const [state, setState] = useState<PrototypeState>(SEEDED_PROTOTYPE_STATE);
  useEffect(() => { setState(loadPrototypeState()); }, []);
  const addTodo = useCallback((draft: TodoDraft) => { const todo = createTodo(draft); const logEntry = createTodoLogEntry(todo); setState((currentState) => persist({ version: 3, todos: [todo, ...currentState.todos], logEntries: [logEntry, ...currentState.logEntries] })); return todo; }, []);
  const updateTodo = useCallback((todoId: string, draft: TodoUpdate) => { let result: Todo | null = null; setState((currentState) => { const before = currentState.todos.find((item) => item.id === todoId); if (!before) return currentState; const after = updateTodoRecord(before, draft, "Front Desk"); if (!after) return currentState; result = after; return persist({ version: 3, todos: currentState.todos.map((item) => (item.id === todoId ? after : item)), logEntries: [createUpdateLogEntry(before, after), ...currentState.logEntries] }); }); return result; }, []);
  const completeTodo = useCallback((todoId: string, role: DemoRole) => { let result: Todo | null = null; setState((currentState) => { const before = currentState.todos.find((item) => item.id === todoId); if (!before) return currentState; const after = completeTodoRecord(before, ROLE_LABELS[role]); if (!after) return currentState; result = after; return persist({ version: 3, todos: currentState.todos.map((item) => (item.id === todoId ? after : item)), logEntries: [createCompletionLogEntry(after), ...currentState.logEntries] }); }); return result; }, []);
  const deleteTodo = useCallback((todoId: string) => { let result: Todo | null = null; setState((currentState) => { const before = currentState.todos.find((item) => item.id === todoId); if (!before) return currentState; const after = deleteTodoRecord(before, "Front Desk"); if (!after) return currentState; result = after; return persist({ version: 3, todos: currentState.todos.map((item) => (item.id === todoId ? after : item)), logEntries: [createDeletionLogEntry(after), ...currentState.logEntries] }); }); return result; }, []);
  return { state, addTodo, updateTodo, completeTodo, deleteTodo };
}
function persist(state: PrototypeState) { savePrototypeState(state); return state; }
