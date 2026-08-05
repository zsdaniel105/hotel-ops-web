import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriorityBadge } from "@/components/dashboard/ui/Badge";

describe("PriorityBadge", () => {
  it("renders accessible urgent and normal priorities", () => {
    render(<><PriorityBadge priority="URGENT" /><PriorityBadge priority="NORMAL" /></>);
    expect(screen.getByLabelText("Priority: Urgent")).toHaveTextContent("Urgent");
    expect(screen.getByLabelText("Priority: Normal")).toHaveTextContent("Normal");
  });
});
