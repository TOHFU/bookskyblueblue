import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

const paletteOrder = [
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

const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const typographyRows: Array<{
  token: string;
  size: string;
  lineHeight: string;
  weight: number;
  letterSpacing?: string;
}> = [
  { token: "xs/font-normal", size: "12px", lineHeight: "16px", weight: 600 },
  { token: "sm/font-normal", size: "14px", lineHeight: "20px", weight: 600 },
  { token: "md/font-normal", size: "16px", lineHeight: "24px", weight: 600 },
  { token: "lg/font-medium", size: "18px", lineHeight: "28px", weight: 700 },
  { token: "xl/font-normal", size: "20px", lineHeight: "30px", weight: 600 },
  { token: "2xl/font-normal", size: "24px", lineHeight: "32px", weight: 600 },
  { token: "3xl/font-normal", size: "30px", lineHeight: "38px", weight: 600 },
  { token: "4xl/font-normal", size: "36px", lineHeight: "44px", weight: 600, letterSpacing: "-1.11%" },
  { token: "5xl/font-normal", size: "48px", lineHeight: "60px", weight: 600, letterSpacing: "-0.83%" },
  { token: "6xl/font-normal", size: "60px", lineHeight: "72px", weight: 600, letterSpacing: "-0.67%" },
  { token: "7xl/font-normal", size: "72px", lineHeight: "92px", weight: 600, letterSpacing: "-0.56%" },
];

const sizeRows = [
  { px: "0px", rem: "0", name: "0" },
  { px: "2px", rem: "0.125rem", name: "0.5" },
  { px: "4px", rem: "0.25rem", name: "1" },
  { px: "6px", rem: "0.375rem", name: "1.5" },
  { px: "8px", rem: "0.5rem", name: "2" },
  { px: "10px", rem: "0.625rem", name: "2.5" },
  { px: "12px", rem: "0.75rem", name: "3" },
  { px: "14px", rem: "0.875rem", name: "3.5" },
  { px: "16px", rem: "1rem", name: "4" },
  { px: "20px", rem: "1.25rem", name: "5" },
  { px: "24px", rem: "1.5rem", name: "6" },
  { px: "28px", rem: "1.75rem", name: "7" },
  { px: "32px", rem: "2rem", name: "8" },
  { px: "36px", rem: "2.25rem", name: "9" },
  { px: "40px", rem: "2.5rem", name: "10" },
  { px: "48px", rem: "3rem", name: "12" },
  { px: "56px", rem: "3.5rem", name: "14" },
  { px: "64px", rem: "4rem", name: "16" },
  { px: "80px", rem: "5rem", name: "20" },
  { px: "96px", rem: "6rem", name: "24" },
  { px: "112px", rem: "7rem", name: "28" },
  { px: "128px", rem: "8rem", name: "32" },
  { px: "144px", rem: "9rem", name: "36" },
  { px: "160px", rem: "10rem", name: "40" },
  { px: "192px", rem: "12rem", name: "48" },
  { px: "224px", rem: "14rem", name: "56" },
  { px: "256px", rem: "16rem", name: "64" },
  { px: "288px", rem: "18rem", name: "72" },
  { px: "320px", rem: "20rem", name: "80" },
  { px: "384px", rem: "24rem", name: "96" },
] as const;

const shadowLight = [
  {
    name: "xs",
    value: "0px 1px 2px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.2)",
  },
  {
    name: "sm",
    value: "0px 2px 4px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)",
  },
  {
    name: "md",
    value: "0px 4px 8px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)",
  },
  {
    name: "lg",
    value: "0px 8px 16px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)",
  },
  {
    name: "xl",
    value: "0px 16px 24px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)",
  },
  {
    name: "2xl",
    value: "0px 24px 40px 0px rgba(24, 24, 27, 0.16), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)",
  },
  { name: "inner", value: "inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05)" },
  { name: "inset", value: "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.05)" },
] as const;

const shadowDark = [
  {
    name: "xs",
    value: "0px 1px 1px 0px rgba(0, 0, 0, 0.64), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.2)",
  },
  {
    name: "sm",
    value: "0px 2px 4px 0px rgba(0, 0, 0, 0.64), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.3)",
  },
  {
    name: "md",
    value: "0px 4px 8px 0px rgba(0, 0, 0, 0.64), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.3)",
  },
  {
    name: "lg",
    value: "0px 8px 16px 0px rgba(24, 24, 27, 0.1), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.3)",
  },
  {
    name: "xl",
    value: "0px 16px 24px 0px rgba(0, 0, 0, 0.64), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.3)",
  },
  {
    name: "2xl",
    value: "0px 24px 40px 0px rgba(0, 0, 0, 0.64), inset 0px 0px 1px 0px rgba(212, 212, 216, 0.3)",
  },
  { name: "inner", value: "inset 0px 2px 4px 0px rgba(0, 0, 0, 1)" },
  { name: "inset", value: "0px 0px 0px 1px rgba(212, 212, 216, 0.05)" },
] as const;

const breakpoints = [
  { name: "sm", min: "480px", frameWidth: "480px", media: "@media screen (min-width >= 480px)" },
  { name: "md", min: "768px", frameWidth: "768px", media: "@media screen (min-width >= 768px)" },
  { name: "lg", min: "992px", frameWidth: "992px", media: "@media screen (min-width >= 1024px)" },
  { name: "xl", min: "1280px", frameWidth: "1280px", media: "@media screen (min-width >= 1280px)" },
  { name: "2xl", min: "1536px", frameWidth: "1536px", media: "@media screen (min-width >= 1536px)" },
] as const;

const radiusRows = [
  { token: "2xs", value: "1px" },
  { token: "xs", value: "2px" },
  { token: "sm", value: "4px" },
  { token: "md", value: "12px" },
  { token: "lg", value: "16px" },
  { token: "xl", value: "24px" },
  { token: "2xl", value: "32px" },
  { token: "3xl", value: "36px" },
  { token: "4xl", value: "40px" },
  { token: "full", value: "9999px" },
] as const;

const semanticRadiusRows = [
  { token: "2xs", alias: "{radii.2xs}" },
  { token: "xs", alias: "{radii.xs}" },
  { token: "sm", alias: "{radii.sm}" },
  { token: "md", alias: "{radii.md}" },
  { token: "lg", alias: "{radii.lg}" },
  { token: "xl", alias: "{radii.xl}" },
  { token: "2xl", alias: "{radii.2xl}" },
  { token: "3xl", alias: "{radii.3xl}" },
  { token: "4xl", alias: "{radii.4xl}" },
  { token: "full", alias: "{radii.full}" },
] as const;

const meta = {
  title: "Design System/Tokens/Theme",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Color: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Color</Heading>
        <Text color="fg.muted">Figma Theme の Global / Semantic color token を表示します。</Text>
      </VStack>

      {paletteOrder.map((palette) => (
        <VStack key={palette} align="stretch" gap="2">
          <Heading size="md" textTransform="capitalize">
            {palette}
          </Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(88px, 1fr))" gap="2">
            {scales.map((scale) => (
              <VStack
                key={`${palette}-${scale}`}
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius="md"
                p="2"
                align="stretch"
              >
                <Box h="10" borderRadius="sm" bg={`${palette}.${scale}`} />
                <Text fontSize="xs" fontWeight="bold">{`${palette}.${scale}`}</Text>
              </VStack>
            ))}
          </Grid>
        </VStack>
      ))}

      <VStack align="start" gap="2" pt="4">
        <Heading size="xl">Semantic Tokens</Heading>
        <HStack wrap="wrap" gap="3">
          {[
            "bg",
            "bg.subtle",
            "bg.muted",
            "bg.emphasized",
            "bg.inverted",
            "bg.error",
            "bg.warning",
            "bg.success",
            "bg.info",
            "fg",
            "fg.muted",
            "fg.subtle",
            "fg.inverted",
            "border",
            "border.subtle",
            "border.muted",
            "border.emphasized",
            "interactive.hover",
            "interactive.active",
            "interactive.disabled",
            "interactive.focusRing",
          ].map((token) => (
            <Badge key={token} bg={token} color="fg.inverted" px="3" py="2" borderRadius="md">
              {token}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </VStack>
  ),
};

export const Typography: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Typography</Heading>
        <Text color="fg.muted">Figma Text Styles（Noto Sans JP）のサイズ・行間・字間を表示します。</Text>
      </VStack>

      <VStack align="stretch" gap="4">
        {typographyRows.map((row) => (
          <Stack
            key={row.token}
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}
            justify="space-between"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="lg"
            p="4"
            gap="3"
          >
            <VStack align="start" gap="0.5">
              <Text fontFamily="Noto Sans JP" fontWeight={row.weight} fontSize={row.size} lineHeight={row.lineHeight} letterSpacing={row.letterSpacing ?? "normal"}>
                In love with Chakra
              </Text>
              <Text color="fg.muted" fontSize="sm">
                {row.token}
              </Text>
            </VStack>
            <VStack align={{ base: "start", md: "end" }} gap="0.5">
              <Text fontSize="sm">size: {row.size}</Text>
              <Text fontSize="sm">line-height: {row.lineHeight}</Text>
              <Text fontSize="sm">weight: {row.weight}</Text>
              <Text fontSize="sm">letter-spacing: {row.letterSpacing ?? "normal"}</Text>
            </VStack>
          </Stack>
        ))}
      </VStack>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Sizes</Heading>
        <Text color="fg.muted">Figma の Size table（Pixels / Value / Name）を表示します。</Text>
      </VStack>

      <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" overflowX="auto">
        <Table.Root size="sm" minW="640px">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Pixels</Table.ColumnHeader>
              <Table.ColumnHeader>Value</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Preview</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sizeRows.map((row) => (
              <Table.Row key={row.name}>
                <Table.Cell>{row.px}</Table.Cell>
                <Table.Cell>{row.rem}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>
                  <Box h="2" borderRadius="full" bg="blue.300" w={row.rem} minW="2" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  ),
};

export const Shadows: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Shadows</Heading>
        <Text color="fg.muted">Figma の Shadows light / dark をそのまま表示します。</Text>
      </VStack>

      <VStack align="stretch" gap="4">
        <Heading size="lg">Shadows light</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="4">
          {shadowLight.map((token) => (
            <Box key={`light-${token.name}`} borderWidth="1px" borderColor="border.subtle" borderRadius="lg" p="4" bg="white" boxShadow={token.value}>
              <Text fontWeight="bold">{token.name}</Text>
              <Text fontSize="xs" color="fg.muted" wordBreak="break-all">
                {token.value}
              </Text>
            </Box>
          ))}
        </Grid>
      </VStack>

      <VStack align="stretch" gap="4">
        <Heading size="lg">Shadows dark</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="4">
          {shadowDark.map((token) => (
            <Box key={`dark-${token.name}`} borderWidth="1px" borderColor="gray.700" borderRadius="lg" p="4" bg="gray.900" color="gray.100" boxShadow={token.value}>
              <Text fontWeight="bold">{token.name}</Text>
              <Text fontSize="xs" color="gray.300" wordBreak="break-all">
                {token.value}
              </Text>
            </Box>
          ))}
        </Grid>
      </VStack>
    </VStack>
  ),
};

