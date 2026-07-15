import type { Work } from "@/domain/entities/work";
import type {
  ReadingProgress,
  WorkLibraryRepository,
} from "@/domain/repositories/workLibraryRepository";

export type TopWorksState = {
  works: Work[];
  progressMap: Record<string, ReadingProgress>;
};

/** 一覧表示に不要な本文を落とし、シリアライズ／描画コストを抑える */
function toListWork(work: Work): Work {
  const { content: _content, ...meta } = work;
  return meta;
}

export async function loadTopWorksUseCase(
  repository: WorkLibraryRepository
): Promise<TopWorksState> {
  const works = await repository.getAll();
  const listWorks = works.map(toListWork);

  // getAll で得た進捗フィールドを優先し、不足分だけ個別取得する（N+1 を抑える）
  const progressMap: Record<string, ReadingProgress> = {};
  const missingIds: string[] = [];

  for (const work of works) {
    if (!work.id) continue;
    if (
      typeof work._readingPage === "number" &&
      typeof work._totalPages === "number"
    ) {
      progressMap[work.id] = {
        page: work._readingPage,
        totalPages: work._totalPages,
      };
    } else {
      missingIds.push(work.id);
    }
  }

  if (missingIds.length > 0) {
    const entries = await Promise.all(
      missingIds.map(async (id) => {
        const progress = await repository.getReadingProgress(id);
        return [id, progress] as const;
      }),
    );
    for (const [id, progress] of entries) {
      progressMap[id] = progress;
    }
  }

  return {
    works: listWorks,
    progressMap,
  };
}
