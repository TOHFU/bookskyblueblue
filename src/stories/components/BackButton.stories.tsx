import type { Meta, StoryObj } from "@storybook/nextjs";
import { BackButton } from "@/components/ui/BackButton";

const meta: Meta<typeof BackButton> = {
  title: "Components/BackButton",
  component: BackButton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    "aria-label": "前の画面に戻る",
  },
  argTypes: {
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};

export const SearchBack: Story = {
  args: {
    "aria-label": "検索結果に戻る",
  },
};
