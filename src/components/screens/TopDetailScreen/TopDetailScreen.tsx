"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
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
  } =
    useTopDetailScreen(identifier);

  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />

      <AppToolbar
        rightSlot={<ToolbarCloseButton onClick={handleClose} />}
      />

      <Flex direction="column" align="stretch" gap="6" p="6" position="relative" zIndex={1}>
        <Button
          variant="solid"
          w="fit-content"
          h="10"
          px="4"
          bg="gray.900"
          color="fg.inverted"
          onClick={handleBack}
          fontSize="xs"
          aria-label="前の画面に戻る"
        >
          <ArrowLeft size={16} />
          BACK
        </Button>

        {isLoading ? (
          <Box bg="bg" borderWidth="2px" borderColor="border" p="6">
            <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg">
              読み込み中...
            </Text>
          </Box>
        ) : work ? (
          <>
            <TopDetailCard
              work={work}
              readingPage={progress.page}
              totalPages={progress.totalPages}
              onRead={handleRead}
            />

            {bookmarks.map((bookmark) => (
              <BookmarkListCard
                key={`${bookmark.page}-${bookmark.excerpt}`}
                bookmark={bookmark}
                onClick={handleOpenBookmark}
              />
            ))}
          </>
        ) : (
          <Box bg="bg" borderWidth="2px" borderColor="border" p="6">
            <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg">
              作品が見つかりませんでした。
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}