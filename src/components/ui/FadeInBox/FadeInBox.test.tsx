import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FadeInBox } from "./FadeInBox";
import { appSystem } from "@/styles/theme";

vi.mock("@/hooks/useIntersectionFadeIn", () => ({
  useIntersectionFadeIn: () => ({
    ref: { current: null },
    isVisible: true,
  }),
}));

describe("FadeInBox", () => {
  it("可視時に子要素を描画する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <FadeInBox>
          <p>カード</p>
        </FadeInBox>
      </ChakraProvider>,
    );
    expect(screen.getByText("カード")).toBeInTheDocument();
  });
});
