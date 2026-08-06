import type { LostFoundDraft, LostFoundItem, LostFoundState, LostFoundStatus } from "@/types/lost-found";

export const LOST_FOUND_CATEGORY_LABELS = { ELECTRONICS: "Electronics", CLOTHING: "Clothing", JEWELRY: "Jewelry", IDENTIFICATION: "Identification", WALLET_OR_MONEY: "Wallet or Money", KEYS: "Keys", BAG: "Bag", OTHER: "Other" } as const;
function id() { return globalThis.crypto?.randomUUID?.() ?? `lf-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
export function createLostFoundItem(draft: LostFoundDraft, now = new Date().toISOString()): LostFoundItem { return { ...draft, id: id(), status: "OPEN", createdAt: now, updatedAt: now, claimedAt: null, returnedAt: null, disposedAt: null }; }
export function updateLostFoundItem(item: LostFoundItem, draft: LostFoundDraft, now = new Date().toISOString()): LostFoundItem | null { const next = { ...item, ...draft }; return (Object.keys(draft) as (keyof LostFoundDraft)[]).every((key) => Object.is(item[key], next[key])) ? null : { ...next, updatedAt: now }; }
function transition(item: LostFoundItem, status: LostFoundStatus, allowed: LostFoundStatus[], now: string): LostFoundItem | null { if (!allowed.includes(item.status)) return null; return { ...item, status, updatedAt: now, claimedAt: status === "CLAIMED" ? now : null, returnedAt: status === "RETURNED" ? now : null, disposedAt: status === "DISPOSED" ? now : null }; }
export const markLostFoundClaimed = (item: LostFoundItem, now = new Date().toISOString()) => transition(item, "CLAIMED", ["OPEN"], now);
export const markLostFoundReturned = (item: LostFoundItem, now = new Date().toISOString()) => transition(item, "RETURNED", ["OPEN", "CLAIMED"], now);
export const markLostFoundDisposed = (item: LostFoundItem, now = new Date().toISOString()) => transition(item, "DISPOSED", ["OPEN"], now);
export const reopenLostFoundItem = (item: LostFoundItem, now = new Date().toISOString()) => transition(item, "OPEN", ["CLAIMED", "RETURNED", "DISPOSED"], now);
function sort(items: LostFoundItem[], status?: LostFoundStatus) { return [...items].sort((a, b) => { const at = status === "RETURNED" ? a.returnedAt : status === "DISPOSED" ? a.disposedAt : a.foundAt; const bt = status === "RETURNED" ? b.returnedAt : status === "DISPOSED" ? b.disposedAt : b.foundAt; return (bt ?? "").localeCompare(at ?? "") || a.id.localeCompare(b.id); }); }
export const getOpenLostFoundItems = (items: LostFoundItem[]) => sort(items.filter((i) => i.status === "OPEN"), "OPEN");
export const getClaimedLostFoundItems = (items: LostFoundItem[]) => sort(items.filter((i) => i.status === "CLAIMED"), "CLAIMED");
export const getReturnedLostFoundItems = (items: LostFoundItem[]) => sort(items.filter((i) => i.status === "RETURNED"), "RETURNED");
export const getDisposedLostFoundItems = (items: LostFoundItem[]) => sort(items.filter((i) => i.status === "DISPOSED"), "DISPOSED");
export const getAllLostFoundItems = (items: LostFoundItem[]) => sort(items);
export function getLostFoundCounts(items: LostFoundItem[]) { return { OPEN: items.filter((i) => i.status === "OPEN").length, CLAIMED: items.filter((i) => i.status === "CLAIMED").length, RETURNED: items.filter((i) => i.status === "RETURNED").length, DISPOSED: items.filter((i) => i.status === "DISPOSED").length }; }
export function filterLostFoundItems(items: LostFoundItem[], query: string) { const q = query.trim().toLowerCase(); if (!q) return items; return items.filter((i) => [i.itemName, i.description, LOST_FOUND_CATEGORY_LABELS[i.category], i.foundLocation, i.storageLocation, i.roomNumber?.toString(), i.guestName, i.guestContact].some((v) => v?.toLowerCase().includes(q))); }
export function replaceItem(state: LostFoundState, itemId: string, change: (item: LostFoundItem) => LostFoundItem | null): LostFoundState | null { const current = state.items.find((i) => i.id === itemId); if (!current) return null; const next = change(current); return next ? { version: 1, items: state.items.map((i) => i.id === itemId ? next : i) } : null; }
