"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { getBookStateUseCase } from "@/application/usecases/getBookStateUseCase";
import { toggleBookmarkUseCase } from "@/application/usecases/toggleBookmarkUseCase";
import { updateReadingPositionUseCase } from "@/application/usecases/updateReadingPositionUseCase";
import { extractMainContent, extractPageExcerpt } from "@/components/screens/BookScreen/bookHtmlUtils";
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

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

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

      setHtmlContent(extractMainContent(state.content));
      setCurrentPage(initialPage);
      setBookmarks(state.bookmarks);
      setIsReady(true);
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
  }, []);

  useEffect(() => {
    if (!htmlContent) {
      return;
    }

    calcLayout();
  }, [htmlContent, calcLayout]);

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
