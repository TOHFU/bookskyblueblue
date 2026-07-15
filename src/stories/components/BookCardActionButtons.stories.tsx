import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box } from "@chakra-ui/react";
import { BookCardActionButtons } from "@/components/ui/BookCard/BookCardActionButtons";
import type { Work } from "@/domain/entities/work";

const sampleWork: Work = {
  id: "36785",
  title: "走れメロス",
  author: "太宰治",
};

const meta: Meta<typeof BookCardActionButtons> = {
  title: "Components/BookCardActionButtons",
  component: BookCardActionButtons,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    work: sampleWork,
    showDeleteButton: true,
    showDetailButton: true,
  },
  argTypes: {
    showDeleteButton: { control: "boolean" },
    showDetailButton: { control: "boolean" },
    onDelete: { action: "onDelete" },
    onDetail: { action: "onDetail" },
  },
};

export default meta;
type Story = StoryObj<typeof BookCardActionButtons>;

export const Both: Story = {
  render: (args) => (
    <Box h="24" w="16" position="relative">
      <BookCardActionButtons {...args} />
    </Box>
  ),
};

export const DetailOnly: Story = {
  args: {
    showDeleteButton: false,
    showDetailButton: true,
  },
  render: (args) => (
    <Box h="24" w="16" position="relative">
      <BookCardActionButtons {...args} />
    </Box>
  ),
};

export const DeleteOnly: Story = {
  args: {
    showDeleteButton: true,
    showDetailButton: false,
  },
  render: (args) => (
    <Box h="24" w="16" position="relative">
      <BookCardActionButtons {...args} />
    </Box>
  ),
};
