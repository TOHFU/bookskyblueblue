import { NextResponse } from "next/server";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";

/**
 * 作品検索APIルート
 * クエリパラメータ q に検索ワードを受け取り、
 * 作品名・著者名・底本初版発行年・文字遣い種別・出版社に対してインクリメンタル検索を行う
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const catalog = getWorkCatalog();

  if (!query.trim()) {
    return NextResponse.json(catalog.slice(0, 100));
  }

  const lower = query.toLowerCase().trim();
  // 著者名は「姓 名」形式で保存されているため、スペースを除去した文字列でも照合する
  const lowerNoSpace = lower.replace(/\s+/g, "");

  const filtered = catalog.filter((work) => {
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

  return NextResponse.json(filtered);
}
