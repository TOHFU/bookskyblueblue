import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { SearchScreen } from "./SearchScreen";
import { appSystem } from "@/styles/theme";
import { server } from "@tests/mocks/server";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
  }),
}));

const mockWorks = [
  {
    id: "001",
    title: "坊っちゃん",
    author: "夏目漱石",
    identifier: "natsume_soseki_001",
    htmlUrl: "https://example.com/work.html",
  },
  {
    id: "002",
    title: "吾輩は猫である",
    author: "夏目漱石",
    identifier: "natsume_soseki_002",
    htmlUrl: "https://example.com/work2.html",
  },
];

function renderScreen() {
  render(
    <ChakraProvider value={appSystem}>
      <SearchScreen />
    </ChakraProvider>,
  );
}

describe("SearchScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    server.use(
      http.get("http://localhost/api/works", () => HttpResponse.json(mockWorks)),
    );
  });

  it("検索入力フィールドが表示される", () => {
    renderScreen();
    expect(screen.getByRole("textbox", { name: "作品を検索" })).toBeInTheDocument();
  });

  it("TOPに戻るボタンが表示される", () => {
    renderScreen();
    expect(screen.getByRole("button", { name: "TOPに戻る" })).toBeInTheDocument();
  });

  it("検索フィールドに入力するとAPIが呼ばれて結果が表示される", async () => {
    renderScreen();
    const input = screen.getByRole("textbox", { name: "作品を検索" });
    await userEvent.type(input, "夏目漱石");
    await waitFor(() => {
      expect(screen.getByText("坊っちゃん")).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(screen.getByText("吾輩は猫である")).toBeInTheDocument();
  });

  it("検索結果が0件のとき EmptyState が表示される", async () => {
    server.use(
      http.get("http://localhost/api/works", () => HttpResponse.json([])),
    );
    renderScreen();
    const input = screen.getByRole("textbox", { name: "作品を検索" });
    await userEvent.type(input, "存在しない作品XYZ");
    await waitFor(() => {
      expect(screen.getByText("該当する作品がありません")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("TOPに戻るボタンクリックで router.push('/') が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("作品カードの詳細ボタンクリックで router.push('/search/detail/:id') が呼ばれる", async () => {
    renderScreen();
    const input = screen.getByRole("textbox", { name: "作品を検索" });
    await userEvent.type(input, "夏目");
    await waitFor(() => {
      expect(screen.getByText("坊っちゃん")).toBeInTheDocument();
    }, { timeout: 2000 });
    const detailButtons = screen.getAllByRole("button", { name: "詳細を見る" });
    await userEvent.click(detailButtons[0]);
    expect(mockPush).toHaveBeenCalledWith("/search/detail/001");
  });
});
