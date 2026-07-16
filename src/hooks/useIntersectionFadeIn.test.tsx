import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIntersectionFadeIn } from "./useIntersectionFadeIn";

function TestTarget() {
  const { ref, isVisible } = useIntersectionFadeIn<HTMLDivElement>();
  return <div ref={ref}>{isVisible ? "visible" : "hidden"}</div>;
}

function mockBoundingClientRect(rect: Pick<DOMRect, "top" | "bottom">) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: rect.top,
    bottom: rect.bottom,
    left: 0,
    right: 0,
    width: 0,
    height: rect.bottom - rect.top,
    x: 0,
    y: rect.top,
    toJSON: () => ({}),
  });
}

describe("useIntersectionFadeIn", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("マウント時点で画面内にある要素はIntersectionObserverの通知を待たずに即時可視化する", () => {
    mockBoundingClientRect({ top: 10, bottom: 20 });

    render(<TestTarget />);

    expect(screen.getByText("visible")).toBeInTheDocument();
  });

  it("マウント時点で画面外にある要素はIntersectionObserverの通知が来るまで非表示のままにする", () => {
    mockBoundingClientRect({ top: 10000, bottom: 10010 });

    render(<TestTarget />);

    expect(screen.getByText("hidden")).toBeInTheDocument();
  });
});
