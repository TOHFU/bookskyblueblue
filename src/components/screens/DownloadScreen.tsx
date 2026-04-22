"use client";

import { saveWork } from "@/data/repositories/savedWorkRepository";
import type { Work } from "@/domain/entities/work";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { Box, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DownloadScreenProps = {
  identifier: string;
  initialWork: Work | null;
};

export function DownloadScreen({ identifier, initialWork }: DownloadScreenProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("準備中...");
  const [errorMessage, setErrorMessage] = useState("");

  const title = useMemo(() => initialWork?.title || "作品", [initialWork?.title]);

  useEffect(() => {
    let active = true;

    async function startDownload() {
      try {
        setStatusText("データ取得中...");

        const response = await fetch(`/api/works/${encodeURIComponent(identifier)}`);
        const payload = response.ok ? ((await response.json()) as Work) : initialWork;
        const work = payload ?? initialWork;
        if (!work) {
          throw new Error("作品データの取得に失敗しました。");
        }

        for (let value = 10; value <= 90; value += 10) {
          if (!active) {
            return;
          }
          setProgress(value);
          setStatusText(`ダウンロード中... ${value}%`);
          await wait(150);
        }

        setStatusText("IndexedDBへ保存中...");
        await saveWork(work);
        setProgress(100);
        setStatusText("完了しました。TOPへ戻ります...");

        await wait(500);
        router.replace("/");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "ダウンロードに失敗しました。");
      }
    }

    void startDownload();

    return () => {
      active = false;
    };
  }, [identifier, initialWork, router]);

  return (
    <VStack as="main" align="stretch" gap="6" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }}>
      <Heading size="2xl">DOWNLOAD</Heading>
      <Text>{title}</Text>

      <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" p="4">
        <VStack align="stretch" gap="3">
          <Progress.Root value={progress} size="lg" colorPalette="blue">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Text>{statusText}</Text>
        </VStack>
      </Box>

      <ErrorDialog
        open={Boolean(errorMessage)}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </VStack>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
