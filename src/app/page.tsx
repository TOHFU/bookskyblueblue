import { Box, Heading, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Box as="main" px={6} py={10}>
      <Heading as="h1" size="3xl" mb={4}>
        Book Sky, Blue Blue
      </Heading>
      <Text fontSize="lg">初期設定が完了しました。次に検索画面や一覧画面を実装していきます。</Text>
    </Box>
  );
}
