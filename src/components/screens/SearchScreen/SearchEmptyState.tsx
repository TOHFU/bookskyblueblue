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
      gap="4"
      px="4"
      py="6"
      bg="bg"
      borderWidth="2px"
      borderColor="border"
      w="full"
    >
      <Box color="blue.800">
        <SearchX size={32} strokeWidth={1.5} />
      </Box>

      <Text
        fontSize="sm"
        fontWeight="800"
        lineHeight="6"
        color="fg"
        textAlign="center"
        w="full"
      >
        該当する作品がありません
      </Text>

      <Text
        fontSize="xs"
        fontWeight="600"
        lineHeight="5"
        color="fg.muted"
        textAlign="center"
        w="full"
      >
        別のキーワードで検索してください
      </Text>

      {/* サンプル検索条件 */}
      <Box w="214px">
        <Flex direction="column" gap="1">
          {SAMPLE_QUERIES.map((sample) => (
            <Text
              key={sample}
              as="button"
              fontSize="xs"
              fontWeight="600"
              lineHeight="5"
              color="fg"
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
