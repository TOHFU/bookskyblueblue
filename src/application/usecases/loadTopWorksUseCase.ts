import type { Work } from "@/domain/entities/work";
import type {
  ReadingProgress,
  WorkLibraryRepository,
} from "@/domain/repositories/workLibraryRepository";

export type TopWorksState = {
  works: Work[];
  progressMap: Record<string, ReadingProgress>;
};

export async function loadTopWorksUseCase(
  repository: WorkLibraryRepository
): Promise<TopWorksState> {
  const works = await repository.getAll();

  const entries = await Promise.all(
    works
      .filter((work) => work.id)
      .map(async (work) => {
        const progress = await repository.getReadingProgress(work.id!);
        return [work.id!, progress] as const;
      })
  );

  return {
    works,
    progressMap: Object.fromEntries(entries),
  };
}
