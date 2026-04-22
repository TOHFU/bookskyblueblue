"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { SearchX } from "lucide-react";

const SAMPLE_QUERIES = ["夏目漱石", "檸檬"];

type SearchEmptyStateProps = {
  query: string;
  onSampleClick: (sample: string) => void;
};

/**
 * 検索結果が0件の場合に表示するEmptyState
 */
export function SearchEmptyState({ query, onSampleClick }: SearchEmptyStateProps) {
  return (
    <Flex
      direction="column"
      align="center"
      gap="16px"
      px="16px"
      py="24px"
      bg="#16AEFA"
      borderWidth="1px"
      borderColor="#27272A"
      w="full"
    >
      <Box color="#03608F">
        <SearchX size={32} strokeWidth={1.5} />
      </Box>

      <Text
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="16px"
        fontWeight="800"
        lineHeight="24px"
        color="#012639"
        textAlign="center"
        w="full"
      >
        該当する作品がありません
      </Text>

      <Text
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="14px"
        fontWeight="600"
        lineHeight="20px"
        color="#134152"
        textAlign="center"
        w="full"
      >
        別のキーワードで検索してください
      </Text>

      {/* サンプル検索条件 */}
      <Box w="214px">
        <Flex direction="column" gap="4px">
          {SAMPLE_QUERIES.map((sample) => (
            <Text
              key={sample}
              as="button"
              fontFamily="'Noto Sans JP', sans-serif"
              fontSize="14px"
              fontWeight="600"
              lineHeight="20px"
              color="#012639"
              textDecoration="underline"
              textAlign="left"
              cursor="pointer"
              onClick={() => onSampleClick(sample)}
              aria-label={`${sample}で検索`}
            >
              {"  - "}{sample}
            </Text>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}
