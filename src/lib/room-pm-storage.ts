import { buildRooms } from "@/lib/rooms";
import type { RoomPmHistoryEntry, RoomPmRecord, RoomPmState } from "@/types/room-pm";

export const ROOM_PM_STORAGE_KEY = "hotel-ops-web:room-pm:v1";
const SEED_UPDATED_AT = "2026-08-01T12:00:00.000Z";
function blank(roomNumber: number): RoomPmRecord { return { roomNumber, lastCompletedAt: null, lastCompletedBy: null, nextDueAt: null, lastNote: null, history: [], updatedAt: SEED_UPDATED_AT }; }
function completed(roomNumber: number, completedAt: string, nextDueAt: string, completedBy = "Maintenance Manager", note: string | null = null): RoomPmRecord {
  const history: RoomPmHistoryEntry[] = [{ id: `room-pm-seed-${roomNumber}`, completedAt, completedBy, note, previousDueAt: null, nextDueAt }];
  return { roomNumber, lastCompletedAt: completedAt, lastCompletedBy: completedBy, nextDueAt, lastNote: note, history, updatedAt: completedAt };
}
const seeded = new Map([
  [101, completed(101, "2026-05-01T12:00:00.000Z", "2026-08-01T12:00:00.000Z", "Avery Stone", "Replaced bathroom seal")],
  [102, completed(102, "2026-05-15T12:00:00.000Z", "2026-08-15T12:00:00.000Z", "Morgan Lee")],
  [103, completed(103, "2026-07-01T12:00:00.000Z", "2026-10-01T12:00:00.000Z", "Taylor Brooks")],
  [104, completed(104, "2026-07-15T12:00:00.000Z", "2026-11-15T12:00:00.000Z", "Taylor Brooks", "HVAC inspected")],
]);
export const SEEDED_ROOM_PM_STATE: RoomPmState = { version: 1, records: buildRooms().map((room) => seeded.get(room.number) ?? blank(room.number)) };

function isNullableString(value: unknown): boolean { return value === null || typeof value === "string"; }
function isHistory(value: unknown): value is RoomPmHistoryEntry { if (!value || typeof value !== "object") return false; const h = value as Partial<RoomPmHistoryEntry>; return typeof h.id === "string" && typeof h.completedAt === "string" && typeof h.completedBy === "string" && isNullableString(h.note) && isNullableString(h.previousDueAt) && typeof h.nextDueAt === "string"; }
function isRecord(value: unknown): value is RoomPmRecord { if (!value || typeof value !== "object") return false; const r = value as Partial<RoomPmRecord>; return typeof r.roomNumber === "number" && Number.isInteger(r.roomNumber) && isNullableString(r.lastCompletedAt) && isNullableString(r.lastCompletedBy) && isNullableString(r.nextDueAt) && isNullableString(r.lastNote) && Array.isArray(r.history) && r.history.every(isHistory) && typeof r.updatedAt === "string"; }
export function parseRoomPmState(raw: string | null): RoomPmState | null { try { const value: unknown = raw ? JSON.parse(raw) : null; if (!value || typeof value !== "object") return null; const state = value as Partial<RoomPmState>; if (state.version !== 1 || !Array.isArray(state.records) || !state.records.every(isRecord)) return null; const roomNumbers = state.records.map((r) => r.roomNumber); return new Set(roomNumbers).size === roomNumbers.length ? state as RoomPmState : null; } catch { return null; } }
function hydrateRooms(state: RoomPmState): RoomPmState { const persisted = new Map(state.records.map((record) => [record.roomNumber, record])); return { version: 1, records: buildRooms().map((room) => persisted.get(room.number) ?? blank(room.number)) }; }
export function loadRoomPmState(): RoomPmState { if (typeof window === "undefined") return SEEDED_ROOM_PM_STATE; try { const parsed = parseRoomPmState(localStorage.getItem(ROOM_PM_STORAGE_KEY)); return parsed ? hydrateRooms(parsed) : SEEDED_ROOM_PM_STATE; } catch { return SEEDED_ROOM_PM_STATE; } }
export function saveRoomPmState(state: RoomPmState): void { if (typeof window !== "undefined") localStorage.setItem(ROOM_PM_STORAGE_KEY, JSON.stringify(state)); }
