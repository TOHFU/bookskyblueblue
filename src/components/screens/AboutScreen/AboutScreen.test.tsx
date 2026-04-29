import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AboutScreen } from "./AboutScreen";
import { appSystem } from "@/styles/theme";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

function renderScreen() {
  render(
    <ChakraProvider value={appSystem}>
      <AboutScreen />
    </ChakraProvider>,
  );
}

describe("AboutScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("アプリの説明テキストが表示される", () => {
    renderScreen();
    expect(screen.getByText(/BOOK SKY, BLUE BLUEは、/)).toBeInTheDocument();
  });

  it("青空文庫ビューアの説明が表示される", () => {
    renderScreen();
    expect(screen.getByText(/青空文庫の本を検索/)).toBeInTheDocument();
  });

  it("TOPに戻るボタンが表示される", () => {
    renderScreen();
    expect(screen.getByRole("button", { name: "TOPに戻る" })).toBeInTheDocument();
  });

  it("TOPに戻るボタンクリックで router.push('/') が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("tohfu-tronica へのリンクが表示される", () => {
    renderScreen();
    expect(screen.getByRole("link", { name: "tohfu-tronica.netlify.app" })).toBeInTheDocument();
  });
});
