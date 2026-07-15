import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { BookFloatingControls } from "@/components/screens/BookScreen/BookFloatingControls";

const meta: Meta<typeof BookFloatingControls> = {
  title: "Components/BookFloatingControls",
  component: BookFloatingControls,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    visible: true,
    currentPage: 2,
    pageCount: 10,
    isCurrentPageBookmarked: false,
    canDecreaseFontSize: true,
    canIncreaseFontSize: true,
  },
  argTypes: {
    visible: { control: "boolean" },
    currentPage: { control: { type: "number", min: 0, max: 20 } },
    pageCount: { control: { type: "number", min: 1, max: 20 } },
    isCurrentPageBookmarked: { control: "boolean" },
    onPrevPage: { action: "onPrevPage" },
    onNextPage: { action: "onNextPage" },
    onDecreaseFontSize: { action: "onDecreaseFontSize" },
    onIncreaseFontSize: { action: "onIncreaseFontSize" },
    onToggleBookmark: { action: "onToggleBookmark" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<typeof BookFloatingControls>;

function withStage(story: ReactNode) {
  return (
    <Box position="relative" minH="200px" bg="bg" borderWidth="2px" borderColor="border">
      {story}
    </Box>
  );
}

export const Default: Story = {
  render: (args) => withStage(<BookFloatingControls {...args} />),
};

export const Bookmarked: Story = {
  args: {
    isCurrentPageBookmarked: true,
  },
  render: (args) => withStage(<BookFloatingControls {...args} />),
};

export const FirstPage: Story = {
  args: {
    currentPage: 0,
    pageCount: 10,
  },
  render: (args) => withStage(<BookFloatingControls {...args} />),
};

export const LastPage: Story = {
  args: {
    currentPage: 9,
    pageCount: 10,
  },
  render: (args) => withStage(<BookFloatingControls {...args} />),
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
  render: (args) => withStage(<BookFloatingControls {...args} />),
};
