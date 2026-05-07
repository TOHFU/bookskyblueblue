import { ApiWorkCatalogRepository } from "@/data/repositories/workCatalogRepository";
import { IndexedDbWorkLibraryRepository } from "@/data/repositories/workIndexedDbRepository";

export const clientWorkCatalogRepository = new ApiWorkCatalogRepository();
export const clientWorkLibraryRepository = new IndexedDbWorkLibraryRepository();
