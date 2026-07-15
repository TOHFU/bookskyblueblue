"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BackButton } from "@/components/ui/BackButton";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { WorkDetailCard } from "@/components/ui/WorkDetailCard";
import type { Work } from "@/domain/entities/work";

type SearchDetailScreenProps = {
  work: Work;
};

/**
 * SEARCH DETAIL画面のコンポーネント
 * 作品の詳細情報とダウンロードボタンを表示する
 */
export function SearchDetailScreen({ work }: SearchDetailScreenProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleDownload = (target: Work) => {
    if (target.id) {
      router.push(`/download/${target.id}`);
    }
  };

  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />

      <AppToolbar
        rightSlot={<ToolbarCloseButton onClick={handleClose} />}
      />

      <Flex
        direction="column"
        align="stretch"
        gap="6"
        p="6"
        w="full"
        position="relative"
        zIndex={1}
      >
        <BackButton aria-label="検索結果に戻る" onClick={handleBack} />

        <Box className="detail-card-fadein">
          <WorkDetailCard work={work} onDownload={handleDownload} />
        </Box>
      </Flex>
    </Box>
  );
}
