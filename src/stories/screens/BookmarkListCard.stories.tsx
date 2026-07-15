import type { Meta, StoryObj } from "@storybook/nextjs";
import { BookmarkListCard } from "@/components/screens/TopDetailScreen/BookmarkListCard";

const meta: Meta<typeof BookmarkListCard> = {
  title: "Screens/TopDetail/BookmarkListCard",
  component: BookmarkListCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    bookmark: {
      page: 24,
      excerpt:
        "メロスは、それゆえ、花嫁の衣裳やら祝宴の御馳走やらを買いに、はしった。",
    },
  },
  argTypes: {
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<typeof BookmarkListCard>;

export const Default: Story = {};

export const LongExcerpt: Story = {
  args: {
    bookmark: {
      page: 40,
      excerpt:
        "セリヌンティウスは、縄打たれたまま、微笑していた。メロスは、ついに、激怒し、わめき散らした。",
    },
  },
};
