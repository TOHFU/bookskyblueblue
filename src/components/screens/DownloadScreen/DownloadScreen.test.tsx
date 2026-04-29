import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { DownloadScreen } from "./DownloadScreen";
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

// getWorkCatalog をモックして特定の identifier の作品を返す
vi.mock("@/data/repositories/workCatalogRepository", () => ({
  getWorkCatalog: () => [
    {
      id: "test-001",
      title: "テスト作品",
      author: "テスト著者",
      htmlFileUrl: "https://example.com/test.html",
      htmlFileCharset: "Unicode",
    },
  ],
}));

vi.mock("@/data/repositories/workIndexedDbRepository", () => ({
  saveWork: vi.fn().mockResolvedValue(undefined),
}));

function renderScreen(identifier = "test-001") {
  render(
    <ChakraProvider value={appSystem}>
      <DownloadScreen identifier={identifier} />
    </ChakraProvider>,
  );
}

describe("DownloadScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    server.use(
      http.get("http://localhost/api/works/test-001", () =>
        HttpResponse.json({ content: "<html><body>テスト本文</body></html>" }),
      ),
    );
  });

  it("ダウンロード中メッセージが表示される", () => {
    renderScreen();
    expect(screen.getByText("作品をダウンロードしています。")).toBeInTheDocument();
  });

  it("ダウンロード完了後に完了メッセージが表示される", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("ダウンロードが完了しました。")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("ダウンロード完了後に router.push('/') が呼ばれる", async () => {
    renderScreen();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    }, { timeout: 3000 });
  });

  it("作品が見つからない場合にエラーメッセージが表示される", async () => {
    renderScreen("unknown-identifier");
    await waitFor(() => {
      expect(screen.getByText("作品が見つかりませんでした")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("APIエラー時にエラーメッセージが表示される", async () => {
    server.use(
      http.get("http://localhost/api/works/test-001", () =>
        HttpResponse.json({ error: "ダウンロードに失敗しました" }, { status: 500 }),
      ),
    );
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("ダウンロードに失敗しました")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
