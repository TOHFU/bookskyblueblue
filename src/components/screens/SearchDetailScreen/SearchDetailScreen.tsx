"use client";

import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, BookDown } from "lucide-react";
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

  const handleDownload = () => {
    if (work.id) {
      router.push(`/download/${work.id}`);
    }
  };

  return (
    <Box as="main" minH="100svh" bg="#16AEFA" position="relative">
      {/* 背景画像 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        style={{ mixBlendMode: "multiply" }}
        zIndex={0}
        pointerEvents="none"
      />

      {/* ツールバー */}
      <Flex
        as="header"
        direction="row"
        justify="flex-end"
        align="center"
        w="full"
        h="44px"
        position="relative"
        zIndex={1}
      >
        <Button
          variant="solid"
          w="44px"
          h="44px"
          bg="#18181B"
          color="white"
          onClick={handleClose}
          p="0"
          aria-label="TOPに戻る"
        >
          <X size={20} />
        </Button>
      </Flex>

      {/* コンテンツエリア */}
      <Flex direction="column" align="stretch" gap="24px" p="24px" w="full" position="relative" zIndex={1}>
        {/* BACKボタン */}
        <Button
          variant="solid"
          size="md"
          bg="#18181B"
          color="white"
          h="40px"
          px="16px"
          onClick={handleBack}
          alignSelf="flex-start"
          fontFamily="'Noto Sans JP', sans-serif"
          fontSize="14px"
          aria-label="検索結果に戻る"
        >
          <ArrowLeft size={16} />
          BACK
        </Button>

        {/* 作品詳細カード */}
        <Box
          bg="#16AEFA"
          borderWidth="1px"
          borderColor="#012639"
          w="full"
        >
          <Flex
            direction="column"
            justify="center"
            gap="10px"
            p="24px"
          >
            {/* 作品ID */}
            {work.id && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="10px"
                fontWeight="600"
                lineHeight="14px"
                color="#012639"
              >
                {work.id}
              </Text>
            )}

            {/* 作品名 */}
            <Text
              fontFamily="'Noto Sans JP', sans-serif"
              fontSize="18px"
              fontWeight="400"
              lineHeight="28px"
              color="#012639"
            >
              {work.title}
            </Text>

            {/* サブタイトル */}
            {work.subtitle && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="12px"
                fontWeight="600"
                lineHeight="16px"
                color="#012639"
                w="full"
              >
                {work.subtitle}
              </Text>
            )}

            {/* オリジナルタイトル */}
            {work.originalTitle && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="12px"
                fontWeight="600"
                lineHeight="16px"
                color="#012639"
                w="full"
              >
                {work.originalTitle}
              </Text>
            )}

            {/* 著者名 */}
            {work.author && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="14px"
                fontWeight="600"
                lineHeight="20px"
                color="#012639"
                w="full"
              >
                {work.author}
              </Text>
            )}

            {/* 底本初版発行年 */}
            {work.firstPublishedYear && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="14px"
                fontWeight="600"
                lineHeight="20px"
                color="#012639"
                w="full"
              >
                {work.firstPublishedYear}
              </Text>
            )}

            {/* バッジ（文字遣い種別・出版社） */}
            <Flex direction="row" align="center" gap="8px" flexWrap="wrap">
              {work.writingStyle && (
                <Badge
                  variant="outline"
                  fontSize="12px"
                  fontWeight="600"
                  color="#27272A"
                  borderColor="#012639"
                  borderWidth="1px"
                  bg="transparent"
                  boxShadow="none"
                  px="6px"
                  h="20px"
                >
                  {work.writingStyle.length > 6 ? work.writingStyle.slice(0, 6) + "…" : work.writingStyle}
                </Badge>
              )}
              {work.publisher && (
                <Badge
                  variant="outline"
                  fontSize="12px"
                  fontWeight="600"
                  color="#27272A"
                  borderColor="#012639"
                  borderWidth="1px"
                  bg="transparent"
                  boxShadow="none"
                  px="6px"
                  h="20px"
                >
                  {work.publisher.length > 6 ? work.publisher.slice(0, 6) + "…" : work.publisher}
                </Badge>
              )}
            </Flex>

            {/* 底本名 */}
            {work.sourceBookName && (
              <Text
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                color="#012639"
                w="full"
              >
                {work.sourceBookName}
              </Text>
            )}
          </Flex>

          {/* カード内フッター（ダウンロードボタン） */}
          <Flex justify="center" p="0 24px 24px">
            <Button
              variant="solid"
              bg="#012639"
              color="white"
              h="52px"
              px="24px"
              w="full"
              onClick={handleDownload}
              fontFamily="'Noto Sans JP', sans-serif"
              fontSize="16px"
              aria-label="この作品をダウンロードする"
            >
              <BookDown size={20} />
              DOWNLOAD
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
