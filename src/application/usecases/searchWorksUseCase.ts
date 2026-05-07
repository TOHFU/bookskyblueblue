import type { Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

export async function searchWorksUseCase(
  repository: WorkCatalogRepository,
  query: string
): Promise<Work[]> {
  const catalog = await repository.findAll();

  if (!query.trim()) {
    return catalog.slice(0, 100);
  }

  const lower = query.toLowerCase().trim();
  const lowerNoSpace = lower.replace(/\s+/g, "");

  return catalog.filter((work) => {
    const author = work.author?.toLowerCase() ?? "";
    const authorNoSpace = author.replace(/\s+/g, "");

    return (
      work.title?.toLowerCase().includes(lower) ||
      author.includes(lower) ||
      authorNoSpace.includes(lowerNoSpace) ||
      work.firstPublishedYear?.toLowerCase().includes(lower) ||
      work.writingStyle?.toLowerCase().includes(lower) ||
      work.publisher?.toLowerCase().includes(lower)
    );
  });
}
