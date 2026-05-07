import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

export async function updateReadingPositionUseCase(
  repository: WorkLibraryRepository,
  identifier: string,
  page: number,
  totalPages: number
): Promise<void> {
  await repository.saveReadingPosition(identifier, page, totalPages);
}
