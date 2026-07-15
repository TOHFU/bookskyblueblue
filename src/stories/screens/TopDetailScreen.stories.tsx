import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Flex } from "@chakra-ui/react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { BackButton } from "@/components/ui/BackButton";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { BookmarkListCard } from "@/components/screens/TopDetailScreen/BookmarkListCard";
import { TopDetailCard } from "@/components/screens/TopDetailScreen/TopDetailCard";
import type { Bookmark, Work } from "@/domain/entities/work";

const sampleWork: Work = {
  id: "36785",
  title: "走れメロス",
  subtitle: "サブタイトル",
  originalTitle: "HASIRE MEROS",
  author: "太宰治",
  firstPublishedYear: "1988（昭和63）年10月25日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
  sourceBookName: "太宰治全集3",
};

const sampleBookmarks: Bookmark[] = [
  {
    page: 24,
    excerpt:
      "メロスは、それゆえ、花嫁の衣裳やら祝宴の御馳走やらを買いに、はしった。",
  },
  {
    page: 40,
    excerpt: "セリヌンティウスは、縄打たれたまま、微笑していた。",
  },
];

type TopDetailScreenPreviewProps = {
  work: Work;
  readingPage: number;
  totalPages: number;
  bookmarks: Bookmark[];
};

function TopDetailScreenPreview({
  work,
  readingPage,
  totalPages,
  bookmarks,
}: TopDetailScreenPreviewProps) {
  return (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />
      <AppToolbar rightSlot={<ToolbarCloseButton onClick={() => undefined} />} />
      <Flex
        direction="column"
        align="stretch"
        gap="6"
        p="6"
        position="relative"
        zIndex={1}
      >
        <BackButton aria-label="前の画面に戻る" onClick={() => undefined} />
        <TopDetailCard
          work={work}
          readingPage={readingPage}
          totalPages={totalPages}
          onRead={() => undefined}
        />
        {bookmarks.map((bookmark) => (
          <BookmarkListCard
            key={`${bookmark.page}-${bookmark.excerpt}`}
            bookmark={bookmark}
            onClick={() => undefined}
          />
        ))}
      </Flex>
    </Box>
  );
}

const meta: Meta<typeof TopDetailScreenPreview> = {
  title: "Screens/TopDetail/TopDetailScreen",
  component: TopDetailScreenPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  args: {
    work: sampleWork,
    readingPage: 24,
    totalPages: 80,
    bookmarks: sampleBookmarks,
  },
};

export default meta;
type Story = StoryObj<typeof TopDetailScreenPreview>;

export const Default: Story = {};

export const WithoutBookmarks: Story = {
  args: {
    bookmarks: [],
  },
};
