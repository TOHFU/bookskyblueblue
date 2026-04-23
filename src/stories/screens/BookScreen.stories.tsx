import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** BookScreen のUIプレビュー用スタティックストーリー */
type BookScreenPreviewProps = {
  content: string;
  pageNumber: number;
  isEvenPage: boolean;
  controlsVisible: boolean;
};

function BookScreenPreview({
  content,
  pageNumber,
  isEvenPage,
  controlsVisible,
}: BookScreenPreviewProps) {
  return (
    <Box
      as="main"
      w="375px"
      h="770px"
      bg="bg"
      position="relative"
      overflow="hidden"
    >
      {/* 縦書きコンテンツ */}
      <Box
        pt="32px"
        px="32px"
        pb="80px"
        h="full"
        overflow="hidden"
        css={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
          columnCount: 1,
          columnGap: "10px",
          direction: "rtl",
        }}
      >
        <Text
          as="p"
          fontFamily="'Noto Serif JP', serif"
          fontSize="16px"
          fontWeight="700"
          lineHeight="18px"
          color="#012639"
          css={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
          }}
        >
          {content}
        </Text>
      </Box>

      {/* ページ番号 */}
      <Text
        position="absolute"
        bottom="32px"
        left={isEvenPage ? "31px" : undefined}
        right={isEvenPage ? undefined : "31px"}
        fontFamily="'Noto Serif JP', serif"
        fontSize="16px"
        fontWeight="700"
        lineHeight="18px"
        color="#012639"
      >
        {pageNumber}
      </Text>

      {/* フローティングコントロール */}
      <Flex
        position="absolute"
        bottom="25px"
        left="50%"
        transform="translateX(-50%)"
        direction="row"
        align="center"
        gap="0"
        opacity={controlsVisible ? 1 : 0}
        transition="opacity 0.5s ease"
        pointerEvents={controlsVisible ? "auto" : "none"}
      >
        {/* 閉じるボタン */}
        <IconButton
          aria-label="TOP画面へ戻る"
          variant="solid"
          bg="#18181B"
          color="white"
          w="44px"
          h="44px"
          borderRadius="0"
        >
          <X size={20} />
        </IconButton>

        {/* 前のページ */}
        <IconButton
          aria-label="前のページ"
          variant="solid"
          bg="#18181B"
          color="white"
          w="44px"
          h="44px"
          borderRadius="0"
        >
          <ChevronLeft size={20} />
        </IconButton>

        {/* 次のページ */}
        <IconButton
          aria-label="次のページ"
          variant="solid"
          bg="#18181B"
          color="white"
          w="44px"
          h="44px"
          borderRadius="0"
        >
          <ChevronRight size={20} />
        </IconButton>
      </Flex>
    </Box>
  );
}

const SAMPLE_CONTENT =
  "時どき私はそんな路を歩きながら、ふと、そこが京都ではなくて京都から何百里も離れた仙台とか長崎とか――そのような市へ今自分が来ているのだ――という錯覚を起こそうと努める。私は、できることなら京都から逃げ出して誰一人知らないような市へ行ってしまいたかった。";

const meta: Meta<BookScreenPreviewProps> = {
  title: "Screens/Book/BookScreen",
  component: BookScreenPreview,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    content: SAMPLE_CONTENT,
    pageNumber: 48,
    isEvenPage: true,
    controlsVisible: true,
  },
  argTypes: {
    content: { control: "text" },
    pageNumber: { control: "number" },
    isEvenPage: { control: "boolean" },
    controlsVisible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<BookScreenPreviewProps>;

/** 偶数ページ（ページ番号左下） */
export const EvenPage: Story = {
  render: (args) => <BookScreenPreview {...args} />,
};

/** 奇数ページ（ページ番号右下） */
export const OddPage: Story = {
  args: {
    pageNumber: 49,
    isEvenPage: false,
  },
  render: (args) => <BookScreenPreview {...args} />,
};

/** コントロール非表示（フェードアウト後） */
export const ControlsHidden: Story = {
  args: {
    controlsVisible: false,
  },
  render: (args) => <BookScreenPreview {...args} />,
};
