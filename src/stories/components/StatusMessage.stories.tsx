import type { Meta, StoryObj } from "@storybook/nextjs";
import { StatusMessage } from "@/components/ui/StatusMessage";

const meta: Meta<typeof StatusMessage> = {
  title: "Components/StatusMessage",
  component: StatusMessage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatusMessage>;

export const Loading: Story = {
  args: {
    children: "読み込み中...",
  },
};

export const NotFound: Story = {
  args: {
    children: "作品が見つかりませんでした。",
  },
};
