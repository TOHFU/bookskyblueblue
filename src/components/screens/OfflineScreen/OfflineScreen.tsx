"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AppFooter } from "@/components/ui/AppFooter";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";

/**
 * OFFLINE画面のコンポーネント
 */
export function OfflineScreen() {
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
        <Box
          as="section"
          aria-labelledby="offline-heading"
          w="full"
          px="4.5"
          py="4"
          display="flex"
          flexDirection="column"
          gap="6"
        >
          <Text
            id="offline-heading"
            as="h1"
            fontFamily="body"
            fontSize="sm"
            fontWeight="800"
            lineHeight="5"
            textAlign="center"
            color="fg"
            whiteSpace="pre-line"
          >
            {"オフラインのようです\nインターネットに接続してから\n再度アクセスしてください"}
          </Text>
          <Button
            onClick={() => router.push("/")}
            alignSelf="center"
            variant="solid"
            bg="fg"
            color="fg.inverted"
          >
            TOPに戻る
          </Button>
        </Box>

        <AppFooter />
      </Box>
    </Box>
  );
}
