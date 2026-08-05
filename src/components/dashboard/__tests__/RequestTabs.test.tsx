import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Tabs } from "@/components/dashboard/ui/Tabs";

function Harness() {
  const [tab, setTab] = useState("OPEN");
  return <Tabs label="Requests" value={tab} onChange={setTab} tabs={[{ value: "OPEN", label: "Open", count: 1 }, { value: "COMPLETED", label: "Completed", count: 2 }, { value: "ALL", label: "All", count: 3 }]}><p>{tab}</p></Tabs>;
}

describe("Tabs", () => {
  it("supports clicks and roving keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole("tab", { name: /Open 1/ })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: /Completed 2/ }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("COMPLETED");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("ALL");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("OPEN");
    await user.keyboard("{End}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("ALL");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("COMPLETED");
  });
});
