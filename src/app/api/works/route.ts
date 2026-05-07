import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";
import { searchWorksUseCase } from "@/application/usecases/searchWorksUseCase";

/**
 * 作品検索APIルート
 * クエリパラメータ q に検索ワードを受け取り、
 * 作品名・著者名・底本初版発行年・文字遣い種別・出版社に対してインクリメンタル検索を行う
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const works = await searchWorksUseCase(serverWorkCatalogRepository, query);
  return NextResponse.json(works);
}
