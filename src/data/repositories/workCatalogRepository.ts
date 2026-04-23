import works from "@/data/catalog/list_person_all_extended.json";
import { workSchema, type Work } from "@/domain/entities/work";

export function getWorkCatalog(): Work[] {
  const dataset = Array.isArray(works) ? works : [];

  return dataset
    .map((item) => {
      // 著者名は姓と名を結合して生成する
      const lastName = readString(item, ["last_name", "author", "著者名"]);
      const firstName = readString(item, ["first_name"]);
      const author =
        lastName && firstName
          ? `${lastName} ${firstName}`
          : lastName ?? firstName;

      const candidate = {
        id: readString(item, ["work_id", "id", "作品ID"]),
        title: readString(item, ["title", "作品名"]),
        subtitle: readString(item, ["subtitle", "サブタイトル"]),
        originalTitle: readString(item, ["original_title", "originalTitle", "オリジナルタイトル"]),
        author,
        firstPublishedYear: readString(item, ["source_first_edition_year", "firstPublishedYear", "底本初版発行年"]),
        writingStyle: readString(item, ["orthography_type", "writingStyle", "文字遣い種別"]),
        publisher: readString(item, ["source_publisher", "publisher", "底本親本出版社"]),
        sourceBookName: readString(item, ["source_book_name", "sourceBookName", "底本名"]),
        htmlFileUrl: readString(item, ["html_file_url"]),
        htmlFileCharset: readString(item, ["html_file_charset"]),
        content: readString(item, ["content", "本文"]),
      };

      const parsed = workSchema.safeParse(candidate);
      return parsed.success ? parsed.data : null;
    })
    .filter((value): value is Work => value !== null);
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
