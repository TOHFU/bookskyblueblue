"use client";

import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useIntersectionFadeIn } from "@/hooks/useIntersectionFadeIn";

type FadeInBoxProps = {
  children: ReactNode;
  animationClassName?: string;
};

/**
 * ビューポート入場時にフェードインするラッパー
 */
export function FadeInBox({
  children,
  animationClassName = "search-card-fadein",
}: FadeInBoxProps) {
  const { ref, isVisible } = useIntersectionFadeIn<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      className={isVisible ? animationClassName : undefined}
      style={{ opacity: isVisible ? undefined : 0 }}
    >
      {children}
    </Box>
  );
}
