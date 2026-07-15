"use client";

import { X } from "lucide-react";
import { ToolbarIconButton } from "@/components/ui/ToolbarIconButton";

type ToolbarCloseButtonProps = {
  onClick: () => void;
};

/**
 * ツールバー右上の「TOPに戻る」閉じるボタン
 */
export function ToolbarCloseButton({ onClick }: ToolbarCloseButtonProps) {
  return (
    <ToolbarIconButton aria-label="TOPに戻る" onClick={onClick}>
      <X size={20} />
    </ToolbarIconButton>
  );
}
