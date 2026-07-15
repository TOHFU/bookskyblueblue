import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Text } from "@chakra-ui/react";
import { FadeInBox } from "@/components/ui/FadeInBox";

const meta: Meta<typeof FadeInBox> = {
  title: "Components/FadeInBox",
  component: FadeInBox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FadeInBox>;

export const Default: Story = {
  render: () => (
    <FadeInBox>
      <Box bg="bg" borderWidth="2px" borderColor="border" p="6">
        <Text fontSize="sm" fontWeight="600">
          ビューポート入場時にフェードインします
        </Text>
      </Box>
    </FadeInBox>
  ),
};
