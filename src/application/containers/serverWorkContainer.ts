import { NeonWorkCatalogRepository } from "@/data/repositories/workCatalogNeonRepository";
import { StaticJsonWorkCatalogRepository } from "@/data/repositories/workCatalogStaticRepository";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

function createServerWorkCatalogRepository(): WorkCatalogRepository {
	const hasDatabaseUrl = Boolean(
		process.env.POSTGRES_URL ?? process.env.DATABASE_URL
	);

	if (hasDatabaseUrl) {
		return new NeonWorkCatalogRepository();
	}

	return new StaticJsonWorkCatalogRepository();
}

export const serverWorkCatalogRepository = createServerWorkCatalogRepository();
