import { beforeEach, describe, expect, it } from "vitest";
import { completeRoomPm, filterRoomPmRecords, getRoomPmCounts, getRoomPmStatus, sortRoomPmRecords, updateRoomPmSchedule } from "@/lib/room-pm";
import { loadRoomPmState, parseRoomPmState, ROOM_PM_STORAGE_KEY, saveRoomPmState, SEEDED_ROOM_PM_STATE } from "@/lib/room-pm-storage";
import type { RoomPmRecord, RoomPmState } from "@/types/room-pm";

const now = new Date(2026, 7, 6, 23, 59);
const never = (roomNumber: number): RoomPmRecord => ({ roomNumber, lastCompletedAt: null, lastCompletedBy: null, nextDueAt: null, lastNote: null, history: [], updatedAt: "2026-01-01T00:00:00.000Z" });
const done = (roomNumber: number, nextDueAt: string): RoomPmRecord => ({ roomNumber, lastCompletedAt: "2026-01-01T12:00:00.000Z", lastCompletedBy: "Alex", nextDueAt, lastNote: "Filter note", history: [{ id: String(roomNumber), completedAt: "2026-01-01T12:00:00.000Z", completedBy: "Alex", note: null, previousDueAt: null, nextDueAt }], updatedAt: "2026-01-01T12:00:00.000Z" });

describe("Room PM storage", () => {
  beforeEach(() => localStorage.clear());
  it("loads valid v1 state and safely rejects malformed or invalid state", () => { const state: RoomPmState = { version: 1, records: [never(101)] }; expect(parseRoomPmState(JSON.stringify(state))).toEqual(state); expect(parseRoomPmState("{")) .toBeNull(); expect(parseRoomPmState('{"version":1,"records":[{}]}')).toBeNull(); });
  it("saves, reloads, and hydrates every room", () => { const state: RoomPmState = { version: 1, records: [never(101)] }; saveRoomPmState(state); expect(localStorage.getItem(ROOM_PM_STORAGE_KEY)).toBeTruthy(); const loaded = loadRoomPmState(); expect(loaded.records).toHaveLength(180); expect(loaded.records[0]).toEqual(state.records[0]); });
  it("seeds every hotel room exactly once", () => { expect(SEEDED_ROOM_PM_STATE.records).toHaveLength(180); expect(new Set(SEEDED_ROOM_PM_STATE.records.map((r) => r.roomNumber)).size).toBe(180); });
});

describe("Room PM status and selectors", () => {
  it("calculates never, overdue, due-soon boundaries, and current", () => { expect(getRoomPmStatus(never(101), now)).toBe("NEVER_COMPLETED"); expect(getRoomPmStatus(done(102, "2026-08-05T23:59:00"), now)).toBe("OVERDUE"); expect(getRoomPmStatus(done(103, "2026-08-20T00:00:00"), now)).toBe("DUE_SOON"); expect(getRoomPmStatus(done(104, "2026-08-21T00:00:00"), now)).toBe("CURRENT"); });
  it("uses local calendar days around midnight", () => { expect(getRoomPmStatus(done(101, "2026-08-06T00:01:00"), now)).toBe("DUE_SOON"); });
  it("counts, filters, searches and sorts deterministically", () => { const records = [done(104, "2026-09-01"), never(106), done(103, "2026-08-03"), never(105), done(102, "2026-08-12")]; const state: RoomPmState = { version: 1, records }; expect(getRoomPmCounts(state, now)).toEqual({ CURRENT: 1, DUE_SOON: 1, OVERDUE: 1, NEVER_COMPLETED: 2 }); expect(filterRoomPmRecords(records, "Alex", now)).toHaveLength(3); expect(filterRoomPmRecords(records, "Filter note", now)).toHaveLength(3); expect(sortRoomPmRecords(records, now).map((r) => r.roomNumber)).toEqual([103, 102, 105, 106, 104]); });
});

describe("Room PM mutations", () => {
  it("completion creates history and updates completion and due fields", () => { const state: RoomPmState = { version: 1, records: [never(101)] }; const next = completeRoomPm(state, { roomNumber: 101, completedBy: " Manager ", completedAt: "2026-08-06T12:00:00", nextDueAt: "2026-10-06T12:00:00", note: " Checked " }); const record = next.records[0]; expect(record.history).toHaveLength(1); expect(record.lastCompletedBy).toBe("Manager"); expect(record.lastNote).toBe("Checked"); expect(record.nextDueAt).toContain("2026-10-06"); });
  it("rejects an invalid next date", () => { expect(() => completeRoomPm({ version: 1, records: [never(101)] }, { roomNumber: 101, completedBy: "Manager", completedAt: "2026-08-06", nextDueAt: "2026-08-05" })).toThrow(/after/); });
  it("schedule edits preserve history", () => { const record = done(101, "2026-08-10"); const next = updateRoomPmSchedule({ version: 1, records: [record] }, 101, "2026-09-10"); expect(next.records[0].history).toEqual(record.history); expect(next.records[0].lastCompletedAt).toBe(record.lastCompletedAt); });
});
