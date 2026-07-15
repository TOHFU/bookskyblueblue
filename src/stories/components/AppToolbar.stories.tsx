import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeHelp, Search } from "lucide-react";
import { AppToolbar } from "@/components/ui/AppToolbar";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";
import { ToolbarIconButton } from "@/components/ui/ToolbarIconButton";

const meta: Meta<typeof AppToolbar> = {
  title: "Components/AppToolbar",
  component: AppToolbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AppToolbar>;

export const Playground: Story = {
  render: (args) => <AppToolbar {...args} />,
};

export const RightOnly: Story = {
  args: {
    rightSlot: <ToolbarCloseButton onClick={() => undefined} />,
  },
};

export const LeftOnly: Story = {
  args: {
    leftSlot: (
      <ToolbarIconButton aria-label="ヘルプを開く" onClick={() => undefined}>
        <BadgeHelp size={20} />
      </ToolbarIconButton>
    ),
  },
};

export const BothSlots: Story = {
  args: {
    leftSlot: (
      <ToolbarIconButton aria-label="ヘルプを開く" onClick={() => undefined}>
        <BadgeHelp size={20} />
      </ToolbarIconButton>
    ),
    rightSlot: (
      <ToolbarIconButton aria-label="検索画面へ移動" onClick={() => undefined}>
        <Search size={20} />
      </ToolbarIconButton>
    ),
  },
};

export const Empty: Story = {};
