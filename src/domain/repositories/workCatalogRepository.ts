import type { Work } from "@/domain/entities/work";

export interface WorkCatalogRepository {
  findAll(): Promise<Work[]>;
  findById(identifier: string): Promise<Work | null>;
}
