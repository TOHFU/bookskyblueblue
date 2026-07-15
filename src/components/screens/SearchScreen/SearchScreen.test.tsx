import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { SearchScreen } from "./SearchScreen";
import { clearSearchResultCacheForTests } from "@/hooks/screens/useSearchScreen";
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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("SearchScreen", () => {
  beforeEach(() => {
    clearSearchResultCacheForTests();
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
    const detailButton = screen.getByRole("button", {
      name: "坊っちゃんの詳細を見る",
    });
    await userEvent.click(detailButton);
    expect(mockPush).toHaveBeenCalledWith("/search/detail/001");
  });

  it("古い検索レスポンスは現在の入力と不一致なら描画しない", async () => {
    server.use(
      http.get("http://localhost/api/works", async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";

        if (q === "夏") {
          await wait(300);
          return HttpResponse.json([
            {
              id: "101",
              title: "夏の古い結果",
              author: "旧レスポンス",
            },
          ]);
        }

        if (q === "夏目") {
          await wait(50);
          return HttpResponse.json([
            {
              id: "102",
              title: "夏目の最新結果",
              author: "新レスポンス",
            },
          ]);
        }

        return HttpResponse.json([]);
      }),
    );

    renderScreen();
    const input = screen.getByRole("textbox", { name: "作品を検索" });

    await userEvent.type(input, "夏");
    await wait(250);
    await userEvent.type(input, "目");

    await waitFor(() => {
      expect(screen.getByText("夏目の最新結果")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText("夏の古い結果")).not.toBeInTheDocument();
  });
});
