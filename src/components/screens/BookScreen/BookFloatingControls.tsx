"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";

type BookFloatingControlsProps = {
  visible: boolean;
  currentPage: number;
  pageCount: number;
  isCurrentPageBookmarked: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
};

/**
 * 読書画面下部のフローティング操作バー
 */
export function BookFloatingControls({
  visible,
  currentPage,
  pageCount,
  isCurrentPageBookmarked,
  onPrevPage,
  onNextPage,
  onToggleBookmark,
  onClose,
}: BookFloatingControlsProps) {
  return (
    <Box
      as="nav"
      aria-label="読書操作"
      position="absolute"
      bottom="0"
      left="50%"
      transform="translateX(-50%)"
      opacity={visible ? 1 : 0}
      transition="opacity 0.5s ease"
      pointerEvents={visible ? "auto" : "none"}
      zIndex={2}
    >
      <Flex direction="row" align="center">
        <IconButton
          aria-label="次のページ"
          variant="solid"
          bg="gray.900"
          color="fg.inverted"
          w="11"
          h="11"
          onClick={onNextPage}
          disabled={currentPage >= pageCount - 1}
        >
          <ChevronLeft size={20} />
        </IconButton>

        <ToolbarCloseButton onClick={onClose} />

        <IconButton
          aria-label={
            isCurrentPageBookmarked
              ? "ブックマークを解除"
              : "ブックマークを追加"
          }
          aria-pressed={isCurrentPageBookmarked}
          variant="solid"
          bg={isCurrentPageBookmarked ? "fg" : "gray.900"}
          color="fg.inverted"
          w="11"
          h="11"
          onClick={onToggleBookmark}
        >
          <Bookmark
            size={20}
            fill={isCurrentPageBookmarked ? "currentColor" : "none"}
          />
        </IconButton>

        <IconButton
          aria-label="前のページ"
          variant="solid"
          bg="gray.900"
          color="fg.inverted"
          w="11"
          h="11"
          onClick={onPrevPage}
          disabled={currentPage <= 0}
        >
          <ChevronRight size={20} />
        </IconButton>
      </Flex>
    </Box>
  );
}
