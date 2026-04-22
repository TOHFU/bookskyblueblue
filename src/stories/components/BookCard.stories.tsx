import type { Meta, StoryObj } from "@storybook/nextjs";
import { BookCard } from "@/components/ui/BookCard";
import type { Work } from "@/domain/entities/work";

const sampleWork: Work = {
  id: "36785",
  title: "走れメロス",
  author: "太宰治",
  firstPublishedYear: "1988（昭和63）年10月25日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
  sourceBookName: "筑摩書房版太宰治全集",
};

const meta: Meta<typeof BookCard> = {
  title: "Components/BookCard",
  component: BookCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    work: sampleWork,
    showDeleteButton: false,
    showDetailButton: true,
  },
  argTypes: {
    showDeleteButton: { control: "boolean" },
    showDetailButton: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof BookCard>;

export const Playground: Story = {
  render: (args) => <BookCard {...args} />,
};

export const WithDeleteButton: Story = {
  args: {
    showDeleteButton: true,
    showDetailButton: true,
  },
};

export const DetailOnly: Story = {
  args: {
    showDeleteButton: false,
    showDetailButton: true,
  },
};

export const MinimalData: Story = {
  args: {
    work: {
      id: "12345",
      title: "吾輩ハ猫デアル",
      author: "夏目漱石",
    },
    showDeleteButton: true,
    showDetailButton: true,
  },
};
