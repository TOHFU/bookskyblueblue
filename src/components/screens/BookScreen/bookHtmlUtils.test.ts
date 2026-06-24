import { describe, expect, it } from "vitest";
import {
  sanitizeHtml,
  extractMainContent,
  getChunkForPage,
  createLayoutKey,
  hashBookContent,
  hydrateMetadataFromCache,
  listNominalChunkStartPages,
  prepareBookDisplayFromCache,
  prepareBookDisplay,
  applyTotalPagesToMetadata,
  findNextMissingChunkStartPage,
} from "./bookHtmlUtils";
import type { ChunkMetadata } from "./bookHtmlUtils";
import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";

describe("sanitizeHtml", () => {
  it("scriptタグを除去する", () => {
    const input = '<p>テキスト</p><script>alert("XSS")</script>';
    expect(sanitizeHtml(input)).not.toContain("<script>");
    expect(sanitizeHtml(input)).not.toContain("alert");
  });

  it("styleタグを除去する", () => {
    const input = '<p>テキスト</p><style>body { color: red; }</style>';
    expect(sanitizeHtml(input)).not.toContain("<style>");
  });

  it("onXXXイベントハンドラ属性を除去する", () => {
    const input = '<button onclick="evil()">クリック</button>';
    expect(sanitizeHtml(input)).not.toContain("onclick");
  });

  it("javascript: href を除去する", () => {
    const input = '<a href="javascript:void(0)">リンク</a>';
    expect(sanitizeHtml(input)).not.toContain("javascript:");
  });

  it("imgタグをalt属性テキストに置換する（ダブルクォート）", () => {
    const input = '<img src="foo.png" alt="図1" />';
    expect(sanitizeHtml(input)).toBe("図1");
  });

  it("imgタグをalt属性テキストに置換する（シングルクォート）", () => {
    const input = "<img src='foo.png' alt='図A' />";
    expect(sanitizeHtml(input)).toBe("図A");
  });

  it("altなしのimgタグは空文字に置換される", () => {
    const input = '<p><img src="noalt.png"></p>';
    expect(sanitizeHtml(input)).not.toContain("<img");
  });

  it("3連続以上のbrタグをbr2つに圧縮する", () => {
    const input = "行1<br><br><br><br>行2";
    const result = sanitizeHtml(input);
    expect(result).toContain("<br><br>");
    // 3つ以上は残らない
    expect(result).not.toMatch(/<br>(<br>){2,}/);
  });
});

describe("extractMainContent", () => {
  it("class=main_text の div 内容を抽出する", () => {
    const input = `
      <html><body>
        <div class="main_text">
          <p>本文テキスト</p>
        </div>
      </body></html>
    `;
    const result = extractMainContent(input);
    expect(result).toContain("本文テキスト");
    expect(result).not.toContain("main_text");
  });

  it("main_text がない場合はbodyのフォールバック", () => {
    const input = "<html><body><p>フォールバック本文</p></body></html>";
    const result = extractMainContent(input);
    expect(result).toContain("フォールバック本文");
  });

  it("bodyもない場合はhttm全体をsanitizeして返す", () => {
    const input = "<p>そのままのHTML</p>";
    const result = extractMainContent(input);
    expect(result).toContain("そのままのHTML");
  });

  it("ネストしたdivが含まれていても正しく抽出される", () => {
    const input = `
      <div class="main_text">
        <div><p>ネスト内テキスト</p></div>
      </div>
    `;
    const result = extractMainContent(input);
    expect(result).toContain("ネスト内テキスト");
  });

  it("main_text のスクリプトタグを除去する", () => {
    const input = `
      <div class="main_text">
        <p>本文</p><script>evil()</script>
      </div>
    `;
    const result = extractMainContent(input);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("evil");
  });
});

describe("getChunkForPage", () => {
  const metadata: ChunkMetadata = {
    totalPages: 45,
    totalPagesKnown: true,
    totalChunks: 3,
    blocks: [],
    layoutParams: {
      columnWidth: 32,
      containerHeight: 600,
      containerWidth: 300,
    },
    chunks: [
      {
        chunkId: 0,
        startPage: 0,
        endPage: 20,
        blockStart: 0,
        blockEnd: 0,
        content: "<p>chunk0</p>",
      },
      {
        chunkId: 1,
        startPage: 18,
        endPage: 40,
        blockStart: 1,
        blockEnd: 1,
        content: "<p>chunk1</p>",
      },
      {
        chunkId: 2,
        startPage: 38,
        endPage: 45,
        blockStart: 2,
        blockEnd: 2,
        content: "<p>chunk2</p>",
      },
    ],
  };

  it("グローバルページ番号に対応するチャンクを返す", () => {
    expect(getChunkForPage(0, metadata)?.chunkId).toBe(0);
    expect(getChunkForPage(17, metadata)?.chunkId).toBe(0);
    expect(getChunkForPage(20, metadata, "forward")?.chunkId).toBe(1);
    expect(getChunkForPage(39, metadata, "forward")?.chunkId).toBe(2);
    expect(getChunkForPage(44, metadata)?.chunkId).toBe(2);
  });

  it("オーバーラップ範囲では遷移方向に応じてチャンクを選ぶ", () => {
    expect(getChunkForPage(19, metadata, "forward")?.chunkId).toBe(1);
    expect(getChunkForPage(19, metadata, "backward")?.chunkId).toBe(0);
  });

  it("範囲外のページ番号では最後のチャンクを返す", () => {
    expect(getChunkForPage(999, metadata)?.chunkId).toBe(2);
  });
});

