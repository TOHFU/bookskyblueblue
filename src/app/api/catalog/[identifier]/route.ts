import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";

// カタログはDB同期スクリプト実行時のみ更新されるため、CDNキャッシュを長めに効かせる
const CACHE_CONTROL_HEADER =
  "public, s-maxage=3600, stale-while-revalidate=86400";

/**
 * 作品メタデータ単体取得API
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;

  try {
    const work = await serverWorkCatalogRepository.findById(identifier);

    if (!work) {
      return NextResponse.json(
        { error: "作品が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(work, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  } catch {
    return NextResponse.json(
      { error: "作品情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}