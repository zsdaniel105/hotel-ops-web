import type { FrontDeskShift } from "@/types/front-desk-checklist";

export type ShiftHandoffStatus = "NOT_STARTED" | "DRAFT" | "SUBMITTED" | "ACKNOWLEDGED";
export type ShiftHandoffCategory = "GUEST_ISSUE" | "ROOM_STATUS" | "VIP_OR_SPECIAL_REQUEST" | "BILLING_OR_COMPENSATION" | "HOUSEKEEPING_OR_MAINTENANCE" | "TIME_SENSITIVE_REQUEST" | "SECURITY_OR_INCIDENT" | "MANAGER_FOLLOW_UP" | "GENERAL";
export type ShiftHandoffPriority = "NORMAL" | "URGENT";
export type ShiftHandoffItem = { id:string; category:ShiftHandoffCategory; priority:ShiftHandoffPriority; title:string; details:string; roomNumber:number|null; requiresFollowUp:boolean; createdAt:string; updatedAt:string };
export type ShiftHandoff = { id:string; localDate:string; fromShift:FrontDeskShift; toLocalDate:string; toShift:FrontDeskShift; items:ShiftHandoffItem[]; generalNotes:string|null; nothingToReport:boolean; submittedBy:string|null; submittedAt:string|null; acknowledgedBy:string|null; acknowledgedAt:string|null; acknowledgementNote:string|null; createdAt:string; updatedAt:string };
export type ShiftHandoffState = { version:1; handoffs:ShiftHandoff[] };
export type HandoffNavigationTarget = { localDate:string; fromShift:FrontDeskShift };
export type ShiftHandoffItemInput = Omit<ShiftHandoffItem,"id"|"createdAt"|"updatedAt">;
