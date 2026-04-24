"use client";

import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import { BookDown } from "lucide-react";
import type { Work } from "@/domain/entities/work";

type WorkDetailCardProps = {
  work: Work;
  onDownload: (work: Work) => void;
};

/**
 * 作品詳細カードコンポーネント
 * SearchDetailScreen で利用する。作品の詳細情報とダウンロードボタンを表示する。
 */
export function WorkDetailCard({ work, onDownload }: WorkDetailCardProps) {
  return (
    <Box bg="bg" borderWidth="2px" borderColor="border" w="full">
      <Flex direction="column" justify="center" gap="2.5" p="6">
        {/* 作品ID */}
        {work.id && (
          <Text
            fontSize="3xs"
            fontWeight="600"
            lineHeight="3.5"
            color="fg"
          >
            {work.id}
          </Text>
        )}

        {/* 作品名 */}
        <Text
          fontSize="md"
          fontWeight="400"
          lineHeight="7"
          color="fg"
        >
          {work.title}
        </Text>

        {/* サブタイトル */}
        {work.subtitle && (
          <Text
            fontSize="2xs"
            fontWeight="600"
            lineHeight="4"
            color="fg"
            w="full"
          >
            {work.subtitle}
          </Text>
        )}

        {/* オリジナルタイトル */}
        {work.originalTitle && (
          <Text
            fontSize="2xs"
            fontWeight="600"
            lineHeight="4"
            color="fg"
            w="full"
          >
            {work.originalTitle}
          </Text>
        )}

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

        {/* バッジ（文字遣い種別・出版社） */}
        <Flex direction="row" align="center" gap="2" flexWrap="wrap">
          {work.writingStyle && (
            <Badge
              variant="outline"
              fontSize="2xs"
              fontWeight="600"
              color="gray.800"
              borderColor="border"
              borderWidth="2px"
              bg="transparent"
              boxShadow="none"
              px="1.5"
              h="5"
            >
              {work.writingStyle.length > 6
                ? work.writingStyle.slice(0, 6) + "…"
                : work.writingStyle}
            </Badge>
          )}
          {work.publisher && (
            <Badge
              variant="outline"
              fontSize="2xs"
              fontWeight="600"
              color="gray.800"
              borderColor="border"
              borderWidth="2px"
              bg="transparent"
              boxShadow="none"
              px="1.5"
              h="5"
            >
              {work.publisher.length > 6
                ? work.publisher.slice(0, 6) + "…"
                : work.publisher}
            </Badge>
          )}
        </Flex>

        {/* 底本名 */}
        {work.sourceBookName && (
          <Text
            fontSize="xs"
            fontWeight="400"
            lineHeight="5"
            color="fg"
            w="full"
          >
            {work.sourceBookName}
          </Text>
        )}
      </Flex>

      {/* カード内フッター（ダウンロードボタン） */}
      <Flex justify="center" pt="0" px="6" pb="6">
        <Button
          variant="solid"
          bg="fg"
          color="fg.inverted"
          h="13"
          px="6"
          w="full"
          onClick={() => onDownload(work)}
          fontSize="sm"
          aria-label="この作品をダウンロードする"
        >
          <BookDown size={20} />
          DOWNLOAD
        </Button>
      </Flex>
    </Box>
  );
}
