import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFindAll } = vi.hoisted(() => ({
  mockFindAll: vi.fn(),
}));

vi.mock("@/application/containers/serverWorkContainer", () => ({
  serverWorkCatalogRepository: {
    findAll: mockFindAll,
  },
}));

import { GET } from "./route";

describe("GET /api/catalog", () => {
  beforeEach(() => {
    mockFindAll.mockReset();
  });

  it("作品一覧を返す", async () => {
    mockFindAll.mockResolvedValue([
      { id: "001", title: "坊っちゃん", author: "夏目漱石" },
      { id: "002", title: "吾輩は猫である", author: "夏目漱石" },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      { id: "001", title: "坊っちゃん", author: "夏目漱石" },
      { id: "002", title: "吾輩は猫である", author: "夏目漱石" },
    ]);
  });

  it("リポジトリエラー時は500を返す", async () => {
    mockFindAll.mockRejectedValue(new Error("db error"));

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "作品カタログの取得に失敗しました",
    });
  });
});
