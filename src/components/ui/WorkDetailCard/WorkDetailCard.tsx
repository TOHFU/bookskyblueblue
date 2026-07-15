"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { BookDown } from "lucide-react";
import { WorkMetaBadges } from "@/components/ui/WorkMetaBadges";
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
    <Box
      as="article"
      aria-label={`作品詳細: ${work.title ?? "無題"}`}
      bg="bg"
      borderWidth="2px"
      borderColor="border"
      w="full"
    >
      <Flex direction="column" justify="center" gap="2.5" p="6">
        {work.id && (
          <Text fontSize="3xs" fontWeight="600" lineHeight="3.5" color="fg">
            {work.id}
          </Text>
        )}

        <Text as="h2" fontSize="md" fontWeight="600" lineHeight="7" color="fg">
          {work.title}
        </Text>

        {work.subtitle && (
          <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg" w="full">
            {work.subtitle}
          </Text>
        )}

        {work.originalTitle && (
          <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg" w="full">
            {work.originalTitle}
          </Text>
        )}

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

        {work.sourceBookName && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg" w="full">
            {work.sourceBookName}
          </Text>
        )}
      </Flex>

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
          aria-label={`${work.title ?? "この作品"}をダウンロードする`}
        >
          <BookDown size={20} />
          DOWNLOAD
        </Button>
      </Flex>
    </Box>
  );
}
