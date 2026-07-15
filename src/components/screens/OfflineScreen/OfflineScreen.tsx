"use client";

import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AppFooter } from "@/components/ui/AppFooter";
import { AppToolbar } from "@/components/ui/AppToolbar";

/**
 * OFFLINE画面のコンポーネント
 */
export function OfflineScreen() {
  const router = useRouter();

  return (
    <Box as="main" minH="100svh" position="relative">
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
