import { describe, expect, it, vi } from "vitest";
import { formatRequestAge, formatTime, isSameLocalDay } from "@/lib/date-formatting";
import { getDepartmentCounts } from "@/lib/todos";
import { makeTodo } from "@/test/factories";

describe("date formatting", () => {
  it("formats relative request ages", () => {
    const now = new Date("2026-08-05T12:00:00.000Z");
    expect(formatRequestAge("2026-08-05T11:59:30.000Z", now)).toBe("Less than 1m");
    expect(formatRequestAge("2026-08-05T11:55:00.000Z", now)).toBe("5m");
    expect(formatRequestAge("2026-08-05T11:00:00.000Z", now)).toBe("1h");
    expect(formatRequestAge("2026-08-05T09:45:00.000Z", now)).toBe("2h 15m");
    expect(formatRequestAge("2026-08-03T10:00:00.000Z", now)).toBe("2d 2h");
    expect(formatRequestAge("not-a-date", now)).toBe("Invalid date");
  });

  it("compares local days and completed-today counts around controlled midnight", () => {
    vi.setSystemTime(new Date("2026-08-05T00:10:00"));
    expect(isSameLocalDay("2026-08-05T00:05:00", new Date())).toBe(true);
    expect(isSameLocalDay("2026-08-04T23:55:00", new Date())).toBe(false);
    expect(getDepartmentCounts([makeTodo({ status: "COMPLETED", completedAt: "2026-08-05T00:05:00" })], "HOUSEKEEPING_SUPERVISOR", new Date()).completedToday).toBe(1);
    vi.useRealTimers();
  });

  it("formats invalid times safely", () => {
    expect(formatTime("bad-date")).toBe("Invalid date");
  });
});
