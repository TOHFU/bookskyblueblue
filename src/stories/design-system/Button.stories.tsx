import { Button, Grid, HStack, Text, VStack, type ButtonProps } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

type ButtonState = "default" | "hover" | "disabled";

type ButtonStoryArgs = {
  label: string;
  variant: ButtonProps["variant"];
  size: ButtonProps["size"];
  colorPalette: ButtonProps["colorPalette"];
  state: ButtonState;
  showIconStart: boolean;
  showIconEnd: boolean;
};

const defaultArgs: ButtonStoryArgs = {
  label: "Button",
  variant: "solid",
  size: "md",
  colorPalette: "blue",
  state: "default",
  showIconStart: true,
  showIconEnd: true,
};

const colorPalettes = [
  "gray",
  "red",
  "pink",
  "purple",
  "cyan",
  "blue",
  "teal",
  "green",
  "yellow",
  "orange",
] as const;

const meta = {
  title: "Design System/Components/Button",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: defaultArgs,
  argTypes: {
    label: { control: "text" },
    variant: { control: "select", options: ["solid", "subtle", "outline"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    colorPalette: { control: "select", options: colorPalettes },
    state: { control: "inline-radio", options: ["default", "hover", "disabled"] },
    showIconStart: { control: "boolean" },
    showIconEnd: { control: "boolean" },
  },
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

function ButtonPreview(args: ButtonStoryArgs) {
  const isDisabled = args.state === "disabled";
  const hoverStyles =
    args.state === "hover"
      ? {
          filter: "brightness(0.95)",
        }
      : undefined;

  return (
    <Button
      variant={args.variant}
      size={args.size}
      colorPalette={args.colorPalette}
      disabled={isDisabled}
      css={hoverStyles}
    >
      <HStack gap="2">
        {args.showIconStart ? <Text aria-hidden>@</Text> : null}
        <Text>{args.label}</Text>
        {args.showIconEnd ? <Text aria-hidden>{">"}</Text> : null}
      </HStack>
    </Button>
  );
}

export const Playground: Story = {
  render: (args) => <ButtonPreview {...defaultArgs} {...args} />,
};

export const Variants: Story = {
  render: (args) => (
    <VStack align="stretch" gap="4" minW={{ base: "full", md: "560px" }}>
      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="3">
        <ButtonPreview {...defaultArgs} {...args} variant="solid" state="default" />
        <ButtonPreview {...defaultArgs} {...args} variant="subtle" state="default" />
        <ButtonPreview {...defaultArgs} {...args} variant="outline" state="default" />
      </Grid>
      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="3">
        <ButtonPreview {...defaultArgs} {...args} variant="solid" state="hover" />
        <ButtonPreview {...defaultArgs} {...args} variant="subtle" state="hover" />
        <ButtonPreview {...defaultArgs} {...args} variant="outline" state="hover" />
      </Grid>
      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="3">
        <ButtonPreview {...defaultArgs} {...args} variant="solid" state="disabled" />
        <ButtonPreview {...defaultArgs} {...args} variant="subtle" state="disabled" />
        <ButtonPreview {...defaultArgs} {...args} variant="outline" state="disabled" />
      </Grid>
    </VStack>
  ),
};
