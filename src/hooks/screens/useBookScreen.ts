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
  splitContentIntoChunks,
  getRequiredChunkIds,
  type ContentChunk,
} from "@/components/screens/BookScreen/bookHtmlUtils";
import type { Bookmark } from "@/domain/entities/work";

const FADE_TIMEOUT_MS = 3000;

export function useBookScreen(identifier: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // チャンク管理用の状態
  const [chunks, setChunks] = useState<ContentChunk[]>([]);
  const [visibleChunkIds, setVisibleChunkIds] = useState<Set<number>>(new Set());

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fullHtmlContentRef = useRef<string>(""); // レイアウト計算用の全コンテンツ
  const hasInitializedChunksRef = useRef(false); // チャンク化実行済みフラグ

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
    const loadWork = async () => {
      const state = await getBookStateUseCase(clientWorkLibraryRepository, identifier);
      if (!state.content) {
        setHtmlContent("");
        setIsReady(true);
        return;
      }

      const requestedPage = Number(searchParams.get("page"));
      const initialPage =
        Number.isInteger(requestedPage) && requestedPage >= 0 ? requestedPage : state.page;

      const mainContent = extractMainContent(state.content);
      fullHtmlContentRef.current = mainContent;

      // 最初はレイアウト計算のため全コンテンツを設定
      setHtmlContent(mainContent);
      setCurrentPage(initialPage);
      setBookmarks(state.bookmarks);
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
    const columnsPerPage = Math.max(1, Math.floor(rawAreaWidth / columnWidth));
    const snappedPageWidth = columnsPerPage * columnWidth;

    const totalWidth = innerRef.current.offsetWidth;
    const totalColumns = Math.ceil(totalWidth / columnWidth);
    const nextPageCount = Math.max(1, Math.ceil(totalColumns / columnsPerPage));

    contentAreaRef.current.style.width = `${snappedPageWidth}px`;
    contentAreaRef.current.style.right = "auto";

    setContentAreaWidth(snappedPageWidth);
    setPageCount(nextPageCount);
    setCurrentPage((prev) => Math.min(prev, nextPageCount - 1));

    // レイアウト計算完了後、チャンク化を実行
    if (!hasInitializedChunksRef.current && fullHtmlContentRef.current) {
      const newChunks = splitContentIntoChunks(fullHtmlContentRef.current, nextPageCount);
      setChunks(newChunks);
      hasInitializedChunksRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!htmlContent) {
      return;
    }

    calcLayout();
  }, [htmlContent, calcLayout]);

  // チャンク化完了またはページ変更時に、必要なチャンクを更新
  useEffect(() => {
    if (chunks.length === 0 || !hasInitializedChunksRef.current) {
      return;
    }

    const requiredIds = getRequiredChunkIds(currentPage);
    setVisibleChunkIds(new Set(requiredIds));

    // 必要なチャンクのHTMLを組み立てる
    const visibleChunks = chunks.filter((chunk) => requiredIds.includes(chunk.chunkId));
    const mergedHtml = visibleChunks.map((chunk) => chunk.html).join("");

    if (mergedHtml && innerRef.current) {
      // 直接DOMを更新してcalcLayout()の再実行を避ける
      innerRef.current.innerHTML = mergedHtml;
    }
  }, [chunks, currentPage]);

  // 最初のレイアウト計算完了時に isReady を true にする
  useEffect(() => {
    if (pageCount > 1 && fullHtmlContentRef.current && !isReady) {
      setIsReady(true);
    }
  }, [pageCount, isReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      calcLayout();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [calcLayout]);

  const handlePrevPage = useCallback(() => {
    showControls();
    if (currentPage <= 0) {
      return;
    }

    const nextPage = currentPage - 1;
    setCurrentPage(nextPage);
    void updateReadingPositionUseCase(
      clientWorkLibraryRepository,
      identifier,
      nextPage,
      pageCount
    );
  }, [currentPage, identifier, pageCount, showControls]);

  const handleNextPage = useCallback(() => {
    showControls();
    if (currentPage >= pageCount - 1) {
      return;
    }

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    void updateReadingPositionUseCase(
      clientWorkLibraryRepository,
      identifier,
      nextPage,
      pageCount
    );
  }, [currentPage, identifier, pageCount, showControls]);

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
    pageCount,
    contentAreaWidth,
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
