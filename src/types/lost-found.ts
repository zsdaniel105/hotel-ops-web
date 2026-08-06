export type LostFoundStatus = "OPEN" | "CLAIMED" | "RETURNED" | "DISPOSED";
export type LostFoundCategory = "ELECTRONICS" | "CLOTHING" | "JEWELRY" | "IDENTIFICATION" | "WALLET_OR_MONEY" | "KEYS" | "BAG" | "OTHER";
export type LostFoundItem = { id: string; itemName: string; category: LostFoundCategory; description: string; foundAt: string; foundLocation: string; roomNumber: number | null; storageLocation: string; guestName: string | null; guestContact: string | null; notes: string | null; status: LostFoundStatus; createdAt: string; updatedAt: string; claimedAt: string | null; returnedAt: string | null; disposedAt: string | null };
export type LostFoundState = { version: 1; items: LostFoundItem[] };
export type LostFoundDraft = Omit<LostFoundItem, "id" | "status" | "createdAt" | "updatedAt" | "claimedAt" | "returnedAt" | "disposedAt">;
