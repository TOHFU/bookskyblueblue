import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";

export type BookState = {
  content: string;
  page: number;
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
    };
  }

  const page = await repository.getReadingPosition(identifier);
  return {
    content: work.content,
    page,
  };
}
