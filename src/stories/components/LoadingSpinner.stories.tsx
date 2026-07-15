import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    label: "読み込み中",
  },
  argTypes: {
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const Searching: Story = {
  args: {
    label: "検索中",
  },
};
