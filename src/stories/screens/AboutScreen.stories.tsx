import type { Meta, StoryObj } from "@storybook/nextjs";
import { AboutScreen } from "@/components/screens/AboutScreen";

const meta: Meta<typeof AboutScreen> = {
  title: "Screens/About/AboutScreen",
  component: AboutScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof AboutScreen>;

/** ABOUT画面 */
export const Default: Story = {};
