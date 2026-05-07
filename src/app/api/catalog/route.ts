import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";

/**
 * 作品カタログ全件取得API
 */
export async function GET() {
  try {
    const works = await serverWorkCatalogRepository.findAll();
    return NextResponse.json(works);
  } catch {
    return NextResponse.json(
      { error: "作品カタログの取得に失敗しました" },
      { status: 500 }
    );
  }
}