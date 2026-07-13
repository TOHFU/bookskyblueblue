import { unstable_cache } from "next/cache";
import { NeonWorkCatalogRepository } from "@/data/repositories/workCatalogNeonRepository";
import { StaticJsonWorkCatalogRepository } from "@/data/repositories/workCatalogStaticRepository";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

// カタログは npm run catalog:sync 実行時のみ更新されるため、
// DBへの往復を減らすためリクエスト間でキャッシュする
export const CATALOG_CACHE_TAG = "work-catalog";
const CATALOG_CACHE_SECONDS = 60 * 60;
// 検索クエリはバリエーションが多くキャッシュエントリが増えやすいため、短めのTTLにする
const SEARCH_CACHE_SECONDS = 60 * 5;

function withCache(repository: WorkCatalogRepository): WorkCatalogRepository {
	const cachedFindAll = unstable_cache(
		() => repository.findAll(),
		["work-catalog-find-all"],
		{ revalidate: CATALOG_CACHE_SECONDS, tags: [CATALOG_CACHE_TAG] }
	);

	const cachedFindById = unstable_cache(
		(identifier: string) => repository.findById(identifier),
		["work-catalog-find-by-id"],
		{ revalidate: CATALOG_CACHE_SECONDS, tags: [CATALOG_CACHE_TAG] }
	);

	const cachedSearch = unstable_cache(
		(query: string) => repository.search(query),
		["work-catalog-search"],
		{ revalidate: SEARCH_CACHE_SECONDS, tags: [CATALOG_CACHE_TAG] }
	);

	return {
		findAll: () => cachedFindAll(),
		findById: (identifier: string) => cachedFindById(identifier),
		search: (query: string) => cachedSearch(query),
	};
}

function createServerWorkCatalogRepository(): WorkCatalogRepository {
	const hasDatabaseUrl = Boolean(
		process.env.POSTGRES_URL ?? process.env.DATABASE_URL
	);

	const repository = hasDatabaseUrl
		? new NeonWorkCatalogRepository()
		: new StaticJsonWorkCatalogRepository();

	return withCache(repository);
}

export const serverWorkCatalogRepository = createServerWorkCatalogRepository();
