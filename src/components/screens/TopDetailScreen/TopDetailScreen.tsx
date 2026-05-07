"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowLeft, X } from "lucide-react";
import { AppToolbar } from "@/components/ui/AppToolbar";
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
      <Box
        position="fixed"
        top={0}
        left={0}
        w="full"
        h="100svh"
        backgroundImage="url('/images/top-background.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        style={{ mixBlendMode: "multiply" }}
        zIndex={0}
        pointerEvents="none"
      />

      <AppToolbar
        rightSlot={
          <Button
            variant="solid"
            w="11"
            h="11"
            bg="gray.900"
            color="fg.inverted"
            onClick={handleClose}
            p="0"
            aria-label="TOPに戻る"
          >
            <X size={20} />
          </Button>
        }
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