import {
  Badge,
  Box,
  Field,
  Input,
  InputGroup,
  VStack,
  type InputProps,
} from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

type InputState = "default" | "focus" | "disabled";

type InputStoryArgs = {
  variant: InputProps["variant"];
  size: InputProps["size"];
  state: InputState;
  isInvalid: boolean;
  isFilled: boolean;
  showLabel: boolean;
  label: string;
  isRequired: boolean;
  isOptional: boolean;
  placeholder: string;
  filledValue: string;
  showLeftElement: boolean;
  showRightElement: boolean;
  showHelperText: boolean;
  helperText: string;
  errorText: string;
};

const defaultArgs: InputStoryArgs = {
  variant: "outline",
  size: "md",
  state: "default",
  isInvalid: false,
  isFilled: false,
  showLabel: true,
  label: "Email",
  isRequired: false,
  isOptional: false,
  placeholder: "example@chakraui",
  filledValue: "hello@booksky.blue",
  showLeftElement: true,
  showRightElement: true,
  showHelperText: true,
  helperText: "This is a helper text to help user.",
  errorText: "This is an error text",
};

const meta = {
  title: "Design System/Components/Input",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: defaultArgs,
  argTypes: {
    variant: { control: "select", options: ["outline", "subtle"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    state: { control: "inline-radio", options: ["default", "focus", "disabled"] },
    isInvalid: { control: "boolean" },
    isFilled: { control: "boolean" },
    showLabel: { control: "boolean" },
    label: { control: "text" },
    isRequired: { control: "boolean" },
    isOptional: { control: "boolean" },
    placeholder: { control: "text" },
    filledValue: { control: "text" },
    showLeftElement: { control: "boolean" },
    showRightElement: { control: "boolean" },
    showHelperText: { control: "boolean" },
    helperText: { control: "text" },
    errorText: { control: "text" },
  },
} satisfies Meta<InputStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

function InputPreview(args: InputStoryArgs) {
  const isDisabled = args.state === "disabled";
  const hasFocusStyle = args.state === "focus";

  return (
    <Box minW={{ base: "full", md: "407px" }} maxW="407px">
      <Field.Root invalid={args.isInvalid} required={args.isRequired} disabled={isDisabled}>
        {args.showLabel ? (
          <Field.Label>
            {args.label}
            <Field.RequiredIndicator
              fallback={
                args.isOptional ? (
                  <Badge size="xs" variant="subtle">
                    optional
                  </Badge>
                ) : undefined
              }
            />
          </Field.Label>
        ) : null}

        <InputGroup
          startElement={args.showLeftElement ? "@" : undefined}
          endElement={args.showRightElement ? ".com" : undefined}
        >
          <Input
            variant={args.variant}
            size={args.size}
            placeholder={args.placeholder}
            value={args.isFilled ? args.filledValue : undefined}
            readOnly={args.isFilled}
            disabled={isDisabled}
            css={
              hasFocusStyle
                ? {
                    borderWidth: "2px",
                    borderColor: "interactive.focusRing",
                    boxShadow: "0 0 0 1px var(--chakra-colors-interactive-focusRing)",
                  }
                : undefined
            }
          />
        </InputGroup>

        {args.isInvalid ? <Field.ErrorText>{args.errorText}</Field.ErrorText> : null}
        {!args.isInvalid && args.showHelperText ? (
          <Field.HelperText>{args.helperText}</Field.HelperText>
        ) : null}
      </Field.Root>
    </Box>
  );
}

export const Playground: Story = {
  render: (args) => <InputPreview {...defaultArgs} {...args} />,
};

export const States: Story = {
  render: (args) => (
    <VStack align="stretch" gap="4" minW={{ base: "full", md: "407px" }}>
      <InputPreview {...defaultArgs} {...args} state="default" />
      <InputPreview {...defaultArgs} {...args} state="focus" />
      <InputPreview {...defaultArgs} {...args} state="disabled" />
      <InputPreview {...defaultArgs} {...args} isInvalid state="default" showHelperText={false} />
    </VStack>
  ),
};
