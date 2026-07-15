import type { Meta, StoryObj } from "@storybook/nextjs";
import { WorkMetaBadges } from "@/components/ui/WorkMetaBadges";

const meta: Meta<typeof WorkMetaBadges> = {
  title: "Components/WorkMetaBadges",
  component: WorkMetaBadges,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    writingStyle: "新字新仮名",
    publisher: "筑摩書房",
  },
  argTypes: {
    writingStyle: { control: "text" },
    publisher: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkMetaBadges>;

export const Default: Story = {};

export const Truncated: Story = {
  args: {
    writingStyle: "あいうえおかきくけこ",
    publisher: "とても長い出版社名です",
  },
};

export const WritingStyleOnly: Story = {
  args: {
    writingStyle: "旧字旧仮名",
    publisher: undefined,
  },
};

export const Empty: Story = {
  args: {
    writingStyle: undefined,
    publisher: undefined,
  },
};
