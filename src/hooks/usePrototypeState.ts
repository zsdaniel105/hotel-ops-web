import { useCallback, useEffect, useRef, useState } from "react";
import { loadPrototypeState, savePrototypeState, SEEDED_PROTOTYPE_STATE } from "@/lib/prototype-storage";
import {
  completeTodo as completeTodoRecord,
  createCompletionLogEntry,
  createDeletionLogEntry,
  createTodo,
  createTodoLogEntry,
  createUpdateLogEntry,
  deleteTodo as deleteTodoRecord,
  ROLE_LABELS,
  updateTodoRecord,
  type TodoDraft,
  type TodoUpdate,
} from "@/lib/todos";
import type { DemoRole, PrototypeState, Todo } from "@/types/hotel-operations";

export function usePrototypeState() {
  const [state, setState] = useState<PrototypeState>(SEEDED_PROTOTYPE_STATE);
  const stateRef = useRef<PrototypeState>(SEEDED_PROTOTYPE_STATE);

  const commitState = useCallback((nextState: PrototypeState) => {
    stateRef.current = nextState;
    savePrototypeState(nextState);
    setState(nextState);
  }, []);

  useEffect(() => {
    const loadedState = loadPrototypeState();
    stateRef.current = loadedState;
    setState(loadedState);
  }, []);

  const addTodo = useCallback(
    (draft: TodoDraft): Todo => {
      const currentState = stateRef.current;
      const todo = createTodo(draft);
      const logEntry = createTodoLogEntry(todo);
      const nextState: PrototypeState = {
        version: 3,
        todos: [todo, ...currentState.todos],
        logEntries: [logEntry, ...currentState.logEntries],
      };

      commitState(nextState);
      return todo;
    },
    [commitState],
  );

  const updateTodo = useCallback(
    (todoId: string, draft: TodoUpdate): Todo | null => {
      const currentState = stateRef.current;
      const before = currentState.todos.find((todo) => todo.id === todoId && todo.status !== "DELETED");

      if (!before) {
        return null;
      }

      const after = updateTodoRecord(before, draft, "Front Desk");

      if (!after) {
        return null;
      }

      const nextState: PrototypeState = {
        version: 3,
        todos: currentState.todos.map((todo) => (todo.id === todoId ? after : todo)),
        logEntries: [createUpdateLogEntry(before, after), ...currentState.logEntries],
      };

      commitState(nextState);
      return after;
    },
    [commitState],
  );

  const completeTodo = useCallback(
    (todoId: string, role: DemoRole): Todo | null => {
      const currentState = stateRef.current;
      const todo = currentState.todos.find((item) => item.id === todoId && item.status === "OPEN");

      if (!todo) {
        return null;
      }

      const completedTodo = completeTodoRecord(todo, ROLE_LABELS[role]);

      if (!completedTodo) {
        return null;
      }

      const nextState: PrototypeState = {
        version: 3,
        todos: currentState.todos.map((item) => (item.id === todoId ? completedTodo : item)),
        logEntries: [createCompletionLogEntry(completedTodo), ...currentState.logEntries],
      };

      commitState(nextState);
      return completedTodo;
    },
    [commitState],
  );

  const deleteTodo = useCallback(
    (todoId: string): Todo | null => {
      const currentState = stateRef.current;
      const todo = currentState.todos.find((item) => item.id === todoId && item.status !== "DELETED");

      if (!todo) {
        return null;
      }

      const deletedTodo = deleteTodoRecord(todo, "Front Desk");

      if (!deletedTodo) {
        return null;
      }

      const nextState: PrototypeState = {
        version: 3,
        todos: currentState.todos.map((item) => (item.id === todoId ? deletedTodo : item)),
        logEntries: [createDeletionLogEntry(deletedTodo), ...currentState.logEntries],
      };

      commitState(nextState);
      return deletedTodo;
    },
    [commitState],
  );

  return { state, addTodo, updateTodo, completeTodo, deleteTodo };
}
