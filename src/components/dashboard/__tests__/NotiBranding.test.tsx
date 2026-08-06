import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "@/components/dashboard/Dashboard";

describe("Noti branding", () => {
  const scrollTo = vi.fn();
  beforeEach(() => { localStorage.clear(); scrollTo.mockClear(); vi.stubGlobal("scrollTo", scrollTo); });
  it("shows the Noti identity and uses its accessible home button from operational sections", async () => { const user = userEvent.setup(); render(<Dashboard />); expect(screen.getByText("Noti")).toBeVisible(); expect(screen.getByText("Hotel Operations")).toBeVisible(); const home = screen.getByRole("button", { name: "Go to Dashboard" }); await user.click(screen.getByRole("button", { name: /Operations/ })); await user.click(screen.getByRole("menuitem", { name: /Lost & Found/ })); expect(screen.getByRole("heading", { name: "Lost & Found" })).toBeVisible(); await user.click(home); expect(screen.getByRole("heading", { name: "Front Desk Operations" })).toBeVisible(); await user.click(screen.getByRole("button", { name: /Operations/ })); await user.click(screen.getByRole("menuitem", { name: /Room PM/ })); expect(screen.getByRole("heading", { name: "Room PM" })).toBeVisible(); await user.click(home); expect(screen.getByRole("heading", { name: "Front Desk Operations" })).toBeVisible(); expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" }); });
});
