"use client";

import { Box, Flex } from "@chakra-ui/react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BackButton } from "@/components/ui/BackButton";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { useTopDetailScreen } from "@/hooks/screens/useTopDetailScreen";
import { BookmarkListCard } from "./BookmarkListCard";
import { TopDetailCard } from "./TopDetailCard";

type TopDetailScreenProps = {
  identifier: string;
};

export function TopDetailScreen({ identifier }: TopDetailScreenProps) {
  const {
    work,
    progress,
    bookmarks,
    isLoading,
    handleBack,
    handleClose,
    handleRead,
    handleOpenBookmark,
  } = useTopDetailScreen(identifier);

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
        position="relative"
        zIndex={1}
      >
        <BackButton aria-label="前の画面に戻る" onClick={handleBack} />

        {isLoading ? (
          <StatusMessage>読み込み中...</StatusMessage>
        ) : work ? (
          <>
            <TopDetailCard
              work={work}
              readingPage={progress.page}
              totalPages={progress.totalPages}
              onRead={handleRead}
            />

            {bookmarks.length > 0 && (
              <Flex
                as="ul"
                role="list"
                direction="column"
                gap="6"
                listStyleType="none"
                m="0"
                p="0"
              >
                {bookmarks.map((bookmark) => (
                  <Box
                    as="li"
                    key={`${bookmark.page}-${bookmark.excerpt}`}
                    listStyleType="none"
                  >
                    <BookmarkListCard
                      bookmark={bookmark}
                      onClick={handleOpenBookmark}
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </>
        ) : (
          <StatusMessage>作品が見つかりませんでした。</StatusMessage>
        )}
      </Flex>
    </Box>
  );
}
