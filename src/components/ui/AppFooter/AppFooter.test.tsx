import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppFooter } from "./AppFooter";
import { appSystem } from "@/styles/theme";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

describe("AppFooter", () => {
  it("ブランドロゴの代替テキストを提供する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <AppFooter />
      </ChakraProvider>,
    );
    expect(screen.getByAltText("BOOK SKY, BLUE BLUE")).toBeInTheDocument();
  });

  it("外部サイトへのリンクを新しいタブで開く", () => {
    render(
      <ChakraProvider value={appSystem}>
        <AppFooter />
      </ChakraProvider>,
    );
    const link = screen.getByRole("link", {
      name: "tohfu-tronica.netlify.app",
    });
    expect(link).toHaveAttribute("href", "https://tohfu-tronica.netlify.app/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
