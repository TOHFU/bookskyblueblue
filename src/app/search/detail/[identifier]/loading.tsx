"use client";

import { Box, Flex } from "@chakra-ui/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * 詳細ルートのセグメント読み込み中に即時フィードバックを出す
 */
export default function SearchDetailLoading() {
  return (
    <Box as="main" minH="100svh" bg="bg" p="6">
      <Flex justify="center" pt="24">
        <LoadingSpinner label="作品情報を読み込み中" />
      </Flex>
    </Box>
  );
}
