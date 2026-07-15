"use client";

import { Button, Text } from "@chakra-ui/react";
import { AppDialog } from "@/components/ui/AppDialog";

type ErrorDialogProps = {
  message?: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ErrorDialog({
  message = "時間を置いて、再度実行してください。",
  isOpen,
  onClose,
}: ErrorDialogProps) {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="エラーが発生しました"
      footer={
        <Button
          variant="solid"
          size="md"
          bg="gray.900"
          color="fg.inverted"
          px="4"
          h="10"
          onClick={onClose}
          fontSize="xs"
        >
          閉じる
        </Button>
      }
    >
      <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg.muted">
        {message}
      </Text>
    </AppDialog>
  );
}
