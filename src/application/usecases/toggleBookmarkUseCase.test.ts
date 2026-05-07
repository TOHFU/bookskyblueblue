import { describe, expect, it, vi } from "vitest";
import { toggleBookmarkUseCase } from "./toggleBookmarkUseCase";
import type { Work } from "@/domain/entities/work";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

function createRepository(work: Work | null): WorkLibraryRepository {
  const currentWork = work;

  return {
    getAll: vi.fn(async () => (currentWork ? [currentWork] : [])),
    getById: vi.fn(async () => currentWork),
    save: vi.fn(async () => undefined),
    remove: vi.fn(async () => undefined),
    saveReadingPosition: vi.fn(async () => undefined),
    getReadingPosition: vi.fn(async () => 0),
    getReadingProgress: vi.fn(async () => ({ page: 0, totalPages: 0 })),
  };
}

describe("toggleBookmarkUseCase", () => {
  it("未登録ページならブックマークを追加してページ順に返す", async () => {
    const repository = createRepository({
      id: "36785",
      title: "走れメロス",
      _bookmarks: [
        { page: 10, excerpt: "a" },
        { page: 30, excerpt: "c" },
      ],
    });

    const nextBookmarks = await toggleBookmarkUseCase(repository, "36785", {
      page: 20,
      excerpt: "b",
    });

    expect(nextBookmarks).toEqual([
      { page: 10, excerpt: "a" },
      { page: 20, excerpt: "b" },
      { page: 30, excerpt: "c" },
    ]);
    expect(repository.save).toHaveBeenCalled();
  });

  it("登録済みページならブックマークを削除する", async () => {
    const repository = createRepository({
      id: "36785",
      title: "走れメロス",
      _bookmarks: [
        { page: 20, excerpt: "b" },
        { page: 30, excerpt: "c" },
      ],
    });

    const nextBookmarks = await toggleBookmarkUseCase(repository, "36785", {
      page: 20,
      excerpt: "b",
    });

    expect(nextBookmarks).toEqual([{ page: 30, excerpt: "c" }]);
    expect(repository.save).toHaveBeenCalled();
  });
});