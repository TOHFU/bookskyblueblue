"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { getBookStateUseCase } from "@/application/usecases/getBookStateUseCase";
import { toggleBookmarkUseCase } from "@/application/usecases/toggleBookmarkUseCase";
import { updateReadingPositionUseCase } from "@/application/usecases/updateReadingPositionUseCase";
import {
  extractMainContent,
  extractPageExcerpt,
  prepareBookDisplayFromBlocks,
  prepareBookDisplayFromCache,
  getChunkForPage,
  isPageRenderableInChunk,
  measureTranslateXForPage,
  createLayoutKey,
  hashBookContent,
} from "@/components/screens/BookScreen/bookHtmlUtils";
import {
  splitHtmlIntoBlocksAsync,
  cancelPendingSplitHtmlTasks,
} from "@/components/screens/BookScreen/splitHtmlIntoBlocksAsync";
import type { LayoutParams } from "@/components/screens/BookScreen/bookHtmlUtils";
import {
  flushLayoutCache,
  scheduleDeferredCacheBuild,
  scheduleTotalPagesMeasurement,
} from "@/components/screens/BookScreen/bookLayoutCacheScheduler";
import { getBookLayoutCache } from "@/data/repositories/bookLayoutCacheRepository";
import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";
import type { Bookmark } from "@/domain/entities/work";
import type { ChunkMetadata, CalculatedChunk } from "@/components/screens/BookScreen/bookHtmlUtils";

const FADE_TIMEOUT_MS = 3000;
const RESIZE_REBUILD_DEBOUNCE_MS = 200;

function measureColumnWidth(): number {
  const probe = document.createElement("div");
  probe.className = "book-content";
  probe.style.cssText = "position:fixed;left:-99999px;visibility:hidden;";
  probe.textContent = "あ";
  document.body.appendChild(probe);
  const lineHeight = parseFloat(getComputedStyle(probe).lineHeight);
  document.body.removeChild(probe);
  return Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 32;
}

