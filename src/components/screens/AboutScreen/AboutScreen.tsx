"use client";

import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppFooter } from "@/components/ui/AppFooter";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";

/**
 * ABOUT画面のコンポーネント
 */
export function AboutScreen() {
  const router = useRouter();

  return (
    <Box as="main" minH="100svh" position="relative">
      <AppToolbar
        rightSlot={<ToolbarCloseButton onClick={() => router.push("/")} />}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="6"
        p="6"
      >
        <Image
          src="/images/about-hero.svg"
          alt="BOOK SKY, BLUE BLUE"
          width={172}
          height={170}
          priority={false}
        />

        <Box
          as="section"
          aria-labelledby="about-heading"
          w="full"
          px="4.5"
          py="4"
          display="flex"
          flexDirection="column"
          gap="6"
        >
          <Text
            id="about-heading"
            as="h1"
            fontFamily="body"
            fontSize="sm"
            fontWeight="800"
            lineHeight="5"
            textAlign="center"
            color="fg"
            whiteSpace="pre-line"
          >
            {"BOOK SKY, BLUE BLUEは、\n青空文庫ビューアの\nWEBアプリです。"}
          </Text>

          <Text
            fontFamily="body"
            fontSize="10px"
            fontWeight="600"
            lineHeight="14px"
            color="fg"
            whiteSpace="pre-line"
          >
            {
              "青空文庫の本を検索、ダウンロード、\n閲覧するためのWebアプリケーションです。\nブラウザベースですが、ホームに追加することでスマートフォンのアプリのように利用できます。\n\n文庫データはブラウザの中（indexedDB）に保存する仕組みのため、端末変更やキャッシュクリアなどを行うと削除される可能性がありますのでご注意ください。"
            }
          </Text>
        </Box>

        <AppFooter />
      </Box>
    </Box>
  );
}
