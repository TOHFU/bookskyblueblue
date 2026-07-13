import type { Work } from "@/domain/entities/work";

export interface WorkCatalogRepository {
  findAll(): Promise<Work[]>;
  findById(identifier: string): Promise<Work | null>;
  /** タイトル・著者名・出版社等をキーワードで検索する。空文字の場合は先頭の一部を返す */
  search(query: string): Promise<Work[]>;
}
