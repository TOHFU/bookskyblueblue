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
      gap="24px"
      p="24px 16px"
      bg="bg"
      borderWidth="1px"
      borderColor="gray.800"
      w="full"
    >
      <Box color="fg">
        <Book size={32} strokeWidth={1.5} />
      </Box>

      <Text
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="16px"
        fontWeight="800"
        lineHeight="24px"
        color="fg"
        textAlign="center"
        w="full"
      >
        作品を追加してみましょう
      </Text>

      <Text
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="14px"
        fontWeight="600"
        lineHeight="20px"
        color="fg.muted"
        textAlign="center"
        w="full"
      >
        お気に入りの作品を探してください
      </Text>

      <Button
        variant="solid"
        bg="gray.900"
        color="white"
        h="36px"
        px="14px"
        gap="8px"
        onClick={onSearchClick}
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="14px"
        fontWeight="700"
        aria-label="作品を検索する"
      >
        <Search size={16} />
        作品を検索
      </Button>
    </Flex>
  );
}
