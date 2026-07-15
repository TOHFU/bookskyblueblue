"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { BadgeHelp, Search } from "lucide-react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BookCard } from "@/components/ui/BookCard";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { ToolbarIconButton } from "@/components/ui/ToolbarIconButton";
import { TopEmptyState } from "@/components/screens/TopScreen/TopEmptyState";
import { TopFooter } from "@/components/screens/TopScreen/TopFooter";
import { useTopScreen } from "@/hooks/screens/useTopScreen";

/**
 * TOP画面のコンポーネント
 * 保存済み作品一覧と削除機能を提供する
 */
export function TopScreen() {
  const {
    works,
    isLoading,
    progressMap,
    deleteTarget,
    isDeleteDialogOpen,
    isErrorDialogOpen,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDetailClick,
    handleSearchClick,
    handleHelpClick,
    closeErrorDialog,
  } = useTopScreen();

  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />

      <AppToolbar
        leftSlot={
          <ToolbarIconButton
            aria-label="ヘルプを開く"
            onClick={handleHelpClick}
          >
            <BadgeHelp size={20} />
          </ToolbarIconButton>
        }
        rightSlot={
          <ToolbarIconButton
            aria-label="検索画面へ移動"
            onClick={handleSearchClick}
          >
            <Search size={20} />
          </ToolbarIconButton>
        }
      />

      <Box
        as="section"
        aria-label="保存済み作品"
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
          <Flex as="ul" role="list" direction="column" align="stretch" gap="6" w="full">
            {works.map((work) => {
              const progress = work.id ? progressMap[work.id] : undefined;
              return (
                <Box as="li" key={work.id} listStyleType="none">
                  <BookCard
                    work={work}
                    showDeleteButton
                    showDetailButton
                    onDelete={handleDeleteClick}
                    onDetail={handleDetailClick}
                    readingPage={progress?.page}
                    totalPages={progress?.totalPages}
                  />
                </Box>
              );
            })}
          </Flex>
        )}

        <TopFooter />
      </Box>

      <ErrorDialog
        message="アプリの初期化に失敗しました。"
        isOpen={isErrorDialogOpen}
        onClose={closeErrorDialog}
      />

      <DeleteDialog
        work={deleteTarget}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <IconButton
        aria-label="検索画面へ移動"
        position="fixed"
        bottom="6"
        right="0"
        left="0"
        marginX="auto"
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
