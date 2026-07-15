import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppFooter } from "@/components/ui/AppFooter";

const meta: Meta<typeof AppFooter> = {
  title: "Components/AppFooter",
  component: AppFooter,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AppFooter>;

export const Default: Story = {};
