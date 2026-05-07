import "server-only";
import works from "@/data/catalog/list_person_all_extended.json";
import type { Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";
import { normalizeCatalogDataset } from "@/data/repositories/workCatalogRepository";

export class StaticJsonWorkCatalogRepository implements WorkCatalogRepository {
  private readonly catalog: Work[];

  constructor() {
    this.catalog = normalizeCatalogDataset(works);
  }

  async findAll(): Promise<Work[]> {
    return this.catalog;
  }

  async findById(identifier: string): Promise<Work | null> {
    return this.catalog.find((work) => work.id === identifier) ?? null;
  }
}