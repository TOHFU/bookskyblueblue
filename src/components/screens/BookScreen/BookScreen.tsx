"use client";

import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useBookScreen } from "@/hooks/screens/useBookScreen";
import { BookFloatingControls } from "./BookFloatingControls";

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
    pageCount,
    contentAreaWidth,
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
      aria-label="作品本文"
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
        style={{ contain: "layout" }}
      >
        {!isReady && (
          <Flex
            w="full"
            h="full"
            align="center"
            justify="center"
            position="absolute"
            top="0"
            left="0"
            role="status"
            aria-live="polite"
          >
            <Box as="span" className="search-loading-icon" color="fg">
              <Image
                src="/icons/rotate-cw.svg"
                alt="読み込み中"
                width={24}
                height={24}
              />
            </Box>
          </Flex>
        )}

        {htmlContent !== null && (
          <Box
            ref={innerRef}
            className={
              isReady ? "book-content book-content-fadein" : "book-content"
            }
            position="absolute"
            right="0"
            top="0"
            h="full"
            aria-hidden={!isReady}
            style={{
              opacity: isReady ? undefined : 0,
              transform: `translate3d(${currentPage * contentAreaWidth}px, 0, 0)`,
              transition: isReady ? "transform 0.3s ease" : "none",
              willChange: isReady ? "transform" : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </Box>

      <Text
        position="absolute"
        bottom="2em"
        {...(isOddPageNumber ? { right: "2em" } : { left: "2em" })}
        fontFamily="'Noto Serif JP', serif"
        fontSize="sm"
        fontWeight="700"
        lineHeight="18px"
        color="fg"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentPage + 1}
      </Text>

      {/* タップ用ゾーンは装飾的なショートカット。キーボード操作はナビボタンを使う */}
      <Box
        aria-hidden="true"
        position="absolute"
        top="0"
        right="0"
        w="50%"
        bottom={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={handlePrevPage}
        cursor="pointer"
      />
      <Box
        aria-hidden="true"
        position="absolute"
        top="0"
        left="0"
        w="50%"
        bottom={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={handleNextPage}
        cursor="pointer"
      />
      <Box
        aria-hidden="true"
        position="absolute"
        bottom="0"
        left="0"
        w="full"
        h={`${FLOATING_CONTROL_HEIGHT}px`}
        zIndex={1}
        onClick={showControls}
      />

      <BookFloatingControls
        visible={controlsVisible}
        currentPage={currentPage}
        pageCount={pageCount}
        isCurrentPageBookmarked={isCurrentPageBookmarked}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onToggleBookmark={handleToggleBookmark}
        onClose={handleClose}
      />
    </Box>
  );
}
