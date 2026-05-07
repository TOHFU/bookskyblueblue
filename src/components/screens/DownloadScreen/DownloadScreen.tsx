"use client";

import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import { useDownloadScreen } from "@/hooks/screens/useDownloadScreen";

type DownloadScreenProps = {
  identifier: string;
};

/**
 * DOWNLOAD画面のコンポーネント
 * 青空文庫からXHTMLを取得してIndexedDBに保存する
 */
export function DownloadScreen({ identifier }: DownloadScreenProps) {
  const { status, progress, errorMessage } = useDownloadScreen(identifier);

  return (
    <Box
      as="main"
      w="375px"
      minH="770px"
      bg="bg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch"
      gap="7"
      pt="8"
      px="8"
      pb="20"
      mx="auto"
    >
      {status === "error" ? (
        <Flex direction="column" align="center" gap="4">
          <Text
            fontSize="xs"
            fontWeight="600"
            lineHeight="5"
            color="fg"
            textAlign="center"
          >
            {errorMessage}
          </Text>
        </Flex>
      ) : (
        <>
          <Text
            fontSize="3xs"
            fontWeight="600"
            lineHeight="3.5"
            color="fg"
            textAlign="center"
            w="full"
          >
            {status === "done" ? "ダウンロードが完了しました。" : "作品をダウンロードしています。"}
          </Text>

          <Box w="full" bg="bg.muted" boxShadow="inset 0px 0px 0px 1px rgba(0, 0, 0, 0.05)">
            <Progress.Root
              value={progress}
              max={100}
              h="1.5"
              bg="bg.muted"
              borderRadius="0"
            >
              <Progress.Track bg="bg.muted" borderRadius="0">
                <Progress.Range bg="fg" />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </>
      )}
    </Box>
  );
}
