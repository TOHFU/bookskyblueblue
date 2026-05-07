import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

export async function downloadWorkUseCase(
  workCatalogRepository: WorkCatalogRepository,
  workLibraryRepository: WorkLibraryRepository,
  identifier: string,
  fetcher: typeof fetch = (input, init) => fetch(input, init)
): Promise<void> {
  const work = await workCatalogRepository.findById(identifier);

  if (!work) {
    throw new Error("作品が見つかりませんでした");
  }

  const response = await fetcher(`/api/works/${identifier}`);
  if (!response.ok) {
    throw new Error("ダウンロードに失敗しました");
  }

  const data = (await response.json()) as { content?: string };
  await workLibraryRepository.save({ ...work, content: data.content ?? "" });
}
