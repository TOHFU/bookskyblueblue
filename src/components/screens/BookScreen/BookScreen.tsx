"use client";

import Image from "next/image";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { Bookmark, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBookScreen } from "@/hooks/screens/useBookScreen";

type BookScreenProps = {
  identifier: string;
};

const FLOATING_CONTROL_HEIGHT = 44;

/**
 * BOOK画面のコンポーネント
 * 縦書きマルチカラムで作品を表示し、ページネーション機能を提供する
 */
export function BookScreen({ identifier }: BookScreenProps) {
  const {
    htmlContent,
    currentPage,
    localPage,
    pageCount,
    contentAreaWidth,
    isChunkTransitioning,
    controlsVisible,
    isReady,
    isCurrentPageBookmarked,
    isOddPageNumber,
    containerRef,
    contentAreaRef,
    innerRef,
    showControls,
    handlePrevPage,
    handleNextPage,
    handleToggleBookmark,
    handleClose,
  } = useBookScreen(identifier);

  return (
    <Box
      ref={containerRef}
      as="main"
      w="full"
      h="100svh"
      bg="bg"
      position="relative"
      overflow="hidden"
    >
      {/* 縦書きコンテンツエリア（padding内の領域）
          pageWidth確定後はビューポートを列幅の倍数に切り詰め、
          translateX のずれが左端に溢れないようにする */}
      <Box
        ref={contentAreaRef}
        position="absolute"
        top="2em"
        left="2em"
        right="2em"
        bottom="5em"
        overflow="hidden"
      >
        {/* ローディング中またはレイアウト計算中はローディングアイコンを表示 */}
        {!isReady && (
          <Flex
            w="full"
            h="full"
            align="center"
            justify="center"
            position="absolute"
            top="0"
            left="0"
          >
            <Box as="span" className="search-loading-icon" color="fg">
              <Image src="/icons/rotate-cw.svg" alt="ローディング" width={24} height={24} />
            </Box>
          </Flex>
        )}

        {/* コンテンツ: htmlContent設定後は常にDOMに存在させてcalcLayoutを機能させる */}
        {htmlContent !== null && (
          <Box
            ref={innerRef}
            className={isReady ? "book-content book-content-fadein" : "book-content"}
            position="absolute"
            right="0"
            top="0"
            h="full"
            style={{
              opacity: isReady ? undefined : 0,
              transform: `translateX(${localPage * contentAreaWidth}px)`,
              transition:
                isReady && !isChunkTransitioning ? "transform 0.3s ease" : "none",
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </Box>

      {/* ページ番号: 奇数ページ→右下、偶数ページ→左下 */}
      <Text
        position="absolute"
        bottom="2em"
        {...(isOddPageNumber ? { right: "2em" } : { left: "2em" })}
        fontFamily="'Noto Serif JP', serif"
        fontSize="sm"
        fontWeight="700"
        lineHeight="18px"
        color="fg"
      >
        {currentPage + 1}
      </Text>

      {/* クリックゾーン：右半分 → ページ-1（前のページ）*/}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="50%"
        bottom={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={handlePrevPage}
        cursor="pointer"
      />

      {/* クリックゾーン：左半分 → ページ+1（次のページ）*/}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="50%"
        bottom={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={handleNextPage}
        cursor="pointer"
      />

      {/* クリックゾーン：FloatingControlエリア → showControls */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="full"
        h={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={showControls}
      />

      {/* フローティングコントロール */}
      <Box
        position="absolute"
        bottom="0"
        left="50%"
        transform="translateX(-50%)"
        opacity={controlsVisible ? 1 : 0}
        transition="opacity 0.5s ease"
        pointerEvents={controlsVisible ? "auto" : "none"}
        zIndex={2}
      >
        <Flex direction="row" align="center">
          {/* 前のページへ（← → 次への方向なので left押下で+1） */}
          <IconButton
            aria-label="次のページ"
            variant="solid"
            bg="gray.900"
            color="fg.inverted"
            w="11"
            h="11"
            onClick={handleNextPage}
            disabled={currentPage >= pageCount - 1}
          >
            <ChevronLeft size={20} />
          </IconButton>

          {/* TOPに戻る */}
          <IconButton
            aria-label="TOPに戻る"
            variant="solid"
            bg="gray.900"
            color="fg.inverted"
            w="11"
            h="11"
            onClick={handleClose}
          >
            <X size={20} />
          </IconButton>

          <IconButton
            aria-label={isCurrentPageBookmarked ? "ブックマークを解除" : "ブックマークを追加"}
            variant="solid"
            bg={isCurrentPageBookmarked ? "fg" : "gray.900"}
            color="fg.inverted"
            w="11"
            h="11"
            onClick={handleToggleBookmark}
          >
            <Bookmark size={20} fill={isCurrentPageBookmarked ? "currentColor" : "none"} />
          </IconButton>

          {/* 右を押したら前のページ（縦書き本の進行方向） */}
          <IconButton
            aria-label="前のページ"
            variant="solid"
            bg="gray.900"
            color="fg.inverted"
            w="11"
            h="11"
            onClick={handlePrevPage}
            disabled={currentPage <= 0}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
}
