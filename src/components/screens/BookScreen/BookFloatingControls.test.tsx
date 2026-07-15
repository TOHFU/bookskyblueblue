import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookFloatingControls } from "./BookFloatingControls";
import { appSystem } from "@/styles/theme";

function renderControls(
  overrides: Partial<React.ComponentProps<typeof BookFloatingControls>> = {},
) {
  const props = {
    visible: true,
    currentPage: 1,
    pageCount: 10,
    isCurrentPageBookmarked: false,
    onPrevPage: vi.fn(),
    onNextPage: vi.fn(),
    onToggleBookmark: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };

  render(
    <ChakraProvider value={appSystem}>
      <BookFloatingControls {...props} />
    </ChakraProvider>,
  );

  return props;
}

describe("BookFloatingControls", () => {
  it("読書操作ナビとして描画される", () => {
    renderControls();
    expect(
      screen.getByRole("navigation", { name: "読書操作" }),
    ).toBeInTheDocument();
  });

  it("ブックマーク状態を aria-pressed で伝える", () => {
    renderControls({ isCurrentPageBookmarked: true });
    expect(
      screen.getByRole("button", { name: "ブックマークを解除" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("次のページボタンで onNextPage を呼ぶ", async () => {
    const { onNextPage } = renderControls();
    await userEvent.click(screen.getByRole("button", { name: "次のページ" }));
    expect(onNextPage).toHaveBeenCalledOnce();
  });

  it("最終ページでは次へを無効化する", () => {
    renderControls({ currentPage: 9, pageCount: 10 });
    expect(screen.getByRole("button", { name: "次のページ" })).toBeDisabled();
  });

  it("閉じるボタンで onClose を呼ぶ", async () => {
    const { onClose } = renderControls();
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
