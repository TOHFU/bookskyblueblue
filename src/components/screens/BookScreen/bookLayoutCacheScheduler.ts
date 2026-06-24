import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";
import {
  createBookLayoutCacheId,
  saveBookLayoutCache,
} from "@/data/repositories/bookLayoutCacheRepository";
import {
  addChunkAtStartPage,
  applyTotalPagesToMetadata,
  chunkToStoredBoundary,
  estimatePageCountFromHtml,
  findNextMissingChunkStartPage,
  type ChunkMetadata,
  type LayoutParams,
} from "@/components/screens/BookScreen/bookHtmlUtils";

type IdleRequestCallback = (deadline: IdleDeadline) => void;

function requestIdleTask(callback: IdleRequestCallback): number {
  if (typeof requestIdleCallback === "function") {
    return requestIdleCallback(callback);
  }

  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 0,
    });
  }, 0);
}

function cancelIdleTask(taskId: number): void {
  if (typeof cancelIdleCallback === "function") {
    cancelIdleCallback(taskId);
    return;
  }

  window.clearTimeout(taskId);
}

export function createStoredBookLayout(
  workId: string,
  layoutKey: string,
  contentHash: string,
  metadata: ChunkMetadata,
  isComplete: boolean
): StoredBookLayout {
  const chunkBoundaries = metadata.chunks
    .map(chunkToStoredBoundary)
    .sort((left, right) => left.startPage - right.startPage);

  return {
    id: createBookLayoutCacheId(workId, layoutKey),
    workId,
    layoutKey,
    contentHash,
    totalPages: metadata.totalPages,
    totalChunks: metadata.totalChunks,
    chunkBoundaries,
    updatedAt: Date.now(),
    isComplete,
  };
}

export async function flushLayoutCache(
  workId: string,
  layoutKey: string,
  contentHash: string,
  metadata: ChunkMetadata,
  isComplete: boolean
): Promise<void> {
  await saveBookLayoutCache(
    createStoredBookLayout(workId, layoutKey, contentHash, metadata, isComplete)
  );
}

type DeferredCacheBuildOptions = {
  workId: string;
  layoutKey: string;
  contentHash: string;
  getMetadata: () => ChunkMetadata | null;
};

export function scheduleDeferredCacheBuild(options: DeferredCacheBuildOptions): () => void {
  let cancelled = false;
  let idleTaskId: number | null = null;

  const run = (deadline: IdleDeadline) => {
    if (cancelled) {
      return;
    }

    const metadata = options.getMetadata();
    if (!metadata) {
      return;
    }

    const nextStartPage = findNextMissingChunkStartPage(metadata);
    if (nextStartPage === null) {
      void flushLayoutCache(
        options.workId,
        options.layoutKey,
        options.contentHash,
        metadata,
        true
      );
      return;
    }

    if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
      addChunkAtStartPage(metadata, nextStartPage);
      void flushLayoutCache(
        options.workId,
        options.layoutKey,
        options.contentHash,
        metadata,
        false
      );
    }

    if (!cancelled && findNextMissingChunkStartPage(metadata) !== null) {
      idleTaskId = requestIdleTask(run);
    } else if (!cancelled) {
      void flushLayoutCache(
        options.workId,
        options.layoutKey,
        options.contentHash,
        metadata,
        true
      );
    }
  };

  idleTaskId = requestIdleTask(run);

  return () => {
    cancelled = true;
    if (idleTaskId !== null) {
      cancelIdleTask(idleTaskId);
    }
  };
}

type TotalPagesMeasurementOptions = {
  html: string;
  params: LayoutParams;
  getMetadata: () => ChunkMetadata | null;
  onMeasured: (totalPages: number) => void;
};

/** 初回オープン時に総ページ数計測をアイドル後へ遅延する */
export function scheduleTotalPagesMeasurement(
  options: TotalPagesMeasurementOptions
): () => void {
  let cancelled = false;
  let idleTaskId: number | null = null;

  const run = () => {
    if (cancelled) {
      return;
    }

    const metadata = options.getMetadata();
    if (!metadata || metadata.totalPagesKnown) {
      return;
    }

    const totalPages = estimatePageCountFromHtml(options.html, options.params);
    if (cancelled) {
      return;
    }

    applyTotalPagesToMetadata(metadata, totalPages);
    options.onMeasured(totalPages);
  };

  idleTaskId = requestIdleTask(() => {
    run();
  });

  return () => {
    cancelled = true;
    if (idleTaskId !== null) {
      cancelIdleTask(idleTaskId);
    }
  };
}
