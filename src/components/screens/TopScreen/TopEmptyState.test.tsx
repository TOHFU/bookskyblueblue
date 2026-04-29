import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopEmptyState } from "./TopEmptyState";
import { appSystem } from "@/styles/theme";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

function renderEmptyState(onSearchClick = vi.fn()) {
  render(
    <ChakraProvider value={appSystem}>
      <TopEmptyState onSearchClick={onSearchClick} />
    </ChakraProvider>,
  );
  return { onSearchClick };
}

describe("TopEmptyState", () => {
  it("「作品を追加してみましょう」と表示される", () => {
    renderEmptyState();
    expect(screen.getByText("作品を追加してみましょう")).toBeInTheDocument();
  });

  it("「お気に入りの作品を探してください」メッセージが表示される", () => {
    renderEmptyState();
    expect(screen.getByText("お気に入りの作品を探してください")).toBeInTheDocument();
  });

  it("「作品を検索する」ボタンが表示される", () => {
    renderEmptyState();
    expect(screen.getByRole("button", { name: "作品を検索する" })).toBeInTheDocument();
  });

  it("検索ボタンクリックで onSearchClick が呼ばれる", async () => {
    const { onSearchClick } = renderEmptyState();
    await userEvent.click(screen.getByRole("button", { name: "作品を検索する" }));
    expect(onSearchClick).toHaveBeenCalledOnce();
  });
});
