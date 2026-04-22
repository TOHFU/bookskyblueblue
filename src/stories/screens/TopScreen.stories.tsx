import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { BookCard } from "@/components/ui/BookCard";
import { TopEmptyState } from "@/components/screens/TopScreen";
import type { Work } from "@/domain/entities/work";

const SAMPLE_WORKS: Work[] = [
  {
    id: "1",
    title: "檸檬",
    author: "梶井 基次郎",
    firstPublishedYear: "1988（昭和63）年10月25日",
    writingStyle: "新字新仮名",
    publisher: "筑摩書房",
  },
  {
    id: "2",
    title: "銀河鉄道の夜",
    author: "宮沢賢治",
    firstPublishedYear: "1989（平成元）年6月15日",
    writingStyle: "新字新仮名",
    publisher: "筑摩書房",
  },
  {
    id: "3",
    title: "吾輩ハ猫デアル",
    author: "夏目漱石",
    writingStyle: "新字新仮名",
    publisher: "筑摩書房",
  },
];

type TopScreenPreviewProps = {
  works: Work[];
};

function TopScreenPreview({ works }: TopScreenPreviewProps) {
  return (
    <Box as="main" minH="100svh" bg="#16AEFA" position="relative">
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
        >
          <Search size={20} />
        </IconButton>
      </Flex>

      {/* コンテンツエリア */}
      <Box p="24px" w="full" position="relative" zIndex={1}>
        {works.length === 0 ? (
          <TopEmptyState onSearchClick={() => {}} />
        ) : (
          <Flex direction="column" align="stretch" gap="24px" w="full">
            {works.map((work) => (
              <BookCard
                key={work.id}
                work={work}
                showDeleteButton
                showDetailButton
              />
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}

const meta: Meta<TopScreenPreviewProps> = {
  title: "Screens/Top/TopScreen",
  component: TopScreenPreview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    works: SAMPLE_WORKS,
  },
};

export default meta;
type Story = StoryObj<TopScreenPreviewProps>;

/** 作品一覧あり */
export const WithWorks: Story = {
  render: (args) => <TopScreenPreview {...args} />,
};

/** 作品0件（EmptyState表示） */
export const Empty: Story = {
  args: { works: [] },
  render: (args) => <TopScreenPreview {...args} />,
};

/** 1件のみ */
export const SingleWork: Story = {
  args: { works: [SAMPLE_WORKS[0]] },
  render: (args) => <TopScreenPreview {...args} />,
};
