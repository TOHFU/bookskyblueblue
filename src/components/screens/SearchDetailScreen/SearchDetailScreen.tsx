"use client";

import { useLayoutEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { WorkDetailCard } from "@/components/ui/WorkDetailCard";
import type { Work } from "@/domain/entities/work";
import { takeSearchDetailWork } from "@/lib/searchDetailCache";

type SearchDetailScreenProps = {
  identifier: string;
  /** サーバー側フォールバック（任意）。クライアントキャッシュを優先する */
  initialWork?: Work | null;
};

/**
 * SEARCH DETAIL画面のコンポーネント
 * 作品の詳細情報とダウンロードボタンを表示する
 */
export function SearchDetailScreen({
  identifier,
  initialWork = null,
}: SearchDetailScreenProps) {
  const router = useRouter();
  const [work, setWork] = useState<Work | null>(initialWork);
  const [isLoading, setIsLoading] = useState(!initialWork);
  const [error, setError] = useState<string | null>(null);

  // 初回ペイント前に session キャッシュを反映し、空白フレームを避ける
  useLayoutEffect(() => {
    const cached = takeSearchDetailWork(identifier);
    if (cached) {
      setWork(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (initialWork) {
      setWork(initialWork);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/catalog/${identifier}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("作品情報の取得に失敗しました");
        }
        const data = (await response.json()) as Work;
        if (!cancelled) {
          setWork(data);
        }
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }
        if (!cancelled) {
          setError("作品情報を表示できませんでした");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [identifier, initialWork]);

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
      <AppScreenBackground />

      <AppToolbar
        rightSlot={<ToolbarCloseButton onClick={handleClose} />}
      />

      <Flex
        direction="column"
        align="stretch"
        gap="6"
        p="6"
        w="full"
        position="relative"
        zIndex={1}
      >
        <BackButton aria-label="検索結果に戻る" onClick={handleBack} />

        {isLoading && <LoadingSpinner label="作品情報を読み込み中" />}
        {error && <StatusMessage>{error}</StatusMessage>}
        {work && (
          <Box className={initialWork ? "detail-card-fadein" : undefined}>
            <WorkDetailCard work={work} onDownload={handleDownload} />
          </Box>
        )}
      </Flex>
    </Box>
  );
}
