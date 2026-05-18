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

export function countTextCharacters(html: string): number {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return wrapper.textContent?.length ?? 0;
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
  totalPages: number,
  pageWidth: number,
  pageHeight: number
): ContentChunk[] {
  if (!html || totalPages <= 0 || pageWidth <= 0 || pageHeight <= 0) {
    return [];
  }

  const wrapper = document.createElement("div");
  wrapper.className = "book-content";
  wrapper.style.position = "fixed";
  wrapper.style.top = "0";
  wrapper.style.left = "-9999px";
  wrapper.style.width = `${pageWidth}px`;
  wrapper.style.height = `${pageHeight}px`;
  wrapper.style.visibility = "hidden";
  wrapper.style.pointerEvents = "none";
  wrapper.style.overflow = "visible";
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  const containerRect = wrapper.getBoundingClientRect();
  const range = document.createRange();
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  const chunkStartPositions: Array<{ node: Text; offset: number }> = [];
  let nextChunkStart = 0;
  let lastTextNode: Text | null = null;
  let lastTextOffset = 0;

  const getPageIndexAtOffset = (node: Text, offset: number): number | null => {
    range.setStart(node, offset);
    range.setEnd(node, Math.min(offset + 1, node.length));
    const rects = Array.from(range.getClientRects());
    if (rects.length === 0) {
      return null;
    }

    const rect = rects[0];
    return Math.max(0, Math.floor((containerRect.right - rect.right) / pageWidth));
  };

  while (nextChunkStart < totalPages && walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    const textContent = textNode.textContent ?? "";
    if (!normalizeText(textContent)) {
      continue;
    }

    lastTextNode = textNode;
    lastTextOffset = textContent.length;

    let index = 0;
    while (index < textContent.length && nextChunkStart < totalPages) {
      const pageIndex = getPageIndexAtOffset(textNode, index);
      if (pageIndex === null) {
        index += 1;
        continue;
      }

      while (pageIndex >= nextChunkStart && nextChunkStart < totalPages) {
        chunkStartPositions.push({ node: textNode, offset: index });
        nextChunkStart += CHUNK_SIZE;
      }

      index += 1;
    }
  }

  if (chunkStartPositions.length === 0 && lastTextNode) {
    chunkStartPositions.push({ node: lastTextNode, offset: 0 });
  }

  const totalChunks = Math.max(1, Math.ceil(totalPages / CHUNK_SIZE));
  while (chunkStartPositions.length < totalChunks && lastTextNode) {
    chunkStartPositions.push({ node: lastTextNode, offset: lastTextOffset });
  }

  const chunks: ContentChunk[] = [];
  for (let chunkId = 0; chunkId < totalChunks; chunkId += 1) {
    const startBoundary = chunkStartPositions[chunkId] || {
      node: lastTextNode as Text,
      offset: 0,
    };
    const endBoundary = chunkStartPositions[chunkId + 1] || {
      node: lastTextNode as Text,
      offset: lastTextOffset,
    };

    range.setStart(startBoundary.node, startBoundary.offset);
    range.setEnd(endBoundary.node, endBoundary.offset);

    const fragment = range.cloneContents();
    const chunkWrapper = document.createElement("div");
    chunkWrapper.appendChild(fragment);

    chunks.push({
      chunkId,
      startPage: chunkId * CHUNK_SIZE,
      endPage: Math.min((chunkId + 1) * CHUNK_SIZE, totalPages) - 1,
      html: chunkWrapper.innerHTML,
    });
  }

  document.body.removeChild(wrapper);
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
