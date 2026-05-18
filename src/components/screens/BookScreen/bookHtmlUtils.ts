/** imgタグをalt属性のテキストに置換し、スクリプト・危険な属性を除去する */
export function sanitizeHtml(html: string): string {
  return html
    // imgタグはaltテキストのみ残す
    .replace(/<img[^>]*alt\s*=\s*"([^"]*?)"[^>]*\/?>/gi, (_, alt: string) => alt)
    .replace(/<img[^>]*alt\s*=\s*'([^']*?)'[^>]*\/?>/gi, (_, alt: string) => alt)
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "")
    // 連続する3つ以上の<br>を最大2つに制限（縦書き列高さの超過を防止）
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
}

/** XHTMLから main_text 部分を抽出する（ネストしたdivに対応） */
export function extractMainContent(html: string): string {
  const startMatch = html.match(
    /<div[^>]+class=["'][^"']*main_text[^"']*["'][^>]*>/i
  );
  if (startMatch && startMatch.index !== undefined) {
    const startIdx = startMatch.index + startMatch[0].length;
    let depth = 1;
    let i = startIdx;
    while (i < html.length && depth > 0) {
      const openIdx = html.indexOf("<div", i);
      const closeIdx = html.indexOf("</div", i);
      if (closeIdx === -1) break;
      if (openIdx !== -1 && openIdx < closeIdx) {
        depth++;
        i = openIdx + 4;
      } else {
        depth--;
        if (depth === 0) return sanitizeHtml(html.slice(startIdx, closeIdx));
        i = closeIdx + 6;
      }
    }
  }
  // main_text が見つからない場合は body 全体にフォールバック
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return sanitizeHtml(bodyMatch[1]);
  return sanitizeHtml(html);
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function intersectsVertically(rect: DOMRect, containerRect: DOMRect): boolean {
  return rect.bottom > containerRect.top && rect.top < containerRect.bottom;
}

function intersectsHorizontally(rect: DOMRect, containerRect: DOMRect): boolean {
  return rect.right > containerRect.left && rect.left < containerRect.right;
}

function isVisibleRect(rect: DOMRect, containerRect: DOMRect): boolean {
  return intersectsHorizontally(rect, containerRect) && intersectsVertically(rect, containerRect);
}

function extractSentence(text: string): string {
  const normalized = normalizeText(text);

  if (!normalized) {
    return "";
  }

  const sentenceMatch = normalized.match(/^.*?[。！？!?]/);
  const sentence = sentenceMatch ? sentenceMatch[0] : normalized;

  return sentence.length > 56 ? `${sentence.slice(0, 55)}…` : sentence;
}

export function extractPageExcerpt(
  rootElement: HTMLElement,
  viewportElement: HTMLElement
): string {
  const viewportRect = viewportElement.getBoundingClientRect();
  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const textContent = textNode.textContent ?? "";

    if (!normalizeText(textContent)) {
      continue;
    }

    const nodeRange = document.createRange();
    nodeRange.selectNodeContents(textNode);
    const rects = Array.from(nodeRange.getClientRects());

    if (!rects.some((rect) => isVisibleRect(rect, viewportRect))) {
      continue;
    }

    for (let index = 0; index < textContent.length; index += 1) {
      const range = document.createRange();
      range.setStart(textNode, index);
      range.setEnd(textNode, Math.min(index + 1, textContent.length));

      const [rect] = Array.from(range.getClientRects());
      if (!rect || !isVisibleRect(rect, viewportRect)) {
        continue;
      }

      return extractSentence(textContent.slice(index));
    }

    return extractSentence(textContent);
  }

  return "";
}

// ============= チャンク管理 =============

export const CHUNK_SIZE = 50; // 1チャンク = 50ページ

export interface ContentChunk {
  chunkId: number;
  startPage: number;
  endPage: number;
  html: string;
}

/**
 * 全HTMLをチャンクに分割する
 * 各チャンクは50ページ相当のコンテンツを含む
 * @param html 全体のHTML
 * @param totalPages 総ページ数
 * @returns チャンク配列
 */
export function splitContentIntoChunks(
  html: string,
  totalPages: number
): ContentChunk[] {
  // 総ページ数からチャンク数を計算
  const totalChunks = Math.ceil(totalPages / CHUNK_SIZE);

  // HTMLをパース可能な形で分割するため、ラッパーを作成
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  const chunks: ContentChunk[] = [];
  const children = Array.from(wrapper.children);

  let currentChunkId = 0;
  let currentChunkHtml = "";
  let currentChunkStartPage = 0;

  // 簡易的なページ数推定：テキスト文字数 / 平均文字数 per ページ
  // 日本語テキスト1ページ ≈ 500文字が目安
  const estimatedCharsPerPage = 500;
  const totalChars = wrapper.textContent?.length ?? 0;
  const charsPerChunk = (totalChars / totalPages) * CHUNK_SIZE;

  let currentChunkChars = 0;

  for (const child of children) {
    const childChars = child.textContent?.length ?? 0;
    currentChunkHtml += child.outerHTML;
    currentChunkChars += childChars;

    // チャンク内の文字数がしきい値を超えたら、チャンクを確定
    if (currentChunkChars >= charsPerChunk && currentChunkId < totalChunks - 1) {
      const endPage = Math.min(
        currentChunkStartPage + CHUNK_SIZE,
        totalPages - 1
      );

      chunks.push({
        chunkId: currentChunkId,
        startPage: currentChunkStartPage,
        endPage,
        html: currentChunkHtml,
      });

      // 次のチャンクを初期化
      currentChunkId += 1;
      currentChunkStartPage = endPage + 1;
      currentChunkHtml = "";
      currentChunkChars = 0;
    }
  }

  // 残りのコンテンツを最終チャンクに追加
  if (currentChunkHtml) {
    chunks.push({
      chunkId: currentChunkId,
      startPage: currentChunkStartPage,
      endPage: totalPages - 1,
      html: currentChunkHtml,
    });
  }

  return chunks;
}

/**
 * 現在のページから、必要なチャンクIDを計算する
 * 前後1チャンクを含めて、合計3チャンク分のデータを保持する
 * @param currentPage 現在のページ
 * @returns 保持すべきチャンクIDの配列
 */
export function getRequiredChunkIds(currentPage: number): number[] {
  const currentChunkId = Math.floor(currentPage / CHUNK_SIZE);
  return [
    Math.max(0, currentChunkId - 1), // 前のチャンク
    currentChunkId, // 現在のチャンク
    currentChunkId + 1, // 次のチャンク
  ];
}
