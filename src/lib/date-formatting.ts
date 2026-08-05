export function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatRequestAge(createdAt: string, now: Date): string {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "Invalid date";
  const minutes = Math.max(0, Math.floor((now.getTime() - created.getTime()) / 60_000));
  if (minutes < 1) return "Less than 1m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
}

export function isSameLocalDay(value: string, now: Date): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
