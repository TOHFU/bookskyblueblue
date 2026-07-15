"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { BookCardActionButtons } from "./BookCardActionButtons";
import { WorkMetaBadges } from "@/components/ui/WorkMetaBadges";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import type { Work } from "@/domain/entities/work";

type BookCardProps = {
  work: Work;
  /** 削除ボタンを表示するか */
  showDeleteButton?: boolean;
  /** 詳細ボタンを表示するか */
  showDetailButton?: boolean;
  /** 削除ボタンクリック時のハンドラ */
  onDelete?: (work: Work) => void;
  /** 詳細ボタンクリック時のハンドラ */
  onDetail?: (work: Work) => void;
  /** 現在の閲覧ページ（0始まりのインデックス） */
  readingPage?: number;
  /** 作品の総ページ数 */
  totalPages?: number;
};

/** 進行ページ数の表示ラベルを返す */
export function getProgressLabel(page: number, total: number): string {
  if (page <= 0) return "未読";
  if (total > 0 && page >= total - 1) return "読了";
  return `${page + 1}ページ`;
}

export function BookCard({
  work,
  showDeleteButton = false,
  showDetailButton = true,
  onDelete,
  onDetail,
  readingPage,
  totalPages,
}: BookCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const triggerHapticFeedback = useHapticFeedback({
    duration: 10,
    mobileOnly: true,
  });
  const isInteractive = Boolean(onDetail);

  function openDetail() {
    if (!onDetail) {
      return;
    }

    triggerHapticFeedback();
    onDetail(work);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!isInteractive) {
      return;
    }

    if (event.key === "Enter") {
      openDetail();
      return;
    }

    // Space は keyup で発火させる（ネイティブ button と同挙動）
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLElement>) {
    if (isInteractive && event.key === " ") {
      event.preventDefault();
      openDetail();
    }
  }

  return (
    <Flex
      as="article"
      direction="row"
      align="stretch"
      gap="5"
      w="full"
      bg="bg"
      borderWidth="2px"
      borderColor="border"
      aria-label={`作品: ${work.title ?? "無題"}`}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? openDetail : undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      cursor={isInteractive ? "pointer" : undefined}
      transform={isPressed ? "translate(2px, 2px)" : "translate(0, 0)"}
      transition="transform 0.06s ease-out"
      _focusVisible={{
        outline: "3px solid",
        outlineColor: "fg",
        outlineOffset: "2px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="2.5"
        p="6"
        flex="1"
      >
        <Text fontSize="md" fontWeight="600" lineHeight="7" color="fg">
          {work.title}
        </Text>

        {work.author && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg" w="full">
            {work.author}
          </Text>
        )}

        {work.firstPublishedYear && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg" w="full">
            {work.firstPublishedYear}
          </Text>
        )}

        <WorkMetaBadges
          writingStyle={work.writingStyle}
          publisher={work.publisher}
        />

        {readingPage !== undefined && (
          <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg" w="full">
            {getProgressLabel(readingPage, totalPages ?? 0)}
          </Text>
        )}
      </Box>

      <BookCardActionButtons
        work={work}
        showDeleteButton={showDeleteButton}
        showDetailButton={showDetailButton}
        onDelete={onDelete}
        onDetail={onDetail}
      />
    </Flex>
  );
}
