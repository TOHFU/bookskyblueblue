"use client";

import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { Button, Card, Heading, HStack, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type SearchWork = {
  identifier: string;
  title?: string;
  author?: string;
  firstPublishedYear?: string;
  writingStyle?: string;
  publisher?: string;
};

type SearchResponse = {
  items: SearchWork[];
  total: number;
  hasMore: boolean;
  nextOffset: number;
};

const SAMPLE_TERMS = ["夏目漱石", "太宰治", "青空文庫", "芥川龍之介"] as const;

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchWork[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEmpty = useMemo(() => !loading && items.length === 0, [items.length, loading]);

  const runSearch = useCallback(async (nextQuery: string, nextOffset: number, append: boolean) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: nextQuery,
        offset: String(nextOffset),
        limit: "10",
      });

      const response = await fetch(`/api/works?${params.toString()}`);
      if (!response.ok) {
        throw new Error("検索に失敗しました。");
      }

      const payload = (await response.json()) as SearchResponse;
      setItems((current) => (append ? [...current, ...payload.items] : payload.items));
      setHasMore(payload.hasMore);
      setOffset(payload.nextOffset);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "検索中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runSearch(query, 0, false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  return (
    <VStack as="main" align="stretch" gap="5" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }}>
      <HStack justify="space-between" align="start">
        <VStack align="start" gap="1">
          <Heading size="2xl">SEARCH</Heading>
          <Text color="fg.muted">作品名・著者名などで検索</Text>
        </VStack>
        <Button asChild variant="outline">
          <Link href="/">Close</Link>
        </Button>
      </HStack>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="作品名 / 著者名 / 出版社などを入力"
      />

      {isEmpty ? (
        <SearchEmptyState onPickSample={(term) => setQuery(term)} />
      ) : (
        <VStack align="stretch" gap="4">
          {items.map((item) => (
            <Card.Root key={item.identifier} variant="outline">
              <Card.Body>
                <VStack align="start" gap="1.5">
                  <Card.Title>{item.title || "タイトル未設定"}</Card.Title>
                  <Text fontSize="sm">著者: {item.author || "不明"}</Text>
                  <Text fontSize="sm">底本初版発行年: {item.firstPublishedYear || "不明"}</Text>
                  <Text fontSize="sm">文字遣い種別: {item.writingStyle || "不明"}</Text>
                  <Text fontSize="sm">底本親本出版社: {item.publisher || "不明"}</Text>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <Button asChild>
                  <Link href={`/search/detail/${encodeURIComponent(item.identifier)}`}>作品詳細</Link>
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </VStack>
      )}

      {loading ? (
        <HStack justify="center" py="2">
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      ) : null}

      {!loading && hasMore ? (
        <HStack justify="center">
          <Button onClick={() => void runSearch(query, offset, true)}>追加で10件読み込む</Button>
        </HStack>
      ) : null}

      <ErrorDialog
        open={Boolean(errorMessage)}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </VStack>
  );
}

function SearchEmptyState(props: { onPickSample: (term: string) => void }) {
  return (
    <Card.Root variant="subtle">
      <Card.Body>
        <VStack align="start" gap="2">
          <Heading size="lg">SEARCH-EMPTYSTATE</Heading>
          <Text>検索条件に一致する作品が見つかりませんでした。</Text>
          <Text color="fg.muted">サンプルの検索語を試してください。</Text>
          <HStack wrap="wrap" gap="2">
            {SAMPLE_TERMS.map((term) => (
              <Button key={term} size="sm" variant="outline" onClick={() => props.onPickSample(term)}>
                {term}
              </Button>
            ))}
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
