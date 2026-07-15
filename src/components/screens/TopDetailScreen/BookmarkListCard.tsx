"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Bookmark } from "lucide-react";
import type { Bookmark as BookmarkEntity } from "@/domain/entities/work";

type BookmarkListCardProps = {
  bookmark: BookmarkEntity;
  onClick: (page: number) => void;
};

export function BookmarkListCard({ bookmark, onClick }: BookmarkListCardProps) {
  return (
    <Flex
      as="button"
      direction="row"
      gap="4.5"
      p="6"
      w="full"
      bg="bg"
      borderWidth="2px"
      borderColor="border"
      align="flex-start"
      cursor="pointer"
      textAlign="left"
      onClick={() => onClick(bookmark.page)}
      aria-label={`${bookmark.page + 1}ページのブックマークを開く`}
    >
      <Box color="fg" mt="0.5" aria-hidden="true">
        <Bookmark size={24} fill="currentColor" />
      </Box>

      <Flex direction="column" gap="2.5" flex="1" minW="0">
        <Text fontSize="2xs" fontWeight="600" lineHeight="4" color="fg">
          {bookmark.page + 1}ページ
        </Text>

        <Text
          fontSize="xs"
          fontWeight="600"
          lineHeight="5"
          color="fg"
          display="-webkit-box"
          overflow="hidden"
          style={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}
        >
          {bookmark.excerpt}
        </Text>
      </Flex>
    </Flex>
  );
}