"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { getBookStateUseCase } from "@/application/usecases/getBookStateUseCase";
import { toggleBookmarkUseCase } from "@/application/usecases/toggleBookmarkUseCase";
import { updateReadingPositionUseCase } from "@/application/usecases/updateReadingPositionUseCase";
import { extractMainContent, extractPageExcerpt, resolveBookInitialPage } from "@/components/screens/BookScreen/bookHtmlUtils";
import type { Bookmark } from "@/domain/entities/work";

const FADE_TIMEOUT_MS = 3000;
const FONT_SIZE_STORAGE_KEY = "book-font-size-px";
const FONT_SIZE_STEPS = [14, 16, 18, 20] as const;
type FontSizePx = (typeof FONT_SIZE_STEPS)[number];

function readStoredFontSize(): FontSizePx {
  if (typeof window === "undefined") {
    return 16;
  }
  const raw = Number(localStorage.getItem(FONT_SIZE_STORAGE_KEY));
  return (FONT_SIZE_STEPS.find((step) => step === raw) ?? 16) as FontSizePx;
}

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
  const [fontSizePx, setFontSizePx] = useState<FontSizePx>(16);

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const skipReadingPositionSaveRef = useRef(true);
  const pageCountRef = useRef(pageCount);
  pageCountRef.current = pageCount;

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
    setFontSizePx(readStoredFontSize());
  }, []);

  useEffect(() => {
    skipReadingPositionSaveRef.current = true;

    const loadWork = async () => {
      const state = await getBookStateUseCase(clientWorkLibraryRepository, identifier);
      if (!state.content) {
        setHtmlContent("");
        setIsReady(true);
        return;
      }

      const initialPage = resolveBookInitialPage(searchParams.get("page"), state.page);

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
  }, [htmlContent, fontSizePx, calcLayout]);

  const handleDecreaseFontSize = useCallback(() => {
    showControls();
    setFontSizePx((current) => {
      const index = FONT_SIZE_STEPS.indexOf(current);
      const next = FONT_SIZE_STEPS[Math.max(0, index - 1)] ?? current;
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      return next;
    });
  }, [showControls]);

  const handleIncreaseFontSize = useCallback(() => {
    showControls();
    setFontSizePx((current) => {
      const index = FONT_SIZE_STEPS.indexOf(current);
      const next =
        FONT_SIZE_STEPS[Math.min(FONT_SIZE_STEPS.length - 1, index + 1)] ??
        current;
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      return next;
    });
  }, [showControls]);

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

  useEffect(() => {
    if (!isReady || htmlContent === null) {
      return;
    }

    if (skipReadingPositionSaveRef.current) {
      skipReadingPositionSaveRef.current = false;
      return;
    }

    void updateReadingPositionUseCase(
      clientWorkLibraryRepository,
      identifier,
      currentPage,
      pageCountRef.current
    );
  }, [currentPage, identifier, isReady, htmlContent]);

  const handlePrevPage = useCallback(() => {
    showControls();
    if (currentPage <= 0) {
      return;
    }

    const nextPage = currentPage - 1;
    setCurrentPage(nextPage);
  }, [currentPage, showControls]);

  const handleNextPage = useCallback(() => {
    showControls();
    if (currentPage >= pageCount - 1) {
      return;
    }

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  }, [currentPage, pageCount, showControls]);

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
    fontSizePx,
    canDecreaseFontSize: fontSizePx > FONT_SIZE_STEPS[0],
    canIncreaseFontSize:
      fontSizePx < FONT_SIZE_STEPS[FONT_SIZE_STEPS.length - 1],
    bookmarks,
    isCurrentPageBookmarked: bookmarks.some((bookmark) => bookmark.page === currentPage),
    isOddPageNumber: (currentPage + 1) % 2 !== 0,
    containerRef,
    contentAreaRef,
    innerRef,
    showControls,
    handlePrevPage,
    handleNextPage,
    handleDecreaseFontSize,
    handleIncreaseFontSize,
    handleToggleBookmark,
    handleClose,
  };
}
