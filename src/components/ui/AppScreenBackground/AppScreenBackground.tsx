"use client";

import { Box } from "@chakra-ui/react";

/**
 * 複数画面で共有する全画面背景（乗算ブレンド）
 */
export function AppScreenBackground() {
  return (
    <Box
      aria-hidden="true"
      position="fixed"
      top={0}
      left={0}
      w="full"
      h="100svh"
      backgroundImage="url('/images/top-background.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      style={{ mixBlendMode: "multiply" }}
      zIndex={0}
      pointerEvents="none"
    />
  );
}
