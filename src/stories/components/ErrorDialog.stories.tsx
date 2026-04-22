import type { Meta, StoryObj } from "@storybook/nextjs";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { useState } from "react";

const meta: Meta<typeof ErrorDialog> = {
  title: "Components/ErrorDialog",
  component: ErrorDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    isOpen: true,
    message: "時間を置いて、再度実行してください。",
  },
  argTypes: {
    isOpen: { control: "boolean" },
    message: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorDialog>;

export const Playground: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
    return (
      <ErrorDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    );
  },
};

export const Open: Story = {
  args: { isOpen: true },
};

export const CustomMessage: Story = {
  args: {
    isOpen: true,
    message: "ネットワークエラーが発生しました。接続を確認してください。",
  },
};
