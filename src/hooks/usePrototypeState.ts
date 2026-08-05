import { useCallback, useEffect, useState } from "react";
import { loadPrototypeState, savePrototypeState, SEEDED_PROTOTYPE_STATE } from "@/lib/prototype-storage";
import { createTodo, createTodoLogEntry, type TodoDraft } from "@/lib/todos";
import type { PrototypeState } from "@/types/hotel-operations";

export function usePrototypeState() {
  const [state, setState] = useState<PrototypeState>(SEEDED_PROTOTYPE_STATE);

  useEffect(() => {
    setState(loadPrototypeState());
  }, []);

  const addTodo = useCallback((draft: TodoDraft) => {
    const todo = createTodo(draft);
    const logEntry = createTodoLogEntry(todo);
    setState((currentState) => {
      const nextState: PrototypeState = {
        version: 1,
        todos: [todo, ...currentState.todos],
        logEntries: [logEntry, ...currentState.logEntries],
      };
      savePrototypeState(nextState);
      return nextState;
    });
    return todo;
  }, []);

  return { state, addTodo };
}
