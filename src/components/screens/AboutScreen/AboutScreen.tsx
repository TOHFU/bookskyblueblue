"use client";

import { Box, IconButton, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AppToolbar } from "@/components/ui/AppToolbar";

/**
 * ABOUT画面のコンポーネント
 */
export function AboutScreen() {
  const router = useRouter();

  return (
    <Box as="main" minH="100svh" bg="#16AEFA" position="relative">
      <AppToolbar
        rightSlot={
          <IconButton
            aria-label="TOPに戻る"
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={() => router.push("/")}
          >
            <X size={20} />
          </IconButton>
        }
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
          w="full"
          px="4.5"
          py="4"
          display="flex"
          flexDirection="column"
          gap="6"
        >
          <Text
            fontFamily="body"
            fontSize="sm"
            fontWeight="800"
            lineHeight="5"
            textAlign="center"
            color="#27272A"
            whiteSpace="pre-line"
          >
            {"BOOK SKY, BLUE BLUEは、\n青空文庫ビューアの\nWEBアプリです。"}
          </Text>

          <Text
            fontFamily="body"
            fontSize="10px"
            fontWeight="600"
            lineHeight="14px"
            color="#27272A"
            whiteSpace="pre-line"
          >
            {"青空文庫の本を検索、ダウンロード、\n閲覧するためのWebアプリケーションです。\nブラウザベースですが、ホームに追加することでスマートフォンのアプリのように利用できます。\n\n文庫データはブラウザの中（indexedDB）に保存する仕組みのため、端末変更やキャッシュクリアなどを行うと削除される可能性がありますのでご注意ください。"}
          </Text>
        </Box>

        <Box
          as="footer"
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap="2.5"
          pt="32"
          w="full"
        >
          <Image
            src="/images/footer-logo.svg"
            alt="BOOK SKY, BLUE BLUE"
            width={40.24}
            height={74.92}
            priority={false}
          />

          <Link
            href="https://tohfu-tronica.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="underline"
            fontSize="12px"
            lineHeight="16px"
            fontWeight="400"
            color="#27272A"
          >
            tohfu-tronica.netlify.app
          </Link>

          <Text
            fontSize="12px"
            lineHeight="16px"
            fontWeight="400"
            color="#27272A"
          >
            © tohfu-tronica
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
