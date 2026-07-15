"use client";

import { IconButton } from "@chakra-ui/react";
import { X } from "lucide-react";

type ToolbarCloseButtonProps = {
  onClick: () => void;
};

/**
 * ツールバー右上の「TOPに戻る」閉じるボタン
 */
export function ToolbarCloseButton({ onClick }: ToolbarCloseButtonProps) {
  return (
    <IconButton
      aria-label="TOPに戻る"
      variant="solid"
      w="11"
      h="11"
      bg="gray.900"
      color="fg.inverted"
      onClick={onClick}
    >
      <X size={20} />
    </IconButton>
  );
}