export const BreakingPoint: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Breaking point</Heading>
        <Text color="fg.muted">Figma 定義のブレークポイントを表示します。</Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="4">
        {breakpoints.map((bp) => (
          <VStack key={bp.name} align="stretch" gap="2" borderWidth="1px" borderColor="border.subtle" borderRadius="lg" p="4">
            <HStack justify="space-between">
              <Heading size="md">{bp.name}</Heading>
              <Badge variant="subtle">min {bp.min}</Badge>
            </HStack>
            <Text fontSize="sm" color="fg.muted">
              frame width: {bp.frameWidth}
            </Text>
            <Text fontSize="xs" color="fg.muted" wordBreak="break-all">
              {bp.media}
            </Text>
            <Box h="2" borderRadius="full" bg="blue.300" w={`${Math.max(20, Math.round(Number.parseInt(bp.min, 10) / 12))}%`} />
          </VStack>
        ))}
      </Grid>

    </VStack>
  ),
};

export const Radius: Story = {
  render: () => (
    <VStack align="stretch" gap="8" p={{ base: "4", md: "8" }}>
      <VStack align="start" gap="2">
        <Heading size="2xl">Radius</Heading>
        <Text color="fg.muted">Figma Variables の Radius token と semantic alias を表示します。</Text>
      </VStack>

      <VStack align="stretch" gap="4">
        <Heading size="lg">Global Radius Tokens</Heading>
        <Grid templateColumns={{ base: "repeat(2, minmax(0, 1fr))", md: "repeat(5, minmax(0, 1fr))" }} gap="3">
          {radiusRows.map((radius) => (
            <VStack
              key={radius.token}
              align="stretch"
              borderWidth="1px"
              borderColor="border.subtle"
              borderRadius="lg"
              p="3"
              gap="2"
            >
              <Box h="14" bg="blue.200" borderRadius={radius.value} borderWidth="1px" borderColor="blue.500" />
              <Text fontWeight="bold" fontSize="sm">
                {radius.token}
              </Text>
              <Text fontSize="xs" color="fg.muted">
                {radius.value}
              </Text>
            </VStack>
          ))}
        </Grid>
      </VStack>

      <VStack align="stretch" gap="3">
        <Heading size="lg">Semantic Radius Tokens</Heading>
        <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" overflowX="auto">
          <Table.Root size="sm" minW="520px">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Semantic Token</Table.ColumnHeader>
                <Table.ColumnHeader>Alias</Table.ColumnHeader>
                <Table.ColumnHeader>Preview</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {semanticRadiusRows.map((row) => (
                <Table.Row key={row.token}>
                  <Table.Cell>{row.token}</Table.Cell>
                  <Table.Cell>{row.alias}</Table.Cell>
                  <Table.Cell>
                    <Box w="16" h="8" bg="cyan.200" borderWidth="1px" borderColor="cyan.700" borderRadius={row.token === "full" ? "9999px" : radiusRows.find((r) => r.token === row.token)?.value} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </VStack>
    </VStack>
  ),
};
