import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Text } from "@chakra-ui/react";
import { AppScreenBackground } from "@/components/ui/AppScreenBackground";

const meta: Meta<typeof AppScreenBackground> = {
  title: "Components/AppScreenBackground",
  component: AppScreenBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppScreenBackground>;

export const Default: Story = {
  render: () => (
    <Box as="main" minH="100svh" bg="bg" position="relative">
      <AppScreenBackground />
      <Box position="relative" zIndex={1} p="6">
        <Text fontSize="sm" fontWeight="800">
          乗算ブレンドの全画面背景
        </Text>
      </Box>
    </Box>
  ),
};
