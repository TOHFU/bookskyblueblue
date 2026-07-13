import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";

// カタログはDB同期スクリプト実行時のみ更新されるため、CDNキャッシュを長めに効かせる
const CACHE_CONTROL_HEADER =
  "public, s-maxage=3600, stale-while-revalidate=86400";

/**
 * 作品カタログ全件取得API
 */
export async function GET() {
  try {
    const works = await serverWorkCatalogRepository.findAll();
    return NextResponse.json(works, {
      headers: { "Cache-Control": CACHE_CONTROL_HEADER },
    });
  } catch {
    return NextResponse.json(
      { error: "作品カタログの取得に失敗しました" },
      { status: 500 }
    );
  }
}