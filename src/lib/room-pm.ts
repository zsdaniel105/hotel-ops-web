import type { CompleteRoomPmInput, RoomPmRecord, RoomPmState, RoomPmStatus } from "@/types/room-pm";

const STATUS_ORDER: Record<RoomPmStatus, number> = { OVERDUE: 0, DUE_SOON: 1, NEVER_COMPLETED: 2, CURRENT: 3 };

function localDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getRoomPmStatus(record: RoomPmRecord, now = new Date()): RoomPmStatus {
  if (!record.history.length && record.lastCompletedAt === null) return "NEVER_COMPLETED";
  if (!record.nextDueAt) return "OVERDUE";
  const due = new Date(record.nextDueAt);
  if (Number.isNaN(due.getTime())) return "OVERDUE";
  const today = localDay(now);
  const dueDay = localDay(due);
  if (dueDay < today) return "OVERDUE";
  const fourteenDaysFromToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  return dueDay <= fourteenDaysFromToday.getTime() ? "DUE_SOON" : "CURRENT";
}

export function sortRoomPmRecords(records: RoomPmRecord[], now = new Date()): RoomPmRecord[] {
  return [...records].sort((a, b) => {
    const aStatus = getRoomPmStatus(a, now); const bStatus = getRoomPmStatus(b, now);
    const group = STATUS_ORDER[aStatus] - STATUS_ORDER[bStatus];
    if (group) return group;
    if (aStatus !== "NEVER_COMPLETED") {
      const due = (a.nextDueAt ?? "").localeCompare(b.nextDueAt ?? "");
      if (due) return due;
    }
    return a.roomNumber - b.roomNumber;
  });
}

export const getAllRoomPmRecords = (state: RoomPmState, now = new Date()) => sortRoomPmRecords(state.records, now);
export const getRoomPmRecord = (state: RoomPmState, roomNumber: number) => state.records.find((record) => record.roomNumber === roomNumber) ?? null;
export const getCurrentRoomPmRecords = (state: RoomPmState, now = new Date()) => sortRoomPmRecords(state.records.filter((r) => getRoomPmStatus(r, now) === "CURRENT"), now);
export const getDueSoonRoomPmRecords = (state: RoomPmState, now = new Date()) => sortRoomPmRecords(state.records.filter((r) => getRoomPmStatus(r, now) === "DUE_SOON"), now);
export const getOverdueRoomPmRecords = (state: RoomPmState, now = new Date()) => sortRoomPmRecords(state.records.filter((r) => getRoomPmStatus(r, now) === "OVERDUE"), now);
export const getNeverCompletedRoomPmRecords = (state: RoomPmState, now = new Date()) => sortRoomPmRecords(state.records.filter((r) => getRoomPmStatus(r, now) === "NEVER_COMPLETED"), now);
export function getRoomPmCounts(state: RoomPmState, now = new Date()): Record<RoomPmStatus, number> {
  return state.records.reduce((counts, record) => { counts[getRoomPmStatus(record, now)] += 1; return counts; }, { CURRENT: 0, DUE_SOON: 0, OVERDUE: 0, NEVER_COMPLETED: 0 });
}
export function filterRoomPmRecords(records: RoomPmRecord[], query: string, now = new Date()): RoomPmRecord[] {
  const needle = query.trim().toLowerCase();
  const filtered = needle ? records.filter((r) => [String(r.roomNumber), r.lastCompletedBy, r.lastNote].some((value) => value?.toLowerCase().includes(needle))) : records;
  return sortRoomPmRecords(filtered, now);
}

function validDate(value: string): boolean { return value.trim() !== "" && !Number.isNaN(new Date(value).getTime()); }
function createId(): string { return globalThis.crypto?.randomUUID?.() ?? `room-pm-${Math.random().toString(36).slice(2)}-${new Date().getTime().toString(36)}`; }
export function completeRoomPm(state: RoomPmState, input: CompleteRoomPmInput): RoomPmState {
  const record = getRoomPmRecord(state, input.roomNumber);
  if (!record) throw new Error("Select a valid room number.");
  const completedBy = input.completedBy.trim();
  if (!completedBy) throw new Error("Completed by is required.");
  if (!validDate(input.completedAt)) throw new Error("Enter a valid completion date.");
  if (!validDate(input.nextDueAt)) throw new Error("Enter a valid next due date.");
  if (new Date(input.nextDueAt).getTime() <= new Date(input.completedAt).getTime()) throw new Error("Next due date must be after the completion date.");
  const note = input.note?.trim() || null;
  const completedAt = new Date(input.completedAt).toISOString(); const nextDueAt = new Date(input.nextDueAt).toISOString();
  const entry = { id: createId(), completedAt, completedBy, note, previousDueAt: record.nextDueAt, nextDueAt };
  const updated = { ...record, lastCompletedAt: completedAt, lastCompletedBy: completedBy, nextDueAt, lastNote: note, history: [...record.history, entry], updatedAt: completedAt };
  return { ...state, records: state.records.map((item) => item.roomNumber === input.roomNumber ? updated : item) };
}
export function updateRoomPmSchedule(state: RoomPmState, roomNumber: number, nextDueAt: string): RoomPmState {
  const record = getRoomPmRecord(state, roomNumber);
  if (!record) throw new Error("Select a valid room number.");
  if (!validDate(nextDueAt)) throw new Error("Enter a valid next due date.");
  const due = new Date(nextDueAt).toISOString();
  return { ...state, records: state.records.map((item) => item.roomNumber === roomNumber ? { ...item, nextDueAt: due, updatedAt: due } : item) };
}
