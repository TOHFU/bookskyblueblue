import type { Meta, StoryObj } from "@storybook/nextjs";
import { DownloadScreen } from "@/components/screens/DownloadScreen";

const meta: Meta<typeof DownloadScreen> = {
  title: "Screens/Download/DownloadScreen",
  component: DownloadScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  args: {
    identifier: "36785",
  },
  argTypes: {
    identifier: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DownloadScreen>;

/** ダウンロード画面（APIが呼ばれるためMSW等が必要） */
export const Default: Story = {};
