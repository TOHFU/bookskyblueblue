import type { Meta, StoryObj } from "@storybook/nextjs";
import { ToolbarCloseButton } from "@/components/ui/ToolbarCloseButton";

const meta: Meta<typeof ToolbarCloseButton> = {
  title: "Components/ToolbarCloseButton",
  component: ToolbarCloseButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<typeof ToolbarCloseButton>;

export const Default: Story = {};
