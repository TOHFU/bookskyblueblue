import type { Bookmark } from "@/domain/entities/work";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

export type BookState = {
  content: string;
  page: number;
  bookmarks: Bookmark[];
};

export async function getBookStateUseCase(
  repository: WorkLibraryRepository,
  identifier: string
): Promise<BookState> {
  const work = await repository.getById(identifier);
  if (!work?.content) {
    return {
      content: "",
      page: 0,
      bookmarks: [],
    };
  }

  // getById に含まれる進捗を使い、追加の IndexedDB 往復を避ける
  const page =
    typeof work._readingPage === "number"
      ? work._readingPage
      : await repository.getReadingPosition(identifier);

  return {
    content: work.content,
    page,
    bookmarks: work._bookmarks ?? [],
  };
}
