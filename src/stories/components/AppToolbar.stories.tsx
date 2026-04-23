import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@chakra-ui/react";
import { ArrowLeft, X } from "lucide-react";
import { AppToolbar } from "@/components/ui/AppToolbar";

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
    rightSlot: (
      <Button
        variant="solid"
        w="44px"
        h="44px"
        bg="gray.900"
        color="white"
        p="0"
        aria-label="TOPに戻る"
      >
        <X size={20} />
      </Button>
    ),
  },
};

export const LeftOnly: Story = {
  args: {
    leftSlot: (
      <Button
        variant="solid"
        w="44px"
        h="44px"
        bg="gray.900"
        color="white"
        p="0"
        aria-label="戻る"
      >
        <ArrowLeft size={20} />
      </Button>
    ),
  },
};

export const BothSlots: Story = {
  args: {
    leftSlot: (
      <Button
        variant="solid"
        w="44px"
        h="44px"
        bg="gray.900"
        color="white"
        p="0"
        aria-label="戻る"
      >
        <ArrowLeft size={20} />
      </Button>
    ),
    rightSlot: (
      <Button
        variant="solid"
        w="44px"
        h="44px"
        bg="gray.900"
        color="white"
        p="0"
        aria-label="TOPに戻る"
      >
        <X size={20} />
      </Button>
    ),
  },
};

export const Empty: Story = {};
