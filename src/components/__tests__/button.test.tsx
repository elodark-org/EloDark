import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../ui/button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies primary variant by default", () => {
    const { container } = render(<Button>Primary</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("bg-gradient-to-r");
  });

  it("applies outline variant", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("bg-transparent");
  });

  it("applies ghost variant", () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("bg-white/5");
  });

  it("applies size classes", () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    expect((sm.firstChild as HTMLElement).className).toContain("px-4 py-2");

    const { container: lg } = render(<Button size="lg">Large</Button>);
    expect((lg.firstChild as HTMLElement).className).toContain("px-8 py-4");
  });

  it("forwards disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("forwards type prop", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText("Submit")).toHaveAttribute("type", "submit");
  });

  it("applies custom className", () => {
    const { container } = render(<Button className="w-full">Full</Button>);
    expect((container.firstChild as HTMLElement).className).toContain("w-full");
  });
});
