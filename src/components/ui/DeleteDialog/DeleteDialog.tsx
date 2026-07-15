"use client";

import { Button, Text } from "@chakra-ui/react";
import type { Work } from "@/domain/entities/work";
import { AppDialog } from "@/components/ui/AppDialog";

type DeleteDialogProps = {
  work: Work | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (work: Work) => void;
};

export function DeleteDialog({
  work,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="作品の削除"
      footer={
        work ? (
          <>
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
              キャンセル
            </Button>
            <Button
              variant="solid"
              size="md"
              bg="pink.600"
              color="fg.inverted"
              px="4"
              h="10"
              onClick={() => onConfirm(work)}
              fontSize="xs"
            >
              削除
            </Button>
          </>
        ) : null
      }
    >
      {work ? (
        <Text fontSize="xs" fontWeight="600" lineHeight="5" color="fg.muted">
          {work.title} を削除してもよろしいですか？
        </Text>
      ) : null}
    </AppDialog>
  );
}
