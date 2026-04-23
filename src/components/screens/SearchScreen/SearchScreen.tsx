"use client";

import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { X, Search, RotateCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookCard } from "@/components/ui/BookCard";
import { SearchEmptyState } from "./SearchEmptyState";
import type { Work } from "@/domain/entities/work";

const PAGE_SIZE = 10;

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
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        style={{ mixBlendMode: "multiply" }}
        pointerEvents="none"
        aria-hidden="true"
        zIndex={0}
      />

      {/* ツールバー */}
      <Flex
        as="header"
        direction="row"
        justify="flex-end"
        align="center"
        w="full"
        h="44px"
        position="relative"
        zIndex={1}
      >
        <IconButton
          aria-label="TOPに戻る"
          variant="solid"
          w="44px"
          h="44px"
          bg="gray.900"
          color="white"
          onClick={() => router.push("/")}
        >
          <X size={20} />
        </IconButton>
      </Flex>

      {/* コンテンツエリア */}
      <Flex direction="column" align="stretch" gap="24px" p="24px" w="full" position="relative" zIndex={1}>
        {/* 検索入力 */}
        <Box position="relative">
          <Box
            position="absolute"
            left="20px"
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
            borderWidth="1px"
            borderColor="border"
            color="fg"
            h="44px"
            pl="44px"
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="18px"
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
            {displayedWorks.map((work, index) => (
              <Box
                key={work.id}
                className="search-card-fadein"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <BookCard
                  work={work}
                  showDeleteButton={false}
                  showDetailButton
                  onDetail={handleDetailClick}
                />
              </Box>
            ))}

            {/* 無限スクロール用番兵 */}
            {hasMore && <Box ref={sentinelRef} h="1px" />}
          </>
        )}

        {/* ローディングインジケータ */}
        {isLoading && (
          <Flex justify="center" py="16px">
            <Box as="span" className="search-loading-icon" color="fg">
              <RotateCw size={24} />
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
