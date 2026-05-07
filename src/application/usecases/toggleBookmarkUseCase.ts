import type { Bookmark } from "@/domain/entities/work";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

export async function toggleBookmarkUseCase(
  repository: WorkLibraryRepository,
  identifier: string,
  bookmark: Bookmark
): Promise<Bookmark[]> {
  const work = await repository.getById(identifier);

  if (!work) {
    return [];
  }

  const currentBookmarks = work._bookmarks ?? [];
  const bookmarkExists = currentBookmarks.some((item) => item.page === bookmark.page);
  const nextBookmarks = bookmarkExists
    ? currentBookmarks.filter((item) => item.page !== bookmark.page)
    : [...currentBookmarks, bookmark].sort((left, right) => left.page - right.page);

  await repository.save({
    ...work,
    _bookmarks: nextBookmarks,
  });

  return nextBookmarks;
}