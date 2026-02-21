import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-white/5");
  });

  it("applies gradient variant styles", () => {
    const { container } = render(<Badge variant="gradient">Premium</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-gradient-to-r");
  });

  it("applies custom className", () => {
    const { container } = render(<Badge className="ml-4">Custom</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("ml-4");
  });
});
