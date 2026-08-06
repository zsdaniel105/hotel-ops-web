export type RoomPmStatus = "CURRENT" | "DUE_SOON" | "OVERDUE" | "NEVER_COMPLETED";

export type RoomPmHistoryEntry = {
  id: string;
  completedAt: string;
  completedBy: string;
  note: string | null;
  previousDueAt: string | null;
  nextDueAt: string;
};

export type RoomPmRecord = {
  roomNumber: number;
  lastCompletedAt: string | null;
  lastCompletedBy: string | null;
  nextDueAt: string | null;
  lastNote: string | null;
  history: RoomPmHistoryEntry[];
  updatedAt: string;
};

export type RoomPmState = { version: 1; records: RoomPmRecord[] };

export type CompleteRoomPmInput = {
  roomNumber: number;
  completedBy: string;
  completedAt: string;
  nextDueAt: string;
  note?: string;
};
