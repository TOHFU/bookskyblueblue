"use client";

import { Box, Text } from "@chakra-ui/react";

type StatusMessageProps = {
  children: string;
};

/**
 * カード枠付きの状態メッセージ（読み込み中・未発見など）
 */
export function StatusMessage({ children }: StatusMessageProps) {
  return (
    <Box
      as="section"
      role="status"
      aria-live="polite"
      bg="bg"
      borderWidth="2px"
      borderColor="border"
      p="6"
    >
      <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg">
        {children}
      </Text>
    </Box>
  );
}
