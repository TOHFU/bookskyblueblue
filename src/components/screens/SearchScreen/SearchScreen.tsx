"use client";

import { Box, Flex, Input } from "@chakra-ui/react";
import { Search, RotateCw } from "lucide-react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BookCard } from "@/components/ui/BookCard";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { useIntersectionFadeIn } from "@/hooks/useIntersectionFadeIn";
import { useSearchScreen } from "@/hooks/screens/useSearchScreen";
import { SearchEmptyState } from "./SearchEmptyState";

/** ビューポートに入ったタイミングでフェードインするラッパー */
function FadeInBox({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useIntersectionFadeIn<HTMLDivElement>();

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
  const {
    query,
    results,
    displayedWorks,
    isLoading,
    hasMore,
    sentinelRef,
    handleQueryChange,
    handleSampleQuery,
    handleDetailClick,
    handleClose,
  } = useSearchScreen();

  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />

      <AppToolbar
        rightSlot={<ToolbarCloseButton onClick={handleClose} />}
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
            color="fg"
            opacity={0.7}
            zIndex={1}
            pointerEvents="none"
          >
            <Search size={16} />
          </Box>
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="作品名・作者名"
            bg="bg"
            borderWidth="2px"
            borderColor="border"
            color="fg"
            h="16"
            pl="11"
            pr="5"
            fontSize="lg"
            fontWeight="600"
            _placeholder={{ color: "fg", opacity: 0.7 }}
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
