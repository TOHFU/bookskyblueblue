import type { Meta, StoryObj } from "@storybook/nextjs";
import { WorkDetailCard } from "@/components/ui/WorkDetailCard";
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

const meta: Meta<typeof WorkDetailCard> = {
  title: "Components/WorkDetailCard",
  component: WorkDetailCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    work: sampleWork,
    onDownload: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof WorkDetailCard>;

export const Playground: Story = {};

export const WithSubtitle: Story = {
  args: {
    work: {
      ...sampleWork,
      subtitle: "愛と誠実の物語",
      originalTitle: "Corrida",
    },
  },
};

export const MinimalData: Story = {
  args: {
    work: {
      id: "12345",
      title: "吾輩ハ猫デアル",
      author: "夏目漱石",
    },
  },
};

export const LongBadgeText: Story = {
  args: {
    work: {
      ...sampleWork,
      writingStyle: "旧字旧仮名遣い",
      publisher: "岩波書店版全集",
    },
  },
};
