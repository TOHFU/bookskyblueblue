import { describe, expect, it, vi } from "vitest";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";
import { fetchWorkContentUseCase } from "./fetchWorkContentUseCase";

function createRepository(htmlFileUrl: string): WorkCatalogRepository {
  return {
    findAll: async () => [],
    findById: async () => ({ htmlFileUrl, htmlFileCharset: "Unicode" }),
    search: async () => [],
  };
}

describe("fetchWorkContentUseCase", () => {
  it("青空文庫のHTMLだけをリダイレクトなしで取得する", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("<p>本文</p>")
    );

    const result = await fetchWorkContentUseCase(
      createRepository("https://www.aozora.gr.jp/cards/000001/files/1.html"),
      "1",
      fetcher
    );

    expect(result?.content).toBe("<p>本文</p>");
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({ hostname: "www.aozora.gr.jp" }),
      expect.objectContaining({ redirect: "error" })
    );
  });

  it.each([
    "http://www.aozora.gr.jp/cards/1.html",
    "https://example.com/cards/1.html",
    "https://www.aozora.gr.jp.evil.example/cards/1.html",
    "https://www.aozora.gr.jp:8443/cards/1.html",
    "https://www.aozora.gr.jp/cards/1.zip",
  ])("許可されない本文URLを取得前に拒否する: %s", async (url) => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      fetchWorkContentUseCase(createRepository(url), "1", fetcher)
    ).rejects.toThrow("作品本文のURLが許可されていません");
    expect(fetcher).not.toHaveBeenCalled();
  });
});