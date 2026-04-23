import {
  Avatar,
  Button,
  Card,
  HStack,
  Stack,
  type CardRootProps,
} from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

type CardOrientation = "vertical" | "horizontal";
type CardSize = "sm" | "md" | "lg";

type CardStoryArgs = {
  variant: CardRootProps["variant"];
  size: CardSize;
  orientation: CardOrientation;
  showAvatar: boolean;
  showFooter: boolean;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

const defaultArgs: CardStoryArgs = {
  variant: "outline",
  size: "md",
  orientation: "vertical",
  showAvatar: true,
  showFooter: true,
  title: "Card Title",
  description: "Card Description",
  primaryActionLabel: "Action",
  secondaryActionLabel: "Cancel",
};

const meta = {
  title: "Design System/Components/Card",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: defaultArgs,
  argTypes: {
    variant: { control: "select", options: ["elevated", "outline", "subtle"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    showAvatar: { control: "boolean" },
    showFooter: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    primaryActionLabel: { control: "text" },
    secondaryActionLabel: { control: "text" },
  },
} satisfies Meta<CardStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

type AvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<CardSize, { title: string; text: string; avatar: AvatarSize; minW: string }> = {
  sm: { title: "md", text: "sm", avatar: "sm", minW: "300px" },
  md: { title: "lg", text: "md", avatar: "md", minW: "360px" },
  lg: { title: "xl", text: "lg", avatar: "lg", minW: "420px" },
};

function CardPreview(args: CardStoryArgs) {
  const isHorizontal = args.orientation === "horizontal";
  const token = sizeMap[args.size];

  return (
    <Card.Root variant={args.variant} minW={{ base: "full", md: token.minW }}>
      <Card.Body>
        <Stack direction={isHorizontal ? "row" : "column"} gap="3" align="start">
          {args.showAvatar ? <Avatar.Root size={token.avatar}><Avatar.Fallback name="Book" /></Avatar.Root> : null}
          <Stack gap="1" flex="1">
            <Card.Title fontSize={token.title}>{args.title}</Card.Title>
            <Card.Description fontSize={token.text}>{args.description}</Card.Description>
          </Stack>
        </Stack>
      </Card.Body>
      {args.showFooter ? (
        <Card.Footer>
          <HStack gap="2">
            <Button variant="subtle" size={args.size}>
              {args.secondaryActionLabel}
            </Button>
            <Button variant="solid" size={args.size}>
              {args.primaryActionLabel}
            </Button>
          </HStack>
        </Card.Footer>
      ) : null}
    </Card.Root>
  );
}

export const Playground: Story = {
  render: (args) => <CardPreview {...defaultArgs} {...args} />,
};

export const Matrix: Story = {
  render: (args) => (
    <Stack gap="4" minW={{ base: "full", md: "760px" }}>
      <HStack gap="4" align="start">
        <CardPreview {...defaultArgs} {...args} variant="elevated" orientation="vertical" />
        <CardPreview {...defaultArgs} {...args} variant="outline" orientation="vertical" />
        <CardPreview {...defaultArgs} {...args} variant="subtle" orientation="vertical" />
      </HStack>
      <HStack gap="4" align="start">
        <CardPreview {...defaultArgs} {...args} variant="elevated" orientation="horizontal" />
        <CardPreview {...defaultArgs} {...args} variant="outline" orientation="horizontal" />
        <CardPreview {...defaultArgs} {...args} variant="subtle" orientation="horizontal" />
      </HStack>
    </Stack>
  ),
};
