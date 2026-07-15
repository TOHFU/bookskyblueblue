import { describe, expect, it, vi } from "vitest";
import { loadTopWorksUseCase } from "./loadTopWorksUseCase";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

describe("loadTopWorksUseCase", () => {
  it("一覧用に本文を落とし、進捗フィールドがあれば追加取得しない", async () => {
    const getReadingProgress = vi.fn();
    const repository = {
      getAll: vi.fn(async () => [
        {
          id: "1",
          title: "坊っちゃん",
          content: "<p>本文</p>",
          _readingPage: 2,
          _totalPages: 10,
        },
      ]),
      getReadingProgress,
    } as unknown as WorkLibraryRepository;

    const result = await loadTopWorksUseCase(repository);

    expect(result.works[0]?.content).toBeUndefined();
    expect(result.progressMap["1"]).toEqual({ page: 2, totalPages: 10 });
    expect(getReadingProgress).not.toHaveBeenCalled();
  });
});
