"use client";

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
};

export function BookCard({
  work,
  showDeleteButton = false,
  showDetailButton = true,
  onDelete,
  onDetail,
}: BookCardProps) {
  return (
    <Flex
      as="article"
      direction="row"
      align="stretch"
      gap="20px"
      w="full"
      bg="#16AEFA"
      borderWidth="1px"
      borderColor="#012639"
      aria-label={`作品: ${work.title}`}
      onClick={onDetail ? () => onDetail(work) : undefined}
      cursor={onDetail ? "pointer" : undefined}
    >
      {/* 本文情報エリア */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="10px"
        p="24px"
        flex="1"
      >
        {/* 作品名 */}
        <Text
          fontFamily="'Noto Sans JP', sans-serif"
          fontSize="18px"
          fontWeight="400"
          lineHeight="28px"
          color="#012639"
        >
          {work.title}
        </Text>

        {/* 著者名 */}
        {work.author && (
          <Text
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="14px"
            fontWeight="600"
            lineHeight="20px"
            color="#012639"
            w="full"
          >
            {work.author}
          </Text>
        )}

        {/* 底本初版発行年 */}
        {work.firstPublishedYear && (
          <Text
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="14px"
            fontWeight="600"
            lineHeight="20px"
            color="#012639"
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
          gap="8px"
          h="40px"
        >
          {work.writingStyle && (
            <Badge
              fontSize="12px"
              fontWeight="600"
              lineHeight="16px"
              color="#27272A"
              borderColor="#012639"
              borderWidth="1px"
              bg="transparent"
              boxShadow="none"
              px="6px"
              h="20px"
              display="flex"
              alignItems="center"
            >
              {work.writingStyle.length > 6 ? work.writingStyle.slice(0, 6) + "…" : work.writingStyle}
            </Badge>
          )}
          {work.publisher && (
            <Badge
              fontSize="12px"
              fontWeight="600"
              lineHeight="16px"
              color="#27272A"
              borderColor="#012639"
              borderWidth="1px"
              bg="transparent"
              boxShadow="none"
              px="6px"
              h="20px"
              display="flex"
              alignItems="center"
            >
              {work.publisher.length > 6 ? work.publisher.slice(0, 6) + "…" : work.publisher}
            </Badge>
          )}
        </Flex>
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
