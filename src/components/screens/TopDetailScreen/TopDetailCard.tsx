"use client";

import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import type { Work } from "@/domain/entities/work";

type TopDetailCardProps = {
  work: Work;
  readingPage: number;
  totalPages: number;
  onRead: () => void;
};

function getProgressLabel(page: number, totalPages: number): string {
  if (page <= 0) {
    return "未読";
  }

  if (totalPages > 0 && page >= totalPages - 1) {
    return "読了";
  }

  return `${page + 1}ページ`;
}

export function TopDetailCard({ work, readingPage, totalPages, onRead }: TopDetailCardProps) {
  return (
    <Box bg="bg" borderWidth="2px" borderColor="border" w="full">
      <Flex direction="column" justify="center" gap="2.5" p="6">
        {work.id && (
          <Text fontSize="3xs" fontWeight="600" lineHeight="3.5" color="fg">
            {work.id}
          </Text>
        )}

        <Text fontSize="md" fontWeight="600" lineHeight="7" color="fg">
          {work.title}
        </Text>

        {work.subtitle && (
          <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg">
            {work.subtitle}
          </Text>
        )}

        {work.originalTitle && (
          <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg">
            {work.originalTitle}
          </Text>
        )}

        {work.author && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg">
            {work.author}
          </Text>
        )}

        {work.firstPublishedYear && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg">
            {work.firstPublishedYear}
          </Text>
        )}

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
                ? `${work.writingStyle.slice(0, 6)}…`
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
              {work.publisher.length > 6 ? `${work.publisher.slice(0, 6)}…` : work.publisher}
            </Badge>
          )}
        </Flex>

        {work.sourceBookName && (
          <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg" maxW="227px">
            {work.sourceBookName}
          </Text>
        )}

        <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg">
          {getProgressLabel(readingPage, totalPages)}
        </Text>
      </Flex>

      <Flex justify="center" px="6" pb="6">
        <Button
          variant="solid"
          bg="gray.900"
          color="fg.inverted"
          h="11"
          px="5"
          w="full"
          onClick={onRead}
          fontSize="sm"
          aria-label="本文を読む"
        >
          READ
          <ArrowRight size={20} />
        </Button>
      </Flex>
    </Box>
  );
}