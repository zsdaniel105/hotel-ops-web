import { useCallback, useEffect, useState } from "react";
import { loadPrototypeState, savePrototypeState, SEEDED_PROTOTYPE_STATE } from "@/lib/prototype-storage";
import { completeTodo as completeTodoRecord, createCompletionLogEntry, createTodo, createTodoLogEntry, ROLE_LABELS, type TodoDraft } from "@/lib/todos";
import type { DemoRole, PrototypeState } from "@/types/hotel-operations";

export function usePrototypeState() {
  const [state, setState] = useState<PrototypeState>(SEEDED_PROTOTYPE_STATE);
  useEffect(() => { setState(loadPrototypeState()); }, []);

  const addTodo = useCallback((draft: TodoDraft) => {
    const todo = createTodo(draft); const logEntry = createTodoLogEntry(todo);
    setState((currentState) => { const nextState: PrototypeState = { version: 2, todos: [todo, ...currentState.todos], logEntries: [logEntry, ...currentState.logEntries] }; savePrototypeState(nextState); return nextState; });
    return todo;
  }, []);

  const completeTodo = useCallback((todoId: string, role: DemoRole) => {
    setState((currentState) => {
      const todo = currentState.todos.find((item) => item.id === todoId && item.status === "OPEN");
      if (!todo) return currentState;
      const completedTodo = completeTodoRecord(todo, ROLE_LABELS[role]);
      const nextState: PrototypeState = { version: 2, todos: currentState.todos.map((item) => (item.id === todoId ? completedTodo : item)), logEntries: [createCompletionLogEntry(completedTodo), ...currentState.logEntries] };
      savePrototypeState(nextState);
      return nextState;
    });
  }, []);

  return { state, addTodo, completeTodo };
}
