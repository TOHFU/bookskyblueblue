import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFindById } = vi.hoisted(() => ({
  mockFindById: vi.fn(),
}));

vi.mock("@/application/containers/serverWorkContainer", () => ({
  serverWorkCatalogRepository: {
    findById: mockFindById,
  },
}));

import { GET } from "./route";

describe("GET /api/catalog/[identifier]", () => {
  beforeEach(() => {
    mockFindById.mockReset();
  });

  it("該当作品を返す", async () => {
    mockFindById.mockResolvedValue({
      id: "001",
      title: "坊っちゃん",
      author: "夏目漱石",
    });

    const response = await GET(new Request("http://localhost/api/catalog/001"), {
      params: Promise.resolve({ identifier: "001" }),
    });

    expect(mockFindById).toHaveBeenCalledWith("001");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "001",
      title: "坊っちゃん",
      author: "夏目漱石",
    });
  });

  it("作品が存在しない場合は404を返す", async () => {
    mockFindById.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/catalog/999"), {
      params: Promise.resolve({ identifier: "999" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "作品が見つかりませんでした",
    });
  });

  it("リポジトリエラー時は500を返す", async () => {
    mockFindById.mockRejectedValue(new Error("db error"));

    const response = await GET(new Request("http://localhost/api/catalog/001"), {
      params: Promise.resolve({ identifier: "001" }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "作品情報の取得に失敗しました",
    });
  });
});
