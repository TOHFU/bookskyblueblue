"use client";

import { deleteSavedWork, listSavedWorks } from "@/data/repositories/savedWorkRepository";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { Button, Card, Dialog, Grid, Heading, HStack, Portal, Spinner, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SavedWork = {
  identifier: string;
  title?: string;
  author?: string;
  firstPublishedYear?: string;
  writingStyle?: string;
  publisher?: string;
};

export function TopScreen() {
  const [works, setWorks] = useState<SavedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SavedWork | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void refresh();
  }, []);

  const isEmpty = useMemo(() => !loading && works.length === 0, [loading, works.length]);

  async function refresh() {
    try {
      setLoading(true);
      const result = await listSavedWorks();
      setWorks(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "保存済み作品の読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteSavedWork(deleteTarget.identifier);
      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "削除に失敗しました。");
    }
  }

  return (
    <VStack as="main" align="stretch" gap="6" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }}>
      <HStack justify="space-between" align="start">
        <VStack align="start" gap="1">
          <Heading size="2xl">TOP</Heading>
          <Text color="fg.muted">保存済みの作品一覧</Text>
        </VStack>
        <Button asChild variant="solid">
          <Link href="/search">検索する</Link>
        </Button>
      </HStack>

      {loading ? (
        <VStack py="12">
          <Spinner size="lg" />
          <Text>読み込み中...</Text>
        </VStack>
      ) : null}

      {isEmpty ? <TopEmptyState /> : null}

      {!loading && !isEmpty ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="4">
          {works.map((work) => (
            <Card.Root key={work.identifier} variant="outline">
              <Card.Body>
                <VStack align="start" gap="2">
                  <Card.Title>{work.title || "タイトル未設定"}</Card.Title>
                  <Text fontSize="sm">著者: {work.author || "不明"}</Text>
                  <Text fontSize="sm">底本初版発行年: {work.firstPublishedYear || "不明"}</Text>
                  <Text fontSize="sm">文字遣い種別: {work.writingStyle || "不明"}</Text>
                  <Text fontSize="sm">底本親本出版社: {work.publisher || "不明"}</Text>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <HStack>
                  <Button variant="outline" onClick={() => setDeleteTarget(work)}>
                    削除
                  </Button>
                  <Button asChild>
                    <Link href={`/book/${encodeURIComponent(work.identifier)}`}>詳細</Link>
                  </Button>
                </HStack>
              </Card.Footer>
            </Card.Root>
          ))}
        </Grid>
      ) : null}

      <Dialog.Root open={Boolean(deleteTarget)} onOpenChange={(event) => !event.open && setDeleteTarget(null)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>TOP-DELETE DIALOG</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  「{deleteTarget?.title || "この作品"}」を削除しますか？
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  キャンセル
                </Button>
                <Button colorPalette="red" onClick={confirmDelete}>
                  削除する
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <ErrorDialog
        open={Boolean(errorMessage)}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </VStack>
  );
}

function TopEmptyState() {
  return (
    <Card.Root variant="subtle">
      <Card.Body>
        <VStack align="start" gap="2">
          <Heading size="lg">TOP-EMPTYSTATE</Heading>
          <Text>保存された作品がありません。</Text>
          <Text color="fg.muted">まずは検索画面から作品を探して保存してください。</Text>
        </VStack>
      </Card.Body>
      <Card.Footer>
        <Button asChild>
          <Link href="/search">検索画面へ</Link>
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
