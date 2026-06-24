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

export const CHUNK_SIZE = 20;
/** チャンク境界付近でスライドアニメーションを維持するための重複ページ数 */
export const CHUNK_OVERLAP_PAGES = 2;

export type LayoutParams = {
  columnWidth: number;
  containerHeight: number;
  containerWidth: number;
};

export type PageNavigationDirection = "forward" | "backward" | "neutral";

export type CalculatedChunk = {
  chunkId: number;
  startPage: number;
  endPage: number;
  content: string;
  blockStart: number;
  blockEnd: number;
};

export type ChunkMetadata = {
  totalPages: number;
  totalChunks: number;
  chunks: CalculatedChunk[];
  blocks: string[];
  layoutParams: LayoutParams;
};

function measurePageCount(element: HTMLElement, params: LayoutParams): number {
  const { columnWidth, containerWidth } = params;
  const columnsPerPage = Math.max(1, Math.floor(containerWidth / columnWidth));
  const totalWidth = element.offsetWidth;
  const totalColumns = Math.ceil(totalWidth / columnWidth);
  return Math.max(1, Math.ceil(totalColumns / columnsPerPage));
}

function createOffscreenMeasurer(params: LayoutParams): {
  root: HTMLDivElement;
  content: HTMLDivElement;
} {
  const root = document.createElement("div");
  root.style.cssText = [
    "position:fixed",
    "left:-99999px",
    "top:0",
    "visibility:hidden",
    "overflow:hidden",
    `height:${params.containerHeight}px`,
    `width:${params.containerWidth}px`,
  ].join(";");
  const content = document.createElement("div");
  content.className = "book-content";
  content.style.height = "100%";
  root.appendChild(content);
  document.body.appendChild(root);
  return { root, content };
}

