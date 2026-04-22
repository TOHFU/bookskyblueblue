"use client";

import { getSavedWork } from "@/data/repositories/savedWorkRepository";
import type { Work } from "@/domain/entities/work";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BookReaderScreenProps = {
  identifier: string;
  initialWork: Work | null;
};

const PAGE_CHUNK = 900;

export function BookReaderScreen({ identifier, initialWork }: BookReaderScreenProps) {
  const [work, setWork] = useState<Work | null>(initialWork);
  const [pageIndex, setPageIndex] = useState(() => readSavedPage(identifier));
  const [controlsVisible, setControlsVisible] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const pages = useMemo(() => {
    const content = work?.content?.trim() || "本文がありません。";
    const result: string[] = [];

    for (let index = 0; index < content.length; index += PAGE_CHUNK) {
      result.push(content.slice(index, index + PAGE_CHUNK));
    }

    return result.length > 0 ? result : ["本文がありません。"];
  }, [work?.content]);

  useEffect(() => {
    void getSavedWork(identifier).then((saved) => {
      if (saved) {
        setWork(saved);
      }
    });
  }, [identifier]);

  useEffect(() => {
    window.localStorage.setItem(getPositionKey(identifier), String(pageIndex));
  }, [identifier, pageIndex]);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const maxPage = Math.max(0, pages.length - 1);
  const safePage = Math.min(pageIndex, maxPage);
  const pageNumber = safePage + 1;
  const pageType = pageNumber % 2 === 0 ? "BOOK-EVENPAGE" : "BOOK-ODDPAGE";

  function nextPage() {
    showControlsTemporarily();
    setPageIndex((current) => Math.min(maxPage, current + 1));
  }

  function previousPage() {
    showControlsTemporarily();
    setPageIndex((current) => Math.max(0, current - 1));
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    showControlsTemporarily();
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;

    if (start === null || typeof end !== "number") {
      return;
    }

    const diff = end - start;
    if (diff > 40) {
      previousPage();
    } else if (diff < -40) {
      nextPage();
    }
  }

  return (
    <VStack
      as="main"
      align="stretch"
      minH="100dvh"
      bg="bg.subtle"
      onMouseMove={showControlsTemporarily}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {controlsVisible ? (
        <HStack justify="space-between" p="3" bg="bg" color="fg.inverted" position="sticky" top="0" zIndex="10">
          <Text fontWeight="bold">{pageType}</Text>
          <Button asChild size="sm" variant="subtle">
            <Link href="/">Close</Link>
          </Button>
        </HStack>
      ) : null}

      <VStack flex="1" p={{ base: "4", md: "8" }} align="stretch" justify="center">
        <VStack
          minH={{ base: "60dvh", md: "70dvh" }}
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="card"
          bg="bg.panel"
          p={{ base: "3", md: "6" }}
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            lineHeight: 2,
          }}
        >
          <Text color="fg.inverted">{pages[safePage]}</Text>
        </VStack>
      </VStack>

      {controlsVisible ? (
        <HStack justify="space-between" p="3" bg="bg" color="fg.inverted" position="sticky" bottom="0" zIndex="10">
          <Button size="sm" variant="subtle" onClick={previousPage} disabled={safePage <= 0}>
            前へ
          </Button>
          <Text>
            {pageNumber} / {pages.length}
          </Text>
          <Button size="sm" variant="subtle" onClick={nextPage} disabled={safePage >= maxPage}>
            次へ
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
}

function getPositionKey(identifier: string): string {
  return `book-reading-position:${identifier}`;
}

function readSavedPage(identifier: string): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const savedPage = Number.parseInt(window.localStorage.getItem(getPositionKey(identifier)) ?? "0", 10);
  return Number.isFinite(savedPage) && savedPage >= 0 ? savedPage : 0;
}
