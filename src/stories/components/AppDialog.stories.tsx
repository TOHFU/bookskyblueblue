import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AppDialog } from "@/components/ui/AppDialog";

const meta: Meta<typeof AppDialog> = {
  title: "Components/AppDialog",
  component: AppDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    isOpen: true,
    title: "共通ダイアログ",
  },
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof AppDialog>;

export const Playground: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen ?? true);
    return (
      <AppDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={
          <Button onClick={() => setIsOpen(false)} bg="gray.900" color="fg.inverted">
            閉じる
          </Button>
        }
      >
        <Text fontSize="xs" fontWeight="600" color="fg.muted">
          AppDialog は DeleteDialog / ErrorDialog の共通シェルです。
        </Text>
      </AppDialog>
    );
  },
};

export const Open: Story = {
  args: { isOpen: true },
  render: (args) => (
    <AppDialog
      {...args}
      onClose={() => undefined}
      footer={
        <Button bg="gray.900" color="fg.inverted">
          閉じる
        </Button>
      }
    >
      <Text fontSize="xs" fontWeight="600" color="fg.muted">
        本文テキスト
      </Text>
    </AppDialog>
  ),
};
