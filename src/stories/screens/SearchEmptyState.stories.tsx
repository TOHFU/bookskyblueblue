import type { Meta, StoryObj } from "@storybook/nextjs";
import { SearchEmptyState } from "@/components/screens/SearchScreen";

const meta: Meta<typeof SearchEmptyState> = {
  title: "Screens/Search/SearchEmptyState",
  component: SearchEmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    query: "坊っちゃん",
  },
  argTypes: {
    query: { control: "text" },
    onSampleClick: { action: "onSampleClick" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchEmptyState>;

export const Default: Story = {};

export const LongQuery: Story = {
  args: {
    query: "明治時代の小説で夏目漱石の作品",
  },
};
