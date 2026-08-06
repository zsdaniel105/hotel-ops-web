import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { OperationsMenu, type AppSection } from "@/components/dashboard/ui/OperationsMenu";
function Harness() { const [section,setSection] = useState<AppSection>("DASHBOARD"); return <><OperationsMenu section={section} onChange={setSection}/><output>{section}</output></>; }
describe("OperationsMenu", () => { it("opens, selects sections, and closes with Escape", async () => { const user=userEvent.setup(); render(<Harness/>); await user.click(screen.getByRole("button",{name:/Operations/})); expect(screen.getByRole("menu")).toBeVisible(); await user.click(screen.getByRole("menuitem",{name:/Lost & Found/})); expect(screen.getByText("LOST_AND_FOUND")).toBeVisible(); expect(screen.queryByRole("menu")).not.toBeInTheDocument(); await user.click(screen.getByRole("button",{name:/Operations/})); await user.keyboard("{Escape}"); expect(screen.queryByRole("menu")).not.toBeInTheDocument(); await user.click(screen.getByRole("button",{name:/Operations/})); await user.click(screen.getByRole("menuitem",{name:/Room PM/})); expect(screen.getByText("ROOM_PM")).toBeVisible(); expect(screen.queryByRole("menu")).not.toBeInTheDocument(); await user.click(screen.getByRole("button",{name:/Operations/})); await user.click(screen.getByRole("menuitem",{name:/Dashboard/})); expect(screen.getByText("DASHBOARD")).toBeVisible(); }); });

describe("Front Desk checklist menu permissions", () => {
  it("shows the checklist only to Front Desk", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<OperationsMenu section="DASHBOARD" role="FRONT_DESK" onChange={() => undefined} />);
    await user.click(screen.getByRole("button", { name: /Operations/ }));
    expect(screen.getByRole("menuitem", { name: /Front Desk Checklist/ })).toBeVisible();
    rerender(<OperationsMenu section="DASHBOARD" role="HOUSEKEEPING_SUPERVISOR" onChange={() => undefined} />);
    expect(screen.queryByRole("menuitem", { name: /Front Desk Checklist/ })).not.toBeInTheDocument();
  });
});
