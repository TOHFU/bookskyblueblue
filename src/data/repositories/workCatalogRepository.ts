import { workSchema, type Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

/** 検索クエリが空のときに返す件数(先頭から) */
export const CATALOG_DEFAULT_LIMIT = 100;
/** 検索クエリがヒットしたときに返す最大件数(巨大なレスポンスを避けるための安全上限) */
export const CATALOG_SEARCH_LIMIT = 200;

/**
 * カタログをキーワードで絞り込む(DBを持たない環境向けのフォールバック実装)。
 * NeonWorkCatalogRepository はこれと同等の絞り込みをSQL側で行う。
 */
export function filterWorksByQuery(works: Work[], query: string): Work[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return works.slice(0, CATALOG_DEFAULT_LIMIT);
  }

  const lower = trimmed.toLowerCase();
  const lowerNoSpace = lower.replace(/\s+/g, "");

  const matches = works.filter((work) => {
    const author = work.author?.toLowerCase() ?? "";
    const authorNoSpace = author.replace(/\s+/g, "");

    return (
      work.title?.toLowerCase().includes(lower) ||
      author.includes(lower) ||
      authorNoSpace.includes(lowerNoSpace) ||
      work.firstPublishedYear?.toLowerCase().includes(lower) ||
      work.writingStyle?.toLowerCase().includes(lower) ||
      work.publisher?.toLowerCase().includes(lower)
    );
  });

  return matches.slice(0, CATALOG_SEARCH_LIMIT);
}

export function normalizeCatalogItem(source: unknown): Work | null {
  // 著者名は姓と名を結合して生成する
  const lastName = readString(source, ["last_name", "author", "著者名"]);
  const firstName = readString(source, ["first_name"]);
  const author =
    lastName && firstName ? `${lastName} ${firstName}` : lastName ?? firstName;

  const candidate = {
    id: readString(source, ["work_id", "id", "作品ID"]),
    title: readString(source, ["title", "作品名"]),
    subtitle: readString(source, ["subtitle", "サブタイトル"]),
    originalTitle: readString(source, ["original_title", "originalTitle", "オリジナルタイトル"]),
    author,
    firstPublishedYear: readString(source, ["source_first_edition_year", "firstPublishedYear", "底本初版発行年"]),
    writingStyle: readString(source, ["orthography_type", "writingStyle", "文字遣い種別"]),
    publisher: readString(source, ["source_publisher", "publisher", "底本親本出版社"]),
    sourceBookName: readString(source, ["source_book_name", "sourceBookName", "底本名"]),
    htmlFileUrl: readString(source, ["html_file_url"]),
    htmlFileCharset: readString(source, ["html_file_charset"]),
    content: readString(source, ["content", "本文"]),
  };

  const parsed = workSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export function normalizeCatalogDataset(dataset: unknown): Work[] {
  if (!Array.isArray(dataset)) {
    return [];
  }

  return dataset
    .map((item) => normalizeCatalogItem(item))
    .filter((value): value is Work => value !== null);
}

export class ApiWorkCatalogRepository implements WorkCatalogRepository {
  constructor(
    private readonly fetcher: typeof fetch = (input, init) =>
      fetch(input, init),
    private readonly basePath = "/api/catalog",
    private readonly searchBasePath = "/api/works"
  ) {}

  async findAll(): Promise<Work[]> {
    const response = await this.fetcher(this.basePath);
    if (!response.ok) {
      throw new Error("作品一覧の取得に失敗しました");
    }

    const payload = (await response.json()) as unknown;
    const parsed = workSchema.array().safeParse(payload);
    return parsed.success ? parsed.data : [];
  }

  async findById(identifier: string): Promise<Work | null> {
    const response = await this.fetcher(
      `${this.basePath}/${encodeURIComponent(identifier)}`
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("作品情報の取得に失敗しました");
    }

    const payload = (await response.json()) as unknown;
    const parsed = workSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  }

  async search(query: string): Promise<Work[]> {
    const params = new URLSearchParams({ q: query });
    const response = await this.fetcher(
      `${this.searchBasePath}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("作品検索に失敗しました");
    }

    const payload = (await response.json()) as unknown;
    const parsed = workSchema.array().safeParse(payload);
    return parsed.success ? parsed.data : [];
  }
}

function readString(source: unknown, keys: string[]): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const value = Reflect.get(source, key);
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
}
