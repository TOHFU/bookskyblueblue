"use client";

import { Button } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  "aria-label": string;
  onClick: () => void;
};

/**
 * 詳細画面などで使う BACK ボタン
 */
export function BackButton({
  "aria-label": ariaLabel,
  onClick,
}: BackButtonProps) {
  return (
    <Button
      variant="solid"
      size="md"
      bg="gray.900"
      color="fg.inverted"
      h="10"
      px="4"
      onClick={onClick}
      alignSelf="flex-start"
      fontSize="xs"
      aria-label={ariaLabel}
    >
      <ArrowLeft size={16} />
      BACK
    </Button>
  );
}
