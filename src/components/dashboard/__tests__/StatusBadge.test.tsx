import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/dashboard/ui/Badge";

describe("StatusBadge", () => {
  it.each([["OPEN", "Open"], ["IN_PROGRESS", "In Progress"], ["UNABLE_TO_COMPLETE", "Unable to Complete"], ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"]] as const)("renders %s as text", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeVisible();
  });
});
