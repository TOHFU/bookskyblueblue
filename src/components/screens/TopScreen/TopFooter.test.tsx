import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopFooter } from "./TopFooter";
import { appSystem } from "@/styles/theme";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

describe("TopFooter", () => {
  function renderFooter() {
    render(
      <ChakraProvider value={appSystem}>
        <TopFooter />
      </ChakraProvider>,
    );
  }

  it("footer ロールが存在する", () => {
    renderFooter();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("tohfu-tronica へのリンクが表示される", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: "tohfu-tronica.netlify.app" });
    expect(link).toHaveAttribute("href", "https://tohfu-tronica.netlify.app/");
  });

  it("コピーライトテキストが表示される", () => {
    renderFooter();
    expect(screen.getByText("© tohfu-tronica")).toBeInTheDocument();
  });

  it("フッターロゴの alt テキストが存在する", () => {
    renderFooter();
    expect(screen.getByAltText("BOOK SKY, BLUE BLUE")).toBeInTheDocument();
  });
});
