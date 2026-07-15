import type { Meta, StoryObj } from "@storybook/nextjs";
import { TopDetailCard } from "@/components/screens/TopDetailScreen/TopDetailCard";
import type { Work } from "@/domain/entities/work";

const sampleWork: Work = {
  id: "36785",
  title: "走れメロス",
  subtitle: "サブタイトル",
  originalTitle: "HASIRE MEROS",
  author: "太宰治",
  firstPublishedYear: "1988（昭和63）年10月25日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
  sourceBookName: "太宰治全集3",
};

const meta: Meta<typeof TopDetailCard> = {
  title: "Screens/TopDetail/TopDetailCard",
  component: TopDetailCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    work: sampleWork,
    readingPage: 24,
    totalPages: 80,
  },
  argTypes: {
    readingPage: { control: { type: "number", min: 0 } },
    totalPages: { control: { type: "number", min: 1 } },
    onRead: { action: "onRead" },
  },
};

export default meta;
type Story = StoryObj<typeof TopDetailCard>;

export const Default: Story = {};

export const Unread: Story = {
  args: {
    readingPage: 0,
    totalPages: 80,
  },
};

export const Finished: Story = {
  args: {
    readingPage: 79,
    totalPages: 80,
  },
};
