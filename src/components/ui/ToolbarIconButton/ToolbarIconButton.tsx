"use client";

import { IconButton } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ToolbarIconButtonProps = {
  "aria-label": string;
  onClick: () => void;
  children: ReactNode;
};

/**
 * AppToolbar 左右スロット向けの共通アイコンボタン
 */
export function ToolbarIconButton({
  "aria-label": ariaLabel,
  onClick,
  children,
}: ToolbarIconButtonProps) {
  return (
    <IconButton
      aria-label={ariaLabel}
      variant="solid"
      w="11"
      h="11"
      bg="gray.900"
      color="fg.inverted"
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}
