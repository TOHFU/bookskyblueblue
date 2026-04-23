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
      gap="5"
      w="full"
      bg="bg"
      borderWidth="1px"
      borderColor="border"
      aria-label={`作品: ${work.title}`}
      onClick={onDetail ? () => onDetail(work) : undefined}
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
              borderWidth="1px"
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
              borderWidth="1px"
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
