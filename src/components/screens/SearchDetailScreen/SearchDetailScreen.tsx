"use client";

import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { AppToolbar } from "@/components/ui/AppToolbar";
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
      {/* 背景画像 */}
      <Box
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

      {/* ツールバー */}
      <AppToolbar
        rightSlot={
          <Button
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={handleClose}
            p="0"
            aria-label="TOPに戻る"
          >
            <X size={20} />
          </Button>
        }
      />

      {/* コンテンツエリア */}
      <Flex
        direction="column"
        align="stretch"
        gap="6"
        p="6"
        w="full"
        position="relative"
        zIndex={1}
      >
        {/* BACKボタン */}
        <Button
          variant="solid"
          size="md"
          bg="gray.900"
          color="fg.inverted"
          h="10"
          px="4"
          onClick={handleBack}
          alignSelf="flex-start"
          fontSize="xs"
          aria-label="検索結果に戻る"
        >
          <ArrowLeft size={16} />
          BACK
        </Button>

        {/* 作品詳細カード */}
        <Box className="detail-card-fadein">
          <WorkDetailCard work={work} onDownload={handleDownload} />
        </Box>
      </Flex>
    </Box>
  );
}


