import type { Bookmark, Work } from "@/domain/entities/work";
import type {
  ReadingProgress,
  WorkLibraryRepository,
} from "@/domain/repositories/workLibraryRepository";

export type SavedWorkDetailState = {
  work: Work | null;
  progress: ReadingProgress;
  bookmarks: Bookmark[];
};

export async function getSavedWorkDetailStateUseCase(
  repository: WorkLibraryRepository,
  identifier: string
): Promise<SavedWorkDetailState> {
  const work = await repository.getById(identifier);

  if (!work) {
    return {
      work: null,
      progress: { page: 0, totalPages: 0 },
      bookmarks: [],
    };
  }

  const progress = await repository.getReadingProgress(identifier);

  return {
    work,
    progress,
    bookmarks: work._bookmarks ?? [],
  };
}