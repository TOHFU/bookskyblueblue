"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BadgeHelp, Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { BookCard } from "@/components/ui/BookCard";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { TopEmptyState } from "@/components/screens/TopScreen/TopEmptyState";
import { TopFooter } from "@/components/screens/TopScreen/TopFooter";
import { getSavedWorks, deleteWork, getReadingProgress } from "@/data/repositories/workIndexedDbRepository";
import type { Work } from "@/domain/entities/work";

/**
 * TOP画面のコンポーネント
 * 保存済み作品一覧と削除機能を提供する
 */
export function TopScreen() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, { page: number; totalPages: number }>>({});
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const loadWorks = useCallback(async () => {
    try {
      const saved = await getSavedWorks();
      setWorks(saved);
      const entries = await Promise.all(
        saved
          .filter((w) => w.id)
          .map(async (w) => {
            const progress = await getReadingProgress(w.id!);
            return [w.id!, progress] as const;
          })
      );
      setProgressMap(Object.fromEntries(entries));
    } catch {
      setWorks([]);
      setIsErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  const handleDeleteClick = (work: Work) => {
    setDeleteTarget(work);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (work: Work) => {
    if (!work.id) return;
    await deleteWork(work.id);
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
    await loadWorks();
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleDetailClick = (work: Work) => {
    if (work.id) {
      router.push(`/book/${work.id}`);
    }
  };

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handleHelpClick = () => {
    router.push("/about");
  };

  return (
    <Box
      as="main"
      minH="100svh"
      bg="bg"
      position="relative"
    >
      {/* 背景画像 */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        style={{ mixBlendMode: "multiply" }}
        pointerEvents="none"
        aria-hidden="true"
        zIndex={0}
      />

      {/* ツールバー */}
      <AppToolbar
        leftSlot={
          <IconButton
            aria-label="ヘルプを開く"
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={handleHelpClick}
          >
            <BadgeHelp size={20} />
          </IconButton>
        }
        rightSlot={
          <IconButton
            aria-label="検索画面へ移動"
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={handleSearchClick}
          >
            <Search size={20} />
          </IconButton>
        }
      />

      {/* コンテンツエリア（IndexedDB ロード完了後にフェードイン） */}
      <Box
        p="6"
        w="full"
        position="relative"
        zIndex={1}
        className={isLoading ? undefined : "top-content-fadein"}
        style={{ opacity: isLoading ? 0 : undefined }}
      >
        {!isLoading && works.length === 0 ? (
          <TopEmptyState onSearchClick={handleSearchClick} />
        ) : (
          <Flex
            direction="column"
            align="stretch"
            gap="6"
            w="full"
          >
            {works.map((work) => {
              const progress = work.id ? progressMap[work.id] : undefined;
              return (
                <BookCard
                  key={work.id}
                  work={work}
                  showDeleteButton
                  showDetailButton
                  onDelete={handleDeleteClick}
                  onDetail={handleDetailClick}
                  readingPage={progress?.page}
                  totalPages={progress?.totalPages}
                />
              );
            })}
          </Flex>
        )}

        <TopFooter />
      </Box>

      {/* 削除確認ダイアログ */}
      <ErrorDialog
        message="アプリの初期化に失敗しました。"
        isOpen={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />

      <DeleteDialog
        work={deleteTarget}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {/* FAB: 検索ボタン */}
      <IconButton
        aria-label="検索画面へ移動"
        position="fixed"
        bottom="6"
        right="6"
        w="20"
        h="12"
        style={{ borderRadius: "9999px" }}
        bg="gray.900"
        color="fg.inverted"
        zIndex={10}
        onClick={handleSearchClick}
      >
        <Search size={20} />
      </IconButton>
    </Box>
  );
}
