"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { getProgressLabel } from "@/components/ui/BookCard/getProgressLabel";
import { WorkMetaBadges } from "@/components/ui/WorkMetaBadges";
import type { Work } from "@/domain/entities/work";

type TopDetailCardProps = {
  work: Work;
  readingPage: number;
  totalPages: number;
  onRead: () => void;
};

export function TopDetailCard({
  work,
  readingPage,
  totalPages,
  onRead,
}: TopDetailCardProps) {
  const title = work.title ?? "無題";

  return (
    <Box
      as="article"
      aria-label={`作品詳細: ${title}`}
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

        <WorkMetaBadges
          writingStyle={work.writingStyle}
          publisher={work.publisher}
        />

        {work.sourceBookName && (
          <Text
            fontSize="xs"
            fontWeight="600"
            lineHeight="5"
            color="fg"
            maxW="227px"
          >
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
