"use client";

import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

export function ErrorDialogDemoScreen() {
  const [open, setOpen] = useState(true);

  return (
    <VStack as="main" align="start" gap="4" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }}>
      <Heading size="2xl">ERROR DIALOG</Heading>
      <Text>エラー表示の確認用画面です。</Text>
      <Button onClick={() => setOpen(true)}>エラーを表示</Button>
      <ErrorDialog open={open} message="予期しないエラーが発生しました。時間をおいて再試行してください。" onClose={() => setOpen(false)} />
    </VStack>
  );
}
