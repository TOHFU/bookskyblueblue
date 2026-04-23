import type { Meta, StoryObj } from "@storybook/nextjs";
import { SearchDetailScreen } from "@/components/screens/SearchDetailScreen";
import type { Work } from "@/domain/entities/work";

const sampleWork: Work = {
  id: "36785",
  title: "走れメロス",
  subtitle: "",
  originalTitle: "HASIRE MEROS",
  author: "太宰治",
  firstPublishedYear: "1988（昭和63）年10月25日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
  sourceBookName: "筑摩書房版太宰治全集",
};

const meta: Meta<typeof SearchDetailScreen> = {
  title: "Screens/SearchDetail/SearchDetailScreen",
  component: SearchDetailScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  args: {
    work: sampleWork,
  },
  argTypes: {
    work: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchDetailScreen>;

/** 通常の作品詳細 */
export const Default: Story = {};

/** サブタイトルあり */
export const WithSubtitle: Story = {
  args: {
    work: {
      ...sampleWork,
      subtitle: "または走れメロス",
    },
  },
};

/** 最小限のデータ */
export const MinimalData: Story = {
  args: {
    work: {
      id: "1",
      title: "吾輩ハ猫デアル",
      author: "夏目漱石",
    },
  },
};
