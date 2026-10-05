import { AppError } from "./errors";
export function objectBody(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new AppError("VALIDATION", "A JSON object is required.", 400); return value as Record<string, unknown>; }
export function requiredText(value: unknown, label: string, max = 2000): string { if (typeof value !== "string" || !value.trim()) throw new AppError("VALIDATION", `${label} is required.`, 400); const text=value.trim(); if(text.length>max) throw new AppError("VALIDATION", `${label} is too long.`, 400); return text; }
export function optionalText(value: unknown, label: string, max = 2000): string | null { if(value == null || value === "") return null; return requiredText(value,label,max); }
