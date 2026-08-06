import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/dashboard/ui/Modal";

function NestedHarness() {
  const [parent, setParent] = useState(false);
  const [child, setChild] = useState(false);
  return <><button onClick={() => setParent(true)}>Open parent</button>{parent ? <Modal title="Parent drawer" onClose={() => setParent(false)}><button onClick={() => setChild(true)}>Delete Request</button><button>Second</button>{child ? <Modal title="Delete request" onClose={() => setChild(false)}><button>Confirm</button></Modal> : null}</Modal> : null}</>;
}

describe("Modal", () => {
  it("labels, traps focus, escapes, and restores focus", async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(<><button>Opener</button><Modal title="Request details" onClose={close}><button>First</button><button>Last</button></Modal></>);
    expect(screen.getByRole("dialog", { name: "Request details" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(close).toHaveBeenCalledTimes(1);
    await user.tab();
    await user.keyboard("{Escape}");
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("closes nested confirmation before parent", async () => {
    const user = userEvent.setup();
    render(<NestedHarness />);
    await user.click(screen.getByRole("button", { name: "Open parent" }));
    await user.click(screen.getByRole("button", { name: "Delete Request" }));
    expect(screen.getByRole("dialog", { name: "Delete request" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Delete request" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Parent drawer" })).toBeVisible();
  });
});
