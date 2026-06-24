"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { getBookStateUseCase } from "@/application/usecases/getBookStateUseCase";
import { toggleBookmarkUseCase } from "@/application/usecases/toggleBookmarkUseCase";
import { updateReadingPositionUseCase } from "@/application/usecases/updateReadingPositionUseCase";
import {
  extractMainContent,
  extractPageExcerpt,
  estimatePageCountFromHtml,
  prepareBookDisplay,
  getChunkForPage,
} from "@/components/screens/BookScreen/bookHtmlUtils";
import type { Bookmark } from "@/domain/entities/work";
import type { ChunkMetadata, CalculatedChunk } from "@/components/screens/BookScreen/bookHtmlUtils";

const FADE_TIMEOUT_MS = 3000;

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
  const [chunkStartPage, setChunkStartPage] = useState(0);
  const [isChunkTransitioning, setIsChunkTransitioning] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [layoutContainerReady, setLayoutContainerReady] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fullHtmlContentRef = useRef<string>("");
  const chunkMetadataRef = useRef<ChunkMetadata | null>(null);
  const currentChunkRef = useRef<CalculatedChunk | null>(null);
  const chunksInitializedRef = useRef(false);
  const initialPageRef = useRef(0);

  const pageCountRef = useRef(1);
  const layoutParamsRef = useRef<{
    columnWidth: number;
    containerHeight: number;
    containerWidth: number;
  } | null>(null);

  const localPage = currentPage - chunkStartPage;

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
    chunksInitializedRef.current = false;
    chunkMetadataRef.current = null;
    currentChunkRef.current = null;
    setChunkStartPage(0);
    setIsChunkTransitioning(false);
    setIsReady(false);
    setContentLoaded(false);
    setLayoutContainerReady(false);
    setHtmlContent(null);
  }, [identifier]);

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

    const metadata = prepareBookDisplay(
      fullHtmlContentRef.current,
      params,
      initialPageRef.current
    );
    chunkMetadataRef.current = metadata;
    pageCountRef.current = metadata.totalPages;
    setPageCount(metadata.totalPages);

    const initialChunk = getChunkForPage(initialPageRef.current, metadata, "neutral");
    if (!initialChunk) {
      setHtmlContent("");
      chunksInitializedRef.current = true;
      setIsReady(true);
      return;
    }

    currentChunkRef.current = initialChunk;
    setChunkStartPage(initialChunk.startPage);
    setHtmlContent(initialChunk.content);
    chunksInitializedRef.current = true;
    setIsReady(true);
  }, [contentLoaded, layoutContainerReady]);

  useEffect(() => {
    if (!htmlContent) {
      return;
    }

    calcLayout();
  }, [htmlContent, calcLayout]);

  const applyChunk = useCallback((chunk: CalculatedChunk) => {
    currentChunkRef.current = chunk;
    setChunkStartPage(chunk.startPage);
    setHtmlContent(chunk.content);
  }, []);

  const changePage = useCallback(
    (nextPage: number, direction: "forward" | "backward") => {
      const metadata = chunkMetadataRef.current;
      if (metadata) {
        const nextChunk = getChunkForPage(nextPage, metadata, direction);
        if (nextChunk && nextChunk.chunkId !== currentChunkRef.current?.chunkId) {
          setIsChunkTransitioning(true);
          applyChunk(nextChunk);
          requestAnimationFrame(() => {
            setIsChunkTransitioning(false);
            requestAnimationFrame(() => {
              setCurrentPage(nextPage);
              void updateReadingPositionUseCase(
                clientWorkLibraryRepository,
                identifier,
                nextPage,
                pageCountRef.current
              );
            });
          });
          return;
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
      if (fullHtmlContentRef.current && layoutParamsRef.current) {
        const recalculatedPageCount = estimatePageCountFromHtml(
          fullHtmlContentRef.current,
          layoutParamsRef.current
        );
        setPageCount(recalculatedPageCount);
        pageCountRef.current = recalculatedPageCount;
        setCurrentPage((prev) => Math.min(prev, recalculatedPageCount - 1));
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [calcLayout]);

  const handlePrevPage = useCallback(() => {
    showControls();
    if (currentPage <= 0) {
      return;
    }

    changePage(currentPage - 1, "backward");
  }, [changePage, currentPage, showControls]);

  const handleNextPage = useCallback(() => {
    showControls();
    if (currentPage >= pageCountRef.current - 1) {
      return;
    }

    changePage(currentPage + 1, "forward");
  }, [changePage, currentPage, showControls]);

  const handleClose = useCallback(() => {
    router.push("/");
  }, [router]);

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
    localPage,
    pageCount,
    contentAreaWidth,
    isChunkTransitioning,
    controlsVisible,
    isReady,
    bookmarks,
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
