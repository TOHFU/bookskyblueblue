import type { Work } from "@/domain/entities/work";

export type ReadingProgress = {
  page: number;
  totalPages: number;
};

export interface WorkLibraryRepository {
  getAll(): Promise<Work[]>;
  getById(identifier: string): Promise<Work | null>;
  save(work: Work): Promise<void>;
  remove(identifier: string): Promise<void>;
  saveReadingPosition(identifier: string, page: number, totalPages: number): Promise<void>;
  getReadingPosition(identifier: string): Promise<number>;
  getReadingProgress(identifier: string): Promise<ReadingProgress>;
}