export function splitHtmlIntoBlocks(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="chunk-root">${html}</div>`, "text/html");
  const root = doc.getElementById("chunk-root");
  if (!root) {
    return [html];
  }

  const blocks: string[] = [];
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push(text);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      blocks.push((node as Element).outerHTML);
    }
  });

  return blocks.length > 0 ? blocks : [html];
}

function buildChunkContent(blocks: string[], blockStart: number, blockEnd: number): string {
  return blocks.slice(blockStart, blockEnd + 1).join("");
}

class BlockMeasurer {
  private readonly root: HTMLDivElement;
  private readonly content: HTMLDivElement;
  private readonly prefixCache = new Map<number, number>();

  constructor(private readonly params: LayoutParams) {
    const { root, content } = createOffscreenMeasurer(params);
    this.root = root;
    this.content = content;
  }

  measurePrefix(blocks: string[], endIndex: number): number {
    const cached = this.prefixCache.get(endIndex);
    if (cached !== undefined) {
      return cached;
    }

    this.content.innerHTML = blocks.slice(0, endIndex + 1).join("");
    const pages = measurePageCount(this.content, this.params);
    this.prefixCache.set(endIndex, pages);
    return pages;
  }

  dispose(): void {
    document.body.removeChild(this.root);
  }
}

function findBlockForPageStart(
  blocks: string[],
  page: number,
  measurer: BlockMeasurer
): number {
  if (page === 0) {
    return 0;
  }

  let lo = 0;
  let hi = blocks.length - 1;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (measurer.measurePrefix(blocks, mid) < page + 1) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
}

function resolveChunkStartPage(globalPage: number): number {
  const nominalStart = Math.floor(globalPage / CHUNK_SIZE) * CHUNK_SIZE;
  if (nominalStart === 0) {
    return 0;
  }
  return Math.max(0, nominalStart - CHUNK_OVERLAP_PAGES);
}

function buildChunkAtStartPage(
  blocks: string[],
  totalPages: number,
  params: LayoutParams,
  startPage: number,
  chunkId: number
): CalculatedChunk {
  const measurer = new BlockMeasurer(params);

  try {
    const blockStart = findBlockForPageStart(blocks, startPage, measurer);
    const lastPageInChunk = Math.min(startPage + CHUNK_SIZE, totalPages) - 1;
    const blockEnd = findBlockForPageStart(blocks, lastPageInChunk, measurer);
    const pagesBeforeStart = blockStart > 0 ? measurer.measurePrefix(blocks, blockStart - 1) : 0;
    const pagesThroughEnd = measurer.measurePrefix(blocks, blockEnd);
    const chunkPages = pagesThroughEnd - pagesBeforeStart;

    return {
      chunkId,
      startPage,
      endPage: startPage + chunkPages,
      blockStart,
      blockEnd,
      content: buildChunkContent(blocks, blockStart, blockEnd),
    };
  } finally {
    measurer.dispose();
  }
}

function findMatchingChunks(
  metadata: ChunkMetadata,
  globalPage: number
): CalculatedChunk[] {
  return metadata.chunks.filter(
    (entry) => globalPage >= entry.startPage && globalPage < entry.endPage
  );
}

function ensureChunkAtStartPage(
  metadata: ChunkMetadata,
  startPage: number
): CalculatedChunk {
  const existing = metadata.chunks.find((chunk) => chunk.startPage === startPage);
  if (existing) {
    return existing;
  }

  const chunk = buildChunkAtStartPage(
    metadata.blocks,
    metadata.totalPages,
    metadata.layoutParams,
    startPage,
    metadata.chunks.length
  );
  metadata.chunks.push(chunk);
  metadata.chunks.sort((left, right) => left.startPage - right.startPage);
  return chunk;
}

function resolveChunkStartPageForNavigation(
  globalPage: number,
  direction: PageNavigationDirection
): number {
  const nominalStart = Math.floor(globalPage / CHUNK_SIZE) * CHUNK_SIZE;

  if (direction === "backward" && globalPage < nominalStart + CHUNK_OVERLAP_PAGES) {
    const previousStart = nominalStart - CHUNK_SIZE;
    if (previousStart <= 0) {
      return 0;
    }
    return Math.max(0, previousStart - CHUNK_OVERLAP_PAGES);
  }

  return resolveChunkStartPage(globalPage);
}

export function createLayoutKey(params: LayoutParams): string {
  return `${Math.round(params.columnWidth)}:${Math.round(params.containerHeight)}:${Math.round(params.containerWidth)}`;
}

export function hashBookContent(html: string): string {
  let hash = 0;
  const step = Math.max(1, Math.floor(html.length / 256));

  for (let index = 0; index < html.length; index += step) {
    hash = (hash * 31 + html.charCodeAt(index)) | 0;
  }

  return `${html.length}:${hash}`;
}

export function chunkToStoredBoundary(chunk: CalculatedChunk) {
  return {
    chunkId: chunk.chunkId,
    startPage: chunk.startPage,
    endPage: chunk.endPage,
    blockStart: chunk.blockStart,
    blockEnd: chunk.blockEnd,
  };
}

export function listNominalChunkStartPages(totalPages: number): number[] {
  const startPages: number[] = [];
  const seen = new Set<number>();

  for (let nominalPage = 0; nominalPage < totalPages; nominalPage += CHUNK_SIZE) {
    const startPage = resolveChunkStartPage(nominalPage);
    if (seen.has(startPage)) {
      continue;
    }
    seen.add(startPage);
    startPages.push(startPage);
  }

  return startPages;
}

export function findNextMissingChunkStartPage(metadata: ChunkMetadata): number | null {
  const existing = new Set(metadata.chunks.map((chunk) => chunk.startPage));

  for (const startPage of listNominalChunkStartPages(metadata.totalPages)) {
    if (!existing.has(startPage)) {
      return startPage;
    }
  }

  return null;
}

export function addChunkAtStartPage(
  metadata: ChunkMetadata,
  startPage: number
): CalculatedChunk {
  return ensureChunkAtStartPage(metadata, startPage);
}

export function hydrateMetadataFromCache(
  blocks: string[],
  params: LayoutParams,
  cached: {
    totalPages: number;
    totalChunks: number;
    chunkBoundaries: Array<{
      chunkId: number;
      startPage: number;
      endPage: number;
      blockStart: number;
      blockEnd: number;
    }>;
  }
): ChunkMetadata {
  const chunks: CalculatedChunk[] = cached.chunkBoundaries.map((boundary) => ({
    ...boundary,
    content: buildChunkContent(blocks, boundary.blockStart, boundary.blockEnd),
  }));

  return {
    totalPages: cached.totalPages,
    totalChunks: cached.totalChunks,
    chunks,
    blocks,
    layoutParams: params,
  };
}

export function prepareBookDisplayFromCache(
  blocks: string[],
  params: LayoutParams,
  cached: {
    totalPages: number;
    totalChunks: number;
    chunkBoundaries: Array<{
      chunkId: number;
      startPage: number;
      endPage: number;
      blockStart: number;
      blockEnd: number;
    }>;
  },
  initialPage: number
): ChunkMetadata {
  const metadata = hydrateMetadataFromCache(blocks, params, cached);
  const hasInitialChunk = metadata.chunks.some(
    (chunk) => initialPage >= chunk.startPage && initialPage < chunk.endPage
  );

  if (!hasInitialChunk) {
    addChunkAtStartPage(metadata, resolveChunkStartPage(initialPage));
  }

  return metadata;
}

/** 初回表示用: 総ページ数の計測と、開くページのチャンクだけを構築する */
export function prepareBookDisplay(
  html: string,
  params: LayoutParams,
  initialPage: number
): ChunkMetadata {
  const blocks = splitHtmlIntoBlocks(html);
  const totalPages =
    blocks.length === 0 ? 1 : estimatePageCountFromHtml(html, params);

  const metadata: ChunkMetadata = {
    totalPages,
    totalChunks: Math.max(1, Math.ceil(totalPages / CHUNK_SIZE)),
    chunks: [],
    blocks,
    layoutParams: params,
  };

  if (blocks.length === 0) {
    return metadata;
  }

  const initialStartPage = resolveChunkStartPage(initialPage);
  ensureChunkAtStartPage(metadata, initialStartPage);
  return metadata;
}

/** @deprecated prepareBookDisplay を使用してください */
export function splitIntoChunks(html: string, params: LayoutParams): ChunkMetadata {
  return prepareBookDisplay(html, params, 0);
}

/** 非表示コンテナで HTML のページ数を推定する */
export function estimatePageCountFromHtml(html: string, params: LayoutParams): number {
  const { root, content } = createOffscreenMeasurer(params);
  try {
    content.innerHTML = html;
    return measurePageCount(content, params);
  } finally {
    document.body.removeChild(root);
  }
}

export function materializeChunk(
  metadata: ChunkMetadata,
  chunk: CalculatedChunk
): CalculatedChunk {
  if (chunk.content) {
    return chunk;
  }

  return {
    ...chunk,
    content: buildChunkContent(metadata.blocks, chunk.blockStart, chunk.blockEnd),
  };
}

export function getChunkForPage(
  globalPage: number,
  metadata: ChunkMetadata,
  direction: PageNavigationDirection = "neutral"
): CalculatedChunk | null {
  const matching = findMatchingChunks(metadata, globalPage);

  if (matching.length > 0) {
    const selected =
      matching.length === 1
        ? matching[0]
        : direction === "backward"
          ? matching[0]
          : matching[matching.length - 1];
    return materializeChunk(metadata, selected);
  }

  if (metadata.blocks.length === 0) {
    const lastChunk = metadata.chunks.at(-1);
    return lastChunk ? materializeChunk(metadata, lastChunk) : null;
  }

  const startPage = resolveChunkStartPageForNavigation(globalPage, direction);
  const chunk = ensureChunkAtStartPage(metadata, startPage);
  return materializeChunk(metadata, chunk);
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
