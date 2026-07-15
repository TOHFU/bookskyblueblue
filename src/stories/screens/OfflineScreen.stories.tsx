import type { Meta, StoryObj } from "@storybook/nextjs";
import { OfflineScreen } from "@/components/screens/OfflineScreen";

const meta: Meta<typeof OfflineScreen> = {
  title: "Screens/Offline/OfflineScreen",
  component: OfflineScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof OfflineScreen>;

export const Default: Story = {};
