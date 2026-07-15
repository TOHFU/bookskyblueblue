"use client";

import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type AppToolbarProps = {
  /** 左スロット（任意） */
  leftSlot?: ReactNode;
  /** 右スロット（任意） */
  rightSlot?: ReactNode;
};

/**
 * アプリ共通ツールバーコンポーネント
 * 各画面の上部に配置するヘッダー。左右にボタンスロットを持つ。
 */
export function AppToolbar({ leftSlot, rightSlot }: AppToolbarProps) {
  return (
    <Flex
      as="header"
      aria-label="ツールバー"
      direction="row"
      justify="space-between"
      align="center"
      w="full"
      h="11"
      position="relative"
      zIndex={1}
    >
      <Flex align="center" minW="11">
        {leftSlot ?? null}
      </Flex>
      <Flex align="center" minW="11" justify="flex-end">
        {rightSlot ?? null}
      </Flex>
    </Flex>
  );
}
