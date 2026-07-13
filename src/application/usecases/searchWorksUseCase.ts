import type { Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

/**
 * 作品検索。絞り込み自体はリポジトリ実装(NeonはSQLのILIKE、静的データはJSフィルタ)に委譲する。
 * これにより、DBを使う環境ではカタログ全件をアプリ側に転送せずに検索できる。
 */
export async function searchWorksUseCase(
  repository: WorkCatalogRepository,
  query: string
): Promise<Work[]> {
  return repository.search(query);
}
