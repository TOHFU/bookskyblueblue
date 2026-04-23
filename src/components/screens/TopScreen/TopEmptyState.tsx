"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Book, Search } from "lucide-react";

type TopEmptyStateProps = {
  onSearchClick: () => void;
};

/**
 * 保存された作品が0件の場合に表示するEmptyState
 */
export function TopEmptyState({ onSearchClick }: TopEmptyStateProps) {
  return (
    <Flex
      direction="column"
      align="center"
      gap="6"
      p="6 4"
      bg="bg"
      borderWidth="1px"
      borderColor="border"
      w="full"
    >
      <Box color="fg">
        <Book size={32} strokeWidth={1.5} />
      </Box>

      <Text
        fontSize="sm"
        fontWeight="800"
        lineHeight="6"
        color="fg"
        textAlign="center"
        w="full"
      >
        作品を追加してみましょう
      </Text>

      <Text
        fontSize="xs"
        fontWeight="600"
        lineHeight="5"
        color="fg.muted"
        textAlign="center"
        w="full"
      >
        お気に入りの作品を探してください
      </Text>

      <Button
        variant="solid"
        bg="gray.900"
        color="fg.inverted"
        h="9"
        px="3.5"
        gap="2"
        onClick={onSearchClick}
        fontSize="xs"
        fontWeight="700"
        aria-label="作品を検索する"
      >
        <Search size={16} />
        作品を検索
      </Button>
    </Flex>
  );
}
