"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { SearchX } from "lucide-react";

const SAMPLE_QUERIES = ["夏目漱石", "檸檬"] as const;

type SearchEmptyStateProps = {
  query: string;
  onSampleClick: (sample: string) => void;
};

/**
 * 検索結果が0件の場合に表示するEmptyState
 */
export function SearchEmptyState({
  query,
  onSampleClick,
}: SearchEmptyStateProps) {
  return (
    <Flex
      as="section"
      aria-labelledby="search-empty-heading"
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
      <Box color="fg" aria-hidden="true">
        <SearchX size={32} strokeWidth={1.5} />
      </Box>

      <Text
        id="search-empty-heading"
        as="h2"
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
        color="fg"
        textAlign="center"
        w="full"
      >
        「{query}」に一致する作品は見つかりませんでした。別のキーワードで検索してください
      </Text>

      <Box
        as="ul"
        role="list"
        listStyleType="none"
        m="0"
        p="0"
        w="214px"
        display="flex"
        flexDirection="column"
        gap="1"
      >
        {SAMPLE_QUERIES.map((sample) => (
          <Box as="li" key={sample}>
            <Button
              variant="plain"
              h="auto"
              minH="unset"
              p="0"
              fontSize="xs"
              fontWeight="600"
              lineHeight="5"
              color="fg"
              textDecoration="underline"
              justifyContent="flex-start"
              onClick={() => onSampleClick(sample)}
              aria-label={`${sample}で検索`}
            >
              ・{sample}
            </Button>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
