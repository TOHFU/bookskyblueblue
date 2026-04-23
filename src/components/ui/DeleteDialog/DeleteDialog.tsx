"use client";

import {
  Box,
  Button,
  Dialog,
  Flex,
  Text,
  Portal,
} from "@chakra-ui/react";
import type { Work } from "@/domain/entities/work";

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
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        {/* バックドロップ */}
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            borderRadius="0"
            boxShadow="0px 8px 16px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)"
            w="327px"
            position="relative"
          >
            {work && (
              <>
                {/* 閉じるボタン */}
                <Dialog.CloseTrigger
                  position="absolute"
                  top="0"
                  right="0"
                  w="10"
                  h="10"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  aria-label="ダイアログを閉じる"
                  asChild
                >
                  <Button
                    variant="ghost"
                    size="md"
                    p="0"
                    minW="10"
                    h="10"
                  >
                    ✕
                  </Button>
                </Dialog.CloseTrigger>

                {/* ヘッダー */}
                <Dialog.Header
                  px="6"
                  pt="6"
                  pb="4"
                >
                  <Dialog.Title
                    fontSize="md"
                    fontWeight="400"
                    lineHeight="28px"
                    color="fg"
                  >
                    作品の削除
                  </Dialog.Title>
                </Dialog.Header>

                {/* ボディ */}
                <Dialog.Body px="6" pt="2" pb="4">
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    lineHeight="20px"
                    color="fg.muted"
                  >
                    {work.title} を削除してもよろしいですか？
                  </Text>
                </Dialog.Body>

                {/* フッター */}
                <Dialog.Footer px="6" pt="2" pb="4">
                  <Flex justify="flex-end" align="center" gap="3" w="full">
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
                  </Flex>
                </Dialog.Footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
