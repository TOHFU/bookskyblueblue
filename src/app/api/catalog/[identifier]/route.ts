import { NextResponse } from "next/server";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";

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

    return NextResponse.json(work);
  } catch {
    return NextResponse.json(
      { error: "作品情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}