export function useBookScreen(identifier: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);
  const [contentStartPage, setContentStartPage] = useState(0);
  const [pageTranslateX, setPageTranslateX] = useState(0);
  const [isChunkTransitioning, setIsChunkTransitioning] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [layoutContainerReady, setLayoutContainerReady] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [totalPagesKnown, setTotalPagesKnown] = useState(true);

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fullHtmlContentRef = useRef<string>("");
  const chunkMetadataRef = useRef<ChunkMetadata | null>(null);
  const currentChunkRef = useRef<CalculatedChunk | null>(null);
  const chunksInitializedRef = useRef(false);
  const initialPageRef = useRef(0);
  const layoutKeyRef = useRef("");
  const contentHashRef = useRef("");
  const cancelDeferredCacheBuildRef = useRef<(() => void) | null>(null);
  const cancelTotalPagesMeasurementRef = useRef<(() => void) | null>(null);
  const resizeRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rebuildGenerationRef = useRef(0);
  const initialLayoutSyncedRef = useRef(false);
  const contentStartPageRef = useRef(0);
  const displayReconcileRef = useRef(0);

  const pageCountRef = useRef(1);
  const currentPageRef = useRef(0);
  const layoutParamsRef = useRef<{
    columnWidth: number;
    containerHeight: number;
    containerWidth: number;
  } | null>(null);

  useEffect(() => {
    contentStartPageRef.current = contentStartPage;
  }, [contentStartPage]);

  useEffect(() => {
    currentPageRef.current = currentPage;
    displayReconcileRef.current = 0;
  }, [currentPage]);

  const cancelDeferredCacheBuild = useCallback(() => {
    cancelDeferredCacheBuildRef.current?.();
    cancelDeferredCacheBuildRef.current = null;
  }, []);

  const cancelTotalPagesMeasurement = useCallback(() => {
    cancelTotalPagesMeasurementRef.current?.();
    cancelTotalPagesMeasurementRef.current = null;
  }, []);

  const startDeferredCacheBuild = useCallback(() => {
    cancelDeferredCacheBuild();

    const layoutKey = layoutKeyRef.current;
    const contentHash = contentHashRef.current;
    if (!layoutKey || !contentHash) {
      return;
    }

    cancelDeferredCacheBuildRef.current = scheduleDeferredCacheBuild({
      workId: identifier,
      layoutKey,
      contentHash,
      getMetadata: () => chunkMetadataRef.current,
    });
  }, [cancelDeferredCacheBuild, identifier]);

  const flushCurrentLayoutCache = useCallback(
    (isComplete: boolean) => {
      const metadata = chunkMetadataRef.current;
      const layoutKey = layoutKeyRef.current;
      const contentHash = contentHashRef.current;
      if (!metadata || !layoutKey || !contentHash) {
        return;
      }

      void flushLayoutCache(identifier, layoutKey, contentHash, metadata, isComplete);
    },
    [identifier]
  );

  const applyMetadataToDisplay = useCallback((metadata: ChunkMetadata, page: number) => {
    const clampedPage = metadata.totalPagesKnown
      ? Math.min(page, Math.max(0, metadata.totalPages - 1))
      : page;

    const chunk = getChunkForPage(clampedPage, metadata, "neutral");
    if (!chunk) {
      setHtmlContent("");
      return clampedPage;
    }

    pageCountRef.current = metadata.totalPagesKnown
      ? metadata.totalPages
      : Math.max(metadata.totalPages, chunk.endPage);
    setPageCount(pageCountRef.current);

    chunkMetadataRef.current = metadata;
    setTotalPagesKnown(metadata.totalPagesKnown);
    currentChunkRef.current = chunk;
    setContentStartPage(chunk.contentStartPage);
    setHtmlContent(chunk.content);
    setCurrentPage(clampedPage);

    return clampedPage;
  }, []);

  const scheduleLayoutBackgroundWork = useCallback(
    (html: string, params: LayoutParams, cached: StoredBookLayout | null) => {
      if (cached?.isComplete) {
        return;
      }

      if (!cached) {
        cancelTotalPagesMeasurement();
        cancelTotalPagesMeasurementRef.current = scheduleTotalPagesMeasurement({
          html,
          params,
          getMetadata: () => chunkMetadataRef.current,
          onMeasured: (totalPages) => {
            pageCountRef.current = totalPages;
            setPageCount(totalPages);
            setTotalPagesKnown(true);
            setCurrentPage((prev) => Math.min(prev, totalPages - 1));
            flushCurrentLayoutCache(false);
            startDeferredCacheBuild();
          },
        });
        return;
      }

      startDeferredCacheBuild();
    },
    [
      cancelTotalPagesMeasurement,
      flushCurrentLayoutCache,
      startDeferredCacheBuild,
    ]
  );

  const rebuildBookDisplay = useCallback(
    async (params: LayoutParams, page: number) => {
      const html = fullHtmlContentRef.current;
      if (!html) {
        return;
      }

      const generation = ++rebuildGenerationRef.current;
      const contentHash = contentHashRef.current || hashBookContent(html);
      contentHashRef.current = contentHash;

      const layoutKey = createLayoutKey(params);
      layoutKeyRef.current = layoutKey;
      layoutParamsRef.current = params;

      const blocks = await splitHtmlIntoBlocksAsync(html);
      const cached = await getBookLayoutCache(identifier, layoutKey, contentHash);

      if (generation !== rebuildGenerationRef.current) {
        return;
      }

      const metadata = cached
        ? prepareBookDisplayFromCache(blocks, params, cached, page)
        : prepareBookDisplayFromBlocks(blocks, params, page);

      applyMetadataToDisplay(metadata, page);
      scheduleLayoutBackgroundWork(html, params, cached);
    },
    [applyMetadataToDisplay, identifier, scheduleLayoutBackgroundWork]
  );

  const reinitializeOnLayoutChange = useCallback(() => {
    const params = layoutParamsRef.current;
    if (!params || !chunksInitializedRef.current) {
      return;
    }

    const newLayoutKey = createLayoutKey(params);
    if (newLayoutKey === layoutKeyRef.current) {
      return;
    }

    flushCurrentLayoutCache(false);
    cancelDeferredCacheBuild();
    cancelTotalPagesMeasurement();
    void rebuildBookDisplay(params, currentPageRef.current);
  }, [
    cancelDeferredCacheBuild,
    cancelTotalPagesMeasurement,
    flushCurrentLayoutCache,
    rebuildBookDisplay,
  ]);

  const showControls = useCallback(() => {
    setControlsVisible(true);

    if (fadeTimer.current) {
      clearTimeout(fadeTimer.current);
    }

    fadeTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, FADE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    cancelDeferredCacheBuild();
    cancelTotalPagesMeasurement();
    chunksInitializedRef.current = false;
    chunkMetadataRef.current = null;
    currentChunkRef.current = null;
    layoutKeyRef.current = "";
    contentHashRef.current = "";
    setContentStartPage(0);
    setPageTranslateX(0);
    displayReconcileRef.current = 0;
    setIsChunkTransitioning(false);
    setIsReady(false);
    setContentLoaded(false);
    setLayoutContainerReady(false);
    setHtmlContent(null);
    setTotalPagesKnown(true);
    initialLayoutSyncedRef.current = false;
  }, [cancelDeferredCacheBuild, cancelTotalPagesMeasurement, identifier]);

  useEffect(() => {
    return () => {
      cancelDeferredCacheBuild();
      cancelTotalPagesMeasurement();
      cancelPendingSplitHtmlTasks();
      if (resizeRebuildTimerRef.current) {
        clearTimeout(resizeRebuildTimerRef.current);
      }
    };
  }, [cancelDeferredCacheBuild, cancelTotalPagesMeasurement]);

  useEffect(() => {
    const loadWork = async () => {
      const state = await getBookStateUseCase(clientWorkLibraryRepository, identifier);
      if (!state.content) {
        setHtmlContent("");
        setIsReady(true);
        chunksInitializedRef.current = true;
        return;
      }

      const requestedPage = Number(searchParams.get("page"));
      const initialPage =
        Number.isInteger(requestedPage) && requestedPage >= 0 ? requestedPage : state.page;

      fullHtmlContentRef.current = extractMainContent(state.content);
      initialPageRef.current = initialPage;
      setCurrentPage(initialPage);
      setBookmarks(state.bookmarks);
      setContentLoaded(true);
    };

    void loadWork();

    fadeTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, FADE_TIMEOUT_MS);

    return () => {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
      }
    };
  }, [identifier, searchParams]);

  const calcLayout = useCallback(() => {
    if (!innerRef.current || !contentAreaRef.current) {
      return;
    }

    contentAreaRef.current.style.width = "";
    contentAreaRef.current.style.right = "";

    const computedLineHeight = parseFloat(getComputedStyle(innerRef.current).lineHeight);
    const columnWidth =
      Number.isFinite(computedLineHeight) && computedLineHeight > 0
        ? computedLineHeight
        : 32;

    const rawAreaWidth = contentAreaRef.current.clientWidth;
    const containerHeight = contentAreaRef.current.clientHeight;
    const columnsPerPage = Math.max(1, Math.floor(rawAreaWidth / columnWidth));
    const snappedPageWidth = columnsPerPage * columnWidth;

    contentAreaRef.current.style.width = `${snappedPageWidth}px`;
    contentAreaRef.current.style.right = "auto";

    layoutParamsRef.current = {
      columnWidth,
      containerHeight,
      containerWidth: rawAreaWidth,
    };

    setContentAreaWidth(snappedPageWidth);

    if (!chunkMetadataRef.current) {
      const totalWidth = innerRef.current.offsetWidth;
      const totalColumns = Math.ceil(totalWidth / columnWidth);
      const nextPageCount = Math.max(1, Math.ceil(totalColumns / columnsPerPage));
      setPageCount(nextPageCount);
      pageCountRef.current = nextPageCount;
    }
  }, []);

  const syncDisplayLayout = useCallback(() => {
    calcLayout();

    const contentElement = innerRef.current;
    const params = layoutParamsRef.current;
    const metadata = chunkMetadataRef.current;
    const activeChunk = currentChunkRef.current;
    const page = currentPageRef.current;

    if (!contentElement || !params) {
      return;
    }

    if (metadata) {
      metadata.layoutParams = params;
    }

    if (
      metadata &&
      activeChunk &&
      !isPageRenderableInChunk(page, activeChunk, contentElement, params) &&
      displayReconcileRef.current < 3
    ) {
      displayReconcileRef.current += 1;
      metadata.chunks = metadata.chunks.filter(
        (chunk) => chunk.startPage !== activeChunk.startPage
      );
      const rebuilt = getChunkForPage(page, metadata, "neutral");
      if (rebuilt) {
        currentChunkRef.current = rebuilt;
        contentStartPageRef.current = rebuilt.contentStartPage;
        setContentStartPage(rebuilt.contentStartPage);
        setHtmlContent(rebuilt.content);
        return;
      }
    }

    setPageTranslateX(
      measureTranslateXForPage(
        contentElement,
        page,
        contentStartPageRef.current,
        params
      )
    );
  }, [calcLayout]);

  useEffect(() => {
    const contentArea = contentAreaRef.current;
    if (!contentArea) {
      return;
    }

    const updateReadyState = () => {
      if (contentArea.clientWidth > 0 && contentArea.clientHeight > 0) {
        setLayoutContainerReady(true);
      }
    };

    updateReadyState();
    const observer = new ResizeObserver(updateReadyState);
    observer.observe(contentArea);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !contentLoaded ||
      !layoutContainerReady ||
      chunksInitializedRef.current ||
      !fullHtmlContentRef.current
    ) {
      return;
    }

    const contentArea = contentAreaRef.current;
    if (!contentArea) {
      return;
    }

    const containerWidth = contentArea.clientWidth;
    const containerHeight = contentArea.clientHeight;
    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    const params = {
      columnWidth: measureColumnWidth(),
      containerHeight,
      containerWidth,
    };
    layoutParamsRef.current = params;

    let cancelled = false;

    const initializeDisplay = async () => {
      const html = fullHtmlContentRef.current;
      contentHashRef.current = hashBookContent(html);

      await rebuildBookDisplay(params, initialPageRef.current);

      if (cancelled) {
        return;
      }

      chunksInitializedRef.current = true;
    };

    void initializeDisplay();

    return () => {
      cancelled = true;
    };
  }, [contentLoaded, identifier, layoutContainerReady, rebuildBookDisplay]);

  useEffect(() => {
    if (!htmlContent) {
      return;
    }

    syncDisplayLayout();
  }, [htmlContent, syncDisplayLayout]);

  useLayoutEffect(() => {
    if (!chunksInitializedRef.current || !htmlContent) {
      return;
    }

    syncDisplayLayout();
  }, [currentPage, contentStartPage, htmlContent, isReady, syncDisplayLayout]);

  useEffect(() => {
    if (!chunksInitializedRef.current || !htmlContent || initialLayoutSyncedRef.current) {
      return;
    }

    if (!innerRef.current || !contentAreaRef.current) {
      return;
    }

    calcLayout();

    const params = layoutParamsRef.current;
    if (!params) {
      return;
    }

    initialLayoutSyncedRef.current = true;

    let cancelled = false;

    void (async () => {
      await rebuildBookDisplay(params, currentPageRef.current);
      if (!cancelled) {
        setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [calcLayout, htmlContent, rebuildBookDisplay]);

  const applyChunk = useCallback((chunk: CalculatedChunk) => {
    currentChunkRef.current = chunk;
    setContentStartPage(chunk.contentStartPage);
    setHtmlContent(chunk.content);
  }, []);

  const changePage = useCallback(
    (nextPage: number, direction: "forward" | "backward") => {
      const metadata = chunkMetadataRef.current;
      const activeChunk = currentChunkRef.current;
      const layoutParams = layoutParamsRef.current;
      const contentElement = innerRef.current;

      const canStayInActiveChunk =
        activeChunk &&
        layoutParams &&
        contentElement &&
        isPageRenderableInChunk(nextPage, activeChunk, contentElement, layoutParams);

      if (canStayInActiveChunk) {
        setCurrentPage(nextPage);
        void updateReadingPositionUseCase(
          clientWorkLibraryRepository,
          identifier,
          nextPage,
          pageCountRef.current
        );
        return;
      }

      if (metadata) {
        const nextChunk = getChunkForPage(nextPage, metadata, direction);
        if (nextChunk && nextChunk.chunkId !== activeChunk?.chunkId) {
          setIsChunkTransitioning(true);
          applyChunk(nextChunk);
          setCurrentPage(nextPage);
          void updateReadingPositionUseCase(
            clientWorkLibraryRepository,
            identifier,
            nextPage,
            pageCountRef.current
          );
          requestAnimationFrame(() => {
            setIsChunkTransitioning(false);
          });
          return;
        }

        if (nextChunk && nextChunk.chunkId === activeChunk?.chunkId) {
          const needsRebuild =
            layoutParams &&
            contentElement &&
            !isPageRenderableInChunk(nextPage, nextChunk, contentElement, layoutParams);
          if (needsRebuild && metadata) {
            metadata.layoutParams = layoutParams;
            const startPage = nextChunk.startPage;
            metadata.chunks = metadata.chunks.filter((chunk) => chunk.startPage !== startPage);
            const rebuilt = getChunkForPage(nextPage, metadata, direction);
            if (rebuilt) {
              setIsChunkTransitioning(true);
              applyChunk(rebuilt);
              setCurrentPage(nextPage);
              void updateReadingPositionUseCase(
                clientWorkLibraryRepository,
                identifier,
                nextPage,
                pageCountRef.current
              );
              requestAnimationFrame(() => {
                setIsChunkTransitioning(false);
              });
              return;
            }
          }
        }
      }

      setCurrentPage(nextPage);
      void updateReadingPositionUseCase(
        clientWorkLibraryRepository,
        identifier,
        nextPage,
        pageCountRef.current
      );
    },
    [applyChunk, identifier]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      calcLayout();

      if (!chunksInitializedRef.current || !layoutParamsRef.current) {
        return;
      }

      const newLayoutKey = createLayoutKey(layoutParamsRef.current);
      if (newLayoutKey === layoutKeyRef.current) {
        return;
      }

      if (resizeRebuildTimerRef.current) {
        clearTimeout(resizeRebuildTimerRef.current);
      }

      resizeRebuildTimerRef.current = setTimeout(() => {
        reinitializeOnLayoutChange();
      }, RESIZE_REBUILD_DEBOUNCE_MS);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (resizeRebuildTimerRef.current) {
        clearTimeout(resizeRebuildTimerRef.current);
      }
    };
  }, [calcLayout, reinitializeOnLayoutChange]);

  const handlePrevPage = useCallback(() => {
    showControls();
    if (currentPage <= 0) {
      return;
    }

    changePage(currentPage - 1, "backward");
  }, [changePage, currentPage, showControls]);

  const handleNextPage = useCallback(() => {
    showControls();
    const metadata = chunkMetadataRef.current;
    if (metadata?.totalPagesKnown && currentPage >= pageCountRef.current - 1) {
      return;
    }

    changePage(currentPage + 1, "forward");
  }, [changePage, currentPage, showControls]);

  const handleClose = useCallback(() => {
    cancelDeferredCacheBuild();
    cancelTotalPagesMeasurement();
    flushCurrentLayoutCache(false);
    router.push("/");
  }, [cancelDeferredCacheBuild, cancelTotalPagesMeasurement, flushCurrentLayoutCache, router]);

  const handleToggleBookmark = useCallback(async () => {
    if (!innerRef.current || !contentAreaRef.current) {
      return;
    }

    showControls();

    const excerpt = extractPageExcerpt(innerRef.current, contentAreaRef.current);
    const nextBookmarks = await toggleBookmarkUseCase(
      clientWorkLibraryRepository,
      identifier,
      {
        page: currentPage,
        excerpt,
      }
    );

    setBookmarks(nextBookmarks);
  }, [currentPage, identifier, showControls]);

  return {
    htmlContent,
    currentPage,
    pageTranslateX,
    pageCount,
    contentAreaWidth,
    isChunkTransitioning,
    controlsVisible,
    isReady,
    bookmarks,
    totalPagesKnown,
    isCurrentPageBookmarked: bookmarks.some((bookmark) => bookmark.page === currentPage),
    isOddPageNumber: (currentPage + 1) % 2 !== 0,
    containerRef,
    contentAreaRef,
    innerRef,
    showControls,
    handlePrevPage,
    handleNextPage,
    handleToggleBookmark,
    handleClose,
  };
}
