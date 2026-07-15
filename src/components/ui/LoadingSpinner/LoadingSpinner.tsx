"use client";

import { Box, Flex } from "@chakra-ui/react";
import { RotateCw } from "lucide-react";

type LoadingSpinnerProps = {
  label?: string;
};

/**
 * 検索・一覧などで使う読み込みインジケータ
 */
export function LoadingSpinner({
  label = "読み込み中",
}: LoadingSpinnerProps) {
  return (
    <Flex justify="center" py="4" role="status" aria-live="polite" aria-label={label}>
      <Box as="span" className="search-loading-icon" color="fg" aria-hidden="true">
        <RotateCw size={24} />
      </Box>
    </Flex>
  );
}
