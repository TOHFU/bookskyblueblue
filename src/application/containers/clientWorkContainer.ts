import { JsonWorkCatalogRepository } from "@/data/repositories/workCatalogRepository";
import { IndexedDbWorkLibraryRepository } from "@/data/repositories/workIndexedDbRepository";

export const clientWorkCatalogRepository = new JsonWorkCatalogRepository();
export const clientWorkLibraryRepository = new IndexedDbWorkLibraryRepository();
