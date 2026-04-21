import works from "@/data/catalog/list_person_all_extended.json";
import { workSchema, type Work } from "@/domain/entities/work";

export function getWorkCatalog(): Work[] {
  const dataset = Array.isArray(works) ? works : [];

  return dataset
    .map((item) => {
      const candidate = {
        id: readString(item, ["id", "作品ID"]),
        title: readString(item, ["title", "作品名"]),
        subtitle: readString(item, ["subtitle", "サブタイトル"]),
        originalTitle: readString(item, ["originalTitle", "オリジナルタイトル"]),
        author: readString(item, ["author", "著者名"]),
        firstPublishedYear: readString(item, ["firstPublishedYear", "底本初版発行年"]),
        writingStyle: readString(item, ["writingStyle", "文字遣い種別"]),
        publisher: readString(item, ["publisher", "底本親本出版社"]),
        sourceBookName: readString(item, ["sourceBookName", "底本名"]),
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
