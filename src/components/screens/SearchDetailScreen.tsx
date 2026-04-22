import type { Work } from "@/domain/entities/work";
import { Button, Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

type SearchDetailScreenProps = {
  identifier: string;
  work: Work;
};

export function SearchDetailScreen({ identifier, work }: SearchDetailScreenProps) {
  return (
    <VStack as="main" align="stretch" gap="6" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }}>
      <HStack justify="space-between" align="start">
        <VStack align="start" gap="1">
          <Heading size="2xl">SEARCH DETAIL</Heading>
          <Text color="fg.muted">作品の詳細情報</Text>
        </VStack>
        <Button asChild variant="outline">
          <Link href="/">Close</Link>
        </Button>
      </HStack>

      <Card.Root>
        <Card.Body>
          <VStack align="start" gap="2">
            <Heading size="lg">{work.title || "タイトル未設定"}</Heading>
            <Text>作品ID: {identifier}</Text>
            <Text>サブタイトル: {work.subtitle || "-"}</Text>
            <Text>オリジナルタイトル: {work.originalTitle || "-"}</Text>
            <Text>著者名: {work.author || "-"}</Text>
            <Text>底本初版発行年: {work.firstPublishedYear || "-"}</Text>
            <Text>文字遣い種別: {work.writingStyle || "-"}</Text>
            <Text>底本親本出版社: {work.publisher || "-"}</Text>
            <Text>底本名: {work.sourceBookName || "-"}</Text>
          </VStack>
        </Card.Body>
        <Card.Footer>
          <HStack>
            <Button asChild variant="outline">
              <Link href="/search">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/download/${encodeURIComponent(identifier)}`}>ダウンロード</Link>
            </Button>
          </HStack>
        </Card.Footer>
      </Card.Root>
    </VStack>
  );
}
