import type { Meta, StoryObj } from "@storybook/nextjs";
import { TopEmptyState } from "@/components/screens/TopScreen";

const meta: Meta<typeof TopEmptyState> = {
  title: "Screens/Top/TopEmptyState",
  component: TopEmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    onSearchClick: { action: "onSearchClick" },
  },
};

export default meta;
type Story = StoryObj<typeof TopEmptyState>;

export const Default: Story = {};
