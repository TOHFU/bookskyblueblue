"use client";

import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { saveWork } from "@/data/repositories/workIndexedDbRepository";

type DownloadScreenProps = {
  identifier: string;
};

type DownloadStatus = "downloading" | "done" | "error";

/**
 * DOWNLOAD画面のコンポーネント
 * 青空文庫からXHTMLを取得してIndexedDBに保存する
 */
export function DownloadScreen({ identifier }: DownloadScreenProps) {
  const router = useRouter();
  const [status, setStatus] = useState<DownloadStatus>("downloading");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const download = async () => {
      try {
        setProgress(20);

        // カタログから作品情報を取得
        const catalog = getWorkCatalog();
        const work = catalog.find((w) => w.id === identifier);

        if (!work) {
          throw new Error("作品が見つかりませんでした");
        }

        setProgress(40);

        // 青空文庫からXHTMLを取得
        const response = await fetch(`/api/works/${identifier}`);
        if (!response.ok) {
          throw new Error("ダウンロードに失敗しました");
        }

        setProgress(70);

        const data = (await response.json()) as { content?: string };
        const workWithContent = { ...work, content: data.content ?? "" };

        setProgress(90);

        // IndexedDBに保存
        await saveWork(workWithContent);
        setProgress(100);
        setStatus("done");

        // 完了後TOPに遷移
        setTimeout(() => {
          router.push("/");
        }, 800);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "エラーが発生しました");
      }
    };

    download();
  }, [identifier, router]);

  return (
    <Box
      as="main"
      w="375px"
      minH="770px"
      bg="#16AEFA"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch"
      gap="30px"
      p="32px 32px 80px"
      mx="auto"
    >
      {status === "error" ? (
        <Flex direction="column" align="center" gap="16px">
          <Text
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="14px"
            fontWeight="600"
            lineHeight="20px"
            color="#012639"
            textAlign="center"
          >
            {errorMessage}
          </Text>
        </Flex>
      ) : (
        <>
          <Text
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="10px"
            fontWeight="600"
            lineHeight="14px"
            color="#012639"
            textAlign="center"
            w="full"
          >
            {status === "done" ? "ダウンロードが完了しました。" : "作品をダウンロードしています。"}
          </Text>

          <Box w="full" bg="#BFE9FE" boxShadow="inset 0px 0px 0px 1px rgba(0, 0, 0, 0.05)">
            <Progress.Root
              value={progress}
              max={100}
              h="6px"
              bg="#BFE9FE"
              borderRadius="0"
            >
              <Progress.Track bg="#BFE9FE" borderRadius="0">
                <Progress.Range bg="#012639" />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </>
      )}
    </Box>
  );
}
