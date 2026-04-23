"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { BookCard } from "@/components/ui/BookCard";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { TopEmptyState } from "@/components/screens/TopScreen/TopEmptyState";
import { getSavedWorks, deleteWork } from "@/data/repositories/workIndexedDbRepository";
import type { Work } from "@/domain/entities/work";

/**
 * TOP画面のコンポーネント
 * 保存済み作品一覧と削除機能を提供する
 */
export function TopScreen() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadWorks = useCallback(async () => {
    const saved = await getSavedWorks();
    setWorks(saved);
    setIsLoading(false);
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

  return (
    <Box
      as="main"
      minH="100svh"
      bg="#16AEFA"
      position="relative"
    >
      {/* 背景画像 */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        style={{ mixBlendMode: "multiply" }}
        pointerEvents="none"
        aria-hidden="true"
        zIndex={0}
      />

      {/* ツールバー */}
      <Flex
        as="header"
        direction="row"
        justify="flex-end"
        align="center"
        w="full"
        h="44px"
        px="0"
        position="relative"
        zIndex={1}
      >
        <IconButton
          aria-label="検索画面へ移動"
          variant="solid"
          w="44px"
          h="44px"
          bg="#18181B"
          color="white"
          onClick={handleSearchClick}
        >
          <Search size={20} />
        </IconButton>
      </Flex>

      {/* コンテンツエリア（IndexedDB ロード完了後にフェードイン） */}
      <Box
        p="24px"
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
            gap="24px"
            w="full"
          >
            {works.map((work) => (
              <BookCard
                key={work.id}
                work={work}
                showDeleteButton
                showDetailButton
                onDelete={handleDeleteClick}
                onDetail={handleDetailClick}
              />
            ))}
          </Flex>
        )}
      </Box>

      {/* 削除確認ダイアログ */}
      <DeleteDialog
        work={deleteTarget}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
