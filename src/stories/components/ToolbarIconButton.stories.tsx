import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeHelp, Search } from "lucide-react";
import { ToolbarIconButton } from "@/components/ui/ToolbarIconButton";

const meta: Meta<typeof ToolbarIconButton> = {
  title: "Components/ToolbarIconButton",
  component: ToolbarIconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<typeof ToolbarIconButton>;

export const SearchButton: Story = {
  args: {
    "aria-label": "検索画面へ移動",
    children: <Search size={20} />,
  },
};

export const HelpButton: Story = {
  args: {
    "aria-label": "ヘルプを開く",
    children: <BadgeHelp size={20} />,
  },
};
