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

  const page = await repository.getReadingPosition(identifier);
  return {
    content: work.content,
    page,
    bookmarks: work._bookmarks ?? [],
  };
}
