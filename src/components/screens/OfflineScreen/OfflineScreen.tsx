"use client";

import { Box, Button, IconButton, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
