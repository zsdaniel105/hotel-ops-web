import type { DemoRole } from "@/types/hotel-operations";
export type AnnouncementAudience = "ALL" | "FRONT_DESK" | "HOUSEKEEPING" | "MAINTENANCE";
export type AnnouncementPriority = "NORMAL" | "IMPORTANT" | "URGENT";
export type AnnouncementDisplayStatus = "SCHEDULED" | "ACTIVE" | "EXPIRED" | "ARCHIVED";
export type AnnouncementReadReceipt = { id:string; employeeName:string; role:DemoRole; readAt:string };
export type Announcement = { id:string; title:string; message:string; audience:AnnouncementAudience; priority:AnnouncementPriority; isPinned:boolean; startsAt:string; expiresAt:string|null; createdByName:string; createdByRole:DemoRole; createdAt:string; updatedAt:string; archivedAt:string|null; archivedByName:string|null; archivedByRole:DemoRole|null; readReceipts:AnnouncementReadReceipt[] };
export type AnnouncementReaderProfiles = Partial<Record<DemoRole,string>>;
export type AnnouncementState = { version:1; announcements:Announcement[]; readerProfiles:AnnouncementReaderProfiles };
export type AnnouncementDraft = Pick<Announcement,"title"|"message"|"audience"|"priority"|"isPinned"|"startsAt"|"expiresAt">;
