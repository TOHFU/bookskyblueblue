import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OfflineScreen } from "./OfflineScreen";
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
      <OfflineScreen />
    </ChakraProvider>,
  );
}

describe("OfflineScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("オフラインの説明テキストが表示される", () => {
    renderScreen();
    expect(screen.getByText(/オフラインのようです/)).toBeInTheDocument();
  });

  it("TOPに戻るボタンが表示される", () => {
    renderScreen();
    expect(screen.getAllByRole("button", { name: "TOPに戻る" }).length).toBeGreaterThanOrEqual(1);
  });

  it("TOPに戻るボタンクリックで router.push('/') が呼ばれる", async () => {
    renderScreen();
    const buttons = screen.getAllByRole("button", { name: "TOPに戻る" });
    await userEvent.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("tohfu-tronica へのリンクが表示される", () => {
    renderScreen();
    expect(screen.getByRole("link", { name: "tohfu-tronica.netlify.app" })).toBeInTheDocument();
  });
});
