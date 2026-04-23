import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { X, Search } from "lucide-react";
import { BookCard } from "@/components/ui/BookCard";
import { SearchEmptyState } from "@/components/screens/SearchScreen";
import type { Work } from "@/domain/entities/work";

const SAMPLE_RESULTS: Work[] = [
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
    title: "走れメロス",
    author: "太宰治",
    firstPublishedYear: "1940（昭和15）年",
    writingStyle: "新字新仮名",
    publisher: "筑摩書房",
  },
];

type SearchScreenPreviewProps = {
  query: string;
  results: Work[];
  isLoading: boolean;
};

function SearchScreenPreview({ query, results, isLoading }: SearchScreenPreviewProps) {
  const isEmpty = !isLoading && results.length === 0 && query.length > 0;

  return (
    <Box as="main" minH="100svh" bg="#16AEFA" position="relative">
      {/* ツールバー */}
      <Flex
        as="header"
        direction="row"
        justify="flex-end"
        align="center"
        w="full"
        h="44px"
      >
        <IconButton
          aria-label="TOPに戻る"
          variant="ghost"
          w="44px"
          h="44px"
          color="#18181B"
        >
          <X size={20} />
        </IconButton>
      </Flex>

      {/* コンテンツエリア */}
      <Flex direction="column" align="stretch" gap="24px" p="24px" w="full">
        {/* 検索入力 */}
        <Box position="relative">
          <Box
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            color="#012639"
            opacity={0.7}
            zIndex={1}
            pointerEvents="none"
          >
            <Search size={20} />
          </Box>
          <Input
            value={query}
            readOnly
            placeholder="作品名・作者名"
            bg="#16AEFA"
            borderWidth="1px"
            borderColor="#012639"
            color="#012639"
            h="44px"
            pl="44px"
            fontFamily="'Noto Sans JP', sans-serif"
            fontSize="18px"
            _placeholder={{ color: "#012639", opacity: 0.5 }}
            aria-label="作品を検索"
          />
        </Box>

        {/* 検索結果 */}
        {isEmpty ? (
          <SearchEmptyState query={query} onSampleClick={() => {}} />
        ) : (
          results.map((work) => (
            <BookCard
              key={work.id}
              work={work}
              showDeleteButton={false}
              showDetailButton
            />
          ))
        )}

        {/* ローディング */}
        {isLoading && (
          <Flex justify="center" py="16px">
            <Text color="#012639" fontFamily="'Noto Sans JP', sans-serif" fontSize="14px">
              読み込み中...
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

const meta: Meta<SearchScreenPreviewProps> = {
  title: "Screens/Search/SearchScreen",
  component: SearchScreenPreview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    query: "梶井",
    results: SAMPLE_RESULTS,
    isLoading: false,
  },
  argTypes: {
    query: { control: "text" },
    isLoading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<SearchScreenPreviewProps>;

/** 検索結果あり */
export const WithResults: Story = {
  render: (args) => <SearchScreenPreview {...args} />,
};

/** 検索結果0件（EmptyState） */
export const Empty: Story = {
  args: {
    query: "存在しない作品",
    results: [],
  },
  render: (args) => <SearchScreenPreview {...args} />,
};

/** ローディング中 */
export const Loading: Story = {
  args: {
    query: "夏目",
    results: [],
    isLoading: true,
  },
  render: (args) => <SearchScreenPreview {...args} />,
};

/** 初期状態（未入力） */
export const Initial: Story = {
  args: {
    query: "",
    results: [],
  },
  render: (args) => <SearchScreenPreview {...args} />,
};
