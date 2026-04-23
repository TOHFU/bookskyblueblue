import type { Meta, StoryObj } from "@storybook/nextjs";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import type { Work } from "@/domain/entities/work";
import { useState } from "react";

const sampleWork: Work = {
  id: "36785",
  title: "銀河鉄道の夜",
  author: "宮沢賢治",
  firstPublishedYear: "1989（平成元）年6月15日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
};

const meta: Meta<typeof DeleteDialog> = {
  title: "Components/DeleteDialog",
  component: DeleteDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    work: sampleWork,
    isOpen: true,
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteDialog>;

export const Playground: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
    return (
      <DeleteDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
      />
    );
  },
};

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};
