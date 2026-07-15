import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";
import { fetchWorkContentUseCase } from "@/application/usecases/fetchWorkContentUseCase";

// 本文は作品ごと不変のため、再ダウンロード時の往復を減らす
const CACHE_CONTROL_HEADER =
  "public, s-maxage=86400, stale-while-revalidate=604800";

/**
 * 青空文庫から作品のXHTMLを取得して返すAPIルート
 * html_file_charsetに基づいてデコードしUTF-8で返す
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;

  try {
    const content = await fetchWorkContentUseCase(
      serverWorkCatalogRepository,
      identifier
    );

    if (!content) {
      return NextResponse.json(
        { error: "作品が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(content, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  } catch (error) {
    if (error instanceof Error && /^\d+$/.test(error.message)) {
      return NextResponse.json(
        { error: "作品の取得に失敗しました" },
        { status: Number(error.message) }
      );
    }

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

