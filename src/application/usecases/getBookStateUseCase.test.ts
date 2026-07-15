import { describe, expect, it, vi } from "vitest";
import { getBookStateUseCase } from "./getBookStateUseCase";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

describe("getBookStateUseCase", () => {
  it("getById の _readingPage を使い追加の位置取得を避ける", async () => {
    const getReadingPosition = vi.fn();
    const repository = {
      getById: vi.fn(async () => ({
        id: "1",
        content: "<body><div class='main_text'>本文</div></body>",
        _readingPage: 3,
        _bookmarks: [{ page: 1, excerpt: "抜粋" }],
      })),
      getReadingPosition,
    } as unknown as WorkLibraryRepository;

    const state = await getBookStateUseCase(repository, "1");

    expect(state.page).toBe(3);
    expect(state.bookmarks).toHaveLength(1);
    expect(getReadingPosition).not.toHaveBeenCalled();
  });
});
