import { workSchema, type Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

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
    private readonly fetcher: typeof fetch = fetch,
    private readonly basePath = "/api/catalog"
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
