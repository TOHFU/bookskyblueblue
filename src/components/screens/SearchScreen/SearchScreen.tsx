"use client";

import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { X, Search, RotateCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookCard } from "@/components/ui/BookCard";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { SearchEmptyState } from "./SearchEmptyState";
import type { Work } from "@/domain/entities/work";

const PAGE_SIZE = 10;

/** ビューポートに入ったタイミングでフェードインするラッパー */
function FadeInBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      className={isVisible ? "search-card-fadein" : undefined}
      style={{ opacity: isVisible ? undefined : 0 }}
    >
      {children}
    </Box>
  );
}

/**
 * SEARCH画面のコンポーネント
 * 作品のインクリメンタルサーチとカード一覧を提供する
 */
export function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Work[]>([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 無限スクロール用の番兵要素
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: searchQuery });
      const response = await fetch(`/api/works?${params.toString()}`);
      if (!response.ok) throw new Error("検索に失敗しました");
      const data = (await response.json()) as Work[];
      setResults(data);
      setDisplayedCount(PAGE_SIZE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchResults]);

  // 番兵要素が画面に入ったら次のページを読み込む
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [results]);

  const handleDetailClick = (work: Work) => {
    if (work.id) {
      router.push(`/search/detail/${work.id}`);
    }
  };

  const handleSampleQuery = (sample: string) => {
    setQuery(sample);
  };

  const displayedWorks = results.slice(0, displayedCount);
  const hasMore = displayedCount < results.length;

  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      {/* 背景画像 */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        style={{ mixBlendMode: "multiply" }}
        pointerEvents="none"
        aria-hidden="true"
        zIndex={0}
      />

      {/* ツールバー */}
      <AppToolbar
        rightSlot={
          <IconButton
            aria-label="TOPに戻る"
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={() => router.push("/")}
          >
            <X size={20} />
          </IconButton>
        }
      />

      {/* コンテンツエリア */}
      <Flex direction="column" align="stretch" gap="6" p="6" w="full" position="relative" zIndex={1}>
        {/* 検索入力 */}
        <Box position="relative">
          <Box
            position="absolute"
            left="5"
            top="50%"
            transform="translateY(-50%)"
            color="blue.800"
            opacity={0.7}
            zIndex={1}
            pointerEvents="none"
          >
            <Search size={16} />
          </Box>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="作品名・作者名"
            bg="bg"
            borderWidth="2px"
            borderColor="border"
            color="fg"
            h="12"
            pl="11"
            pr="5"
            fontSize="md"
            fontWeight="600"
            _placeholder={{ color: "blue.800", opacity: 0.7 }}
            aria-label="作品を検索"
          />
        </Box>

        {/* 検索結果 */}
        {!isLoading && results.length === 0 && query.length > 0 ? (
          <SearchEmptyState
            query={query}
            onSampleClick={handleSampleQuery}
          />
        ) : (
          <>
            {displayedWorks.map((work) => (
              <FadeInBox key={work.id}>
                <BookCard
                  work={work}
                  showDeleteButton={false}
                  showDetailButton
                  onDetail={handleDetailClick}
                />
              </FadeInBox>
            ))}

            {/* 無限スクロール用番兵 + ローディングアイコン */}
            {hasMore && (
              <Flex ref={sentinelRef} justify="center" py="4">
                <Box as="span" className="search-loading-icon" color="fg">
                  <RotateCw size={24} />
                </Box>
              </Flex>
            )}
          </>
        )}

        {/* ローディングインジケータ */}
        {isLoading && (
          <Flex justify="center" py="4">
            <Box as="span" className="search-loading-icon" color="fg">
              <RotateCw size={24} />
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
