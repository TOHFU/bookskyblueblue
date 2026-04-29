import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchEmptyState } from "./SearchEmptyState";
import { appSystem } from "@/styles/theme";

function renderEmptyState(props: Partial<React.ComponentProps<typeof SearchEmptyState>> = {}) {
  const onSampleClick = props.onSampleClick ?? vi.fn();
  render(
    <ChakraProvider value={appSystem}>
      <SearchEmptyState
        query={props.query ?? "検索ワード"}
        onSampleClick={onSampleClick}
      />
    </ChakraProvider>,
  );
  return { onSampleClick };
}

describe("SearchEmptyState", () => {
  it("「該当する作品がありません」と表示される（SEARCH-EMPTYSTATE仕様）", () => {
    renderEmptyState();
    expect(screen.getByText("該当する作品がありません")).toBeInTheDocument();
  });

  it("「別のキーワードで検索してください」メッセージが表示される", () => {
    renderEmptyState();
    expect(screen.getByText("別のキーワードで検索してください")).toBeInTheDocument();
  });

  it("サンプル検索条件「夏目漱石」が表示される", () => {
    renderEmptyState();
    expect(screen.getByRole("button", { name: "夏目漱石で検索" })).toBeInTheDocument();
  });

  it("サンプル検索条件「檸檬」が表示される", () => {
    renderEmptyState();
    expect(screen.getByRole("button", { name: "檸檬で検索" })).toBeInTheDocument();
  });

  it("サンプルクリックで onSampleClick がそのキーワードで呼ばれる", async () => {
    const { onSampleClick } = renderEmptyState();
    await userEvent.click(screen.getByRole("button", { name: "夏目漱石で検索" }));
    expect(onSampleClick).toHaveBeenCalledWith("夏目漱石");
  });
});
