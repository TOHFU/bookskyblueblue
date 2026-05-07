import type { Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

export async function getWorkByIdentifierUseCase(
  repository: WorkCatalogRepository,
  identifier: string
): Promise<Work | null> {
  return repository.findById(identifier);
}
