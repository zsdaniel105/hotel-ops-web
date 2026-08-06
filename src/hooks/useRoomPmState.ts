import { useCallback, useRef, useSyncExternalStore } from "react";
import { completeRoomPm, updateRoomPmSchedule } from "@/lib/room-pm";
import { loadRoomPmState, saveRoomPmState, SEEDED_ROOM_PM_STATE } from "@/lib/room-pm-storage";
import type { CompleteRoomPmInput, RoomPmState } from "@/types/room-pm";

let snapshot: RoomPmState | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
const clientSnapshot = () => snapshot ??= loadRoomPmState();
const serverSnapshot = () => SEEDED_ROOM_PM_STATE;
function publish(state: RoomPmState): void { snapshot = state; saveRoomPmState(state); listeners.forEach((listener) => listener()); }

export function useRoomPmState() {
  const state = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const stateRef = useRef(state); stateRef.current = state;
  const commit = useCallback((next: RoomPmState) => { stateRef.current = next; publish(next); return next; }, []);
  return {
    state,
    completeRoomPm: useCallback((input: CompleteRoomPmInput) => commit(completeRoomPm(stateRef.current, input)), [commit]),
    updateRoomPmSchedule: useCallback((roomNumber: number, nextDueAt: string) => commit(updateRoomPmSchedule(stateRef.current, roomNumber, nextDueAt)), [commit]),
  };
}
