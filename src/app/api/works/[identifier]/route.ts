import { NextResponse } from "next/server";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";

/**
 * charset名 → TextDecoder ラベルのマッピング
 * 青空文庫のhtmlFileCharset値に対応する
 */
const CHARSET_MAP: Record<string, string> = {
  "JIS X 0208": "shift-jis",
  Unicode: "utf-8",
};

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
    const catalog = getWorkCatalog();
    const work = catalog.find((w) => w.id === identifier);

    if (!work?.htmlFileUrl) {
      return NextResponse.json(
        { error: "作品が見つかりませんでした" },
        { status: 404 }
      );
    }

    const response = await fetch(work.htmlFileUrl, {
      headers: {
        "User-Agent": "BookSkyBlueBlue/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "作品の取得に失敗しました" },
        { status: response.status }
      );
    }

    // html_file_charsetに基づきArrayBufferをデコード（Shift_JIS → UTF-8）
    const buffer = await response.arrayBuffer();
    const charsetLabel = CHARSET_MAP[work.htmlFileCharset ?? ""] ?? "shift-jis";
    const decoder = new TextDecoder(charsetLabel);
    const content = decoder.decode(buffer);

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

