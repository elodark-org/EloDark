import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../dashboard/status-badge";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("replaces underscores with spaces in status text", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("in progress")).toBeInTheDocument();
  });

  it("applies known status color classes", () => {
    const { container } = render(<StatusBadge status="completed" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("text-green-400");
  });

  it("applies fallback colors for unknown status", () => {
    const { container } = render(<StatusBadge status="unknown_status" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("text-white/60");
  });

  it("applies custom className", () => {
    const { container } = render(<StatusBadge status="pending" className="ml-2" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("ml-2");
  });

  it("renders all known statuses without crashing", () => {
    const statuses = ["pending", "active", "available", "in_progress", "completed", "approved", "cancelled", "rejected"];
    for (const status of statuses) {
      const { unmount } = render(<StatusBadge status={status} />);
      unmount();
    }
  });
});
