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
      direction="row"
      justify="space-between"
      align="center"
      w="full"
      h="11"
      position="relative"
      zIndex={1}
    >
      {/* 左スロット（なければ空のスペーサー） */}
      <Flex align="center">{leftSlot ?? <span />}</Flex>

      {/* 右スロット */}
      <Flex align="center">{rightSlot}</Flex>
    </Flex>
  );
}
