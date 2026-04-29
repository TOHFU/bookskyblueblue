"use client";

import { useState } from "react";
import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { BookCardActionButtons } from "./BookCardActionButtons";
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

  /** 進行ページ数の表示ラベルを返す */
  function getProgressLabel(page: number, total: number): string {
    if (page <= 0) return "未読";
    if (total > 0 && page >= total - 1) return "読了";
    return `${page + 1}ページ`;
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
      aria-label={`作品: ${work.title}`}
      transform={isPressed ? "translate(4px, 4px)" : "translate(0, 0)"}
      transition="transform 0.12s ease-out"
      onClick={onDetail ? () => onDetail(work) : undefined}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      cursor={onDetail ? "pointer" : undefined}
    >
      {/* 本文情報エリア */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="2.5"
        p="6"
        flex="1"
      >
        {/* 作品名 */}
        <Text
          fontSize="md"
          fontWeight="400"
          lineHeight="7"
          color="fg"
        >
          {work.title}
        </Text>

        {/* 著者名 */}
        {work.author && (
          <Text
            fontSize="xs"
            fontWeight="600"
            lineHeight="5"
            color="fg"
            w="full"
          >
            {work.author}
          </Text>
        )}

        {/* 底本初版発行年 */}
        {work.firstPublishedYear && (
          <Text
            fontSize="xs"
            fontWeight="600"
            lineHeight="5"
            color="fg"
            w="full"
          >
            {work.firstPublishedYear}
          </Text>
        )}

        {/* バッジエリア（文字遣い種別・出版社） */}
        <Flex
          direction="row"
          justify="flex-start"
          align="center"
          gap="2"
          h="10"
        >
          {work.writingStyle && (
            <Badge
              fontSize="2xs"
              fontWeight="600"
              lineHeight="16px"
              color="gray.800"
              borderColor="border"
              borderWidth="2px"
              bg="transparent"
              boxShadow="none"
              px="1.5"
              h="5"
              display="flex"
              alignItems="center"
            >
              {work.writingStyle.length > 6 ? work.writingStyle.slice(0, 6) + "…" : work.writingStyle}
            </Badge>
          )}
          {work.publisher && (
            <Badge
              fontSize="2xs"
              fontWeight="600"
              lineHeight="16px"
              color="gray.800"
              borderColor="border"
              borderWidth="2px"
              bg="transparent"
              boxShadow="none"
              px="1.5"
              h="5"
              display="flex"
              alignItems="center"
            >
              {work.publisher.length > 6 ? work.publisher.slice(0, 6) + "…" : work.publisher}
            </Badge>
          )}
        </Flex>

        {/* 進行ページ数 */}
        {readingPage !== undefined && (
          <Text
            fontSize="2xs"
            fontWeight="600"
            lineHeight="4"
            color="fg"
            w="full"
          >
            {getProgressLabel(readingPage, totalPages ?? 0)}
          </Text>
        )}
      </Box>

      {/* アクションボタンエリア */}
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