describe("createLayoutKey", () => {
  it("レイアウトパラメータからキャッシュキーを生成する", () => {
    expect(
      createLayoutKey({
        columnWidth: 32.4,
        containerHeight: 599.8,
        containerWidth: 300.2,
      })
    ).toBe("32:600:300");
  });
});

describe("hashBookContent", () => {
  it("同じHTMLから同じハッシュを返す", () => {
    const html = "<p>テスト</p>".repeat(100);
    expect(hashBookContent(html)).toBe(hashBookContent(html));
  });

  it("異なるHTMLから異なるハッシュを返す", () => {
    expect(hashBookContent("<p>あ</p>")).not.toBe(hashBookContent("<p>い</p>"));
  });
});

describe("listNominalChunkStartPages", () => {
  it("オーバーラップを考慮した開始ページ一覧を返す", () => {
    expect(listNominalChunkStartPages(45)).toEqual([0, 18, 38]);
  });
});

describe("hydrateMetadataFromCache", () => {
  const cached: StoredBookLayout = {
    id: "work-1:32:600:300",
    workId: "work-1",
    layoutKey: "32:600:300",
    contentHash: "100:123",
    totalPages: 45,
    totalChunks: 3,
    updatedAt: 0,
    isComplete: true,
    chunkBoundaries: [
      { chunkId: 0, startPage: 0, endPage: 20, blockStart: 0, blockEnd: 0 },
      { chunkId: 1, startPage: 18, endPage: 40, blockStart: 1, blockEnd: 1 },
    ],
  };

  it("キャッシュからチャンクメタデータを復元する", () => {
    const blocks = ["<p>chunk0</p>", "<p>chunk1</p>"];
    const metadata = hydrateMetadataFromCache(
      blocks,
      {
        columnWidth: 32,
        containerHeight: 600,
        containerWidth: 300,
      },
      cached
    );

    expect(metadata.totalPages).toBe(45);
    expect(metadata.chunks).toHaveLength(2);
    expect(metadata.chunks[0]?.content).toContain("chunk0");
  });
});

describe("prepareBookDisplayFromCache", () => {
  it("初期ページがキャッシュ済みチャンクに含まれる場合は追加構築しない", () => {
    const cached: StoredBookLayout = {
      id: "work-1:32:600:300",
      workId: "work-1",
      layoutKey: "32:600:300",
      contentHash: "100:123",
      totalPages: 45,
      totalChunks: 3,
      updatedAt: 0,
      isComplete: false,
      chunkBoundaries: [
        { chunkId: 0, startPage: 0, endPage: 20, blockStart: 0, blockEnd: 0 },
      ],
    };

    const blocks = ["<p>chunk0</p>", "<p>chunk1</p>"];
    const metadata = prepareBookDisplayFromCache(
      blocks,
      { columnWidth: 32, containerHeight: 600, containerWidth: 300 },
      cached,
      10
    );

    expect(metadata.totalPages).toBe(45);
    expect(metadata.chunks).toHaveLength(1);
  });
});

describe("applyTotalPagesToMetadata", () => {
  it("総ページ数と既知フラグを更新する", () => {
    const metadata: ChunkMetadata = {
      totalPages: 1,
      totalPagesKnown: false,
      totalChunks: 1,
      chunks: [],
      blocks: ["<p>a</p>"],
      layoutParams: {
        columnWidth: 32,
        containerHeight: 600,
        containerWidth: 300,
      },
    };

    applyTotalPagesToMetadata(metadata, 45);

    expect(metadata.totalPages).toBe(45);
    expect(metadata.totalPagesKnown).toBe(true);
    expect(metadata.totalChunks).toBe(3);
  });
});

describe("findNextMissingChunkStartPage", () => {
  it("総ページ数未計測のときはnullを返す", () => {
    const metadata: ChunkMetadata = {
      totalPages: 1,
      totalPagesKnown: false,
      totalChunks: 1,
      chunks: [],
      blocks: ["<p>a</p>"],
      layoutParams: {
        columnWidth: 32,
        containerHeight: 600,
        containerWidth: 300,
      },
    };

    expect(findNextMissingChunkStartPage(metadata)).toBeNull();
  });
});

describe("prepareBookDisplay", () => {
  const params = {
    columnWidth: 32,
    containerHeight: 600,
    containerWidth: 300,
  };

  it("初回は総ページ数未計測で初期チャンクだけ構築する", () => {
    const html = "<p>あ</p>".repeat(10);
    const metadata = prepareBookDisplay(html, params, 0);

    expect(metadata.totalPagesKnown).toBe(false);
    expect(metadata.chunks).toHaveLength(1);
    expect(metadata.chunks[0]?.startPage).toBe(0);
  });

  it("空本文のときは総ページ数を既知として扱う", () => {
    const metadata = prepareBookDisplay("", params, 0);

    expect(metadata.totalPagesKnown).toBe(true);
    expect(metadata.chunks).toHaveLength(0);
  });
});
