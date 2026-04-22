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
                  w="40px"
                  h="40px"
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
                    minW="40px"
                    h="40px"
                  >
                    ✕
                  </Button>
                </Dialog.CloseTrigger>

                {/* ヘッダー */}
                <Dialog.Header
                  px="24px"
                  pt="24px"
                  pb="16px"
                >
                  <Dialog.Title
                    fontFamily="'Noto Sans JP', sans-serif"
                    fontSize="18px"
                    fontWeight="400"
                    lineHeight="28px"
                    color="#012639"
                  >
                    作品の削除
                  </Dialog.Title>
                </Dialog.Header>

                {/* ボディ */}
                <Dialog.Body px="24px" pt="8px" pb="16px">
                  <Text
                    fontFamily="'Noto Sans JP', sans-serif"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px"
                    color="#134152"
                  >
                    {work.title} を削除してもよろしいですか？
                  </Text>
                </Dialog.Body>

                {/* フッター */}
                <Dialog.Footer px="24px" pt="8px" pb="16px">
                  <Flex justify="flex-end" align="center" gap="12px" w="full">
                    <Button
                      variant="solid"
                      size="md"
                      bg="#18181B"
                      color="white"
                      px="16px"
                      h="40px"
                      onClick={onClose}
                      fontFamily="'Noto Sans JP', sans-serif"
                      fontSize="14px"
                    >
                      キャンセル
                    </Button>
                    <Button
                      variant="solid"
                      size="md"
                      bg="pink.600"
                      color="white"
                      px="16px"
                      h="40px"
                      onClick={() => onConfirm(work)}
                      fontFamily="'Noto Sans JP', sans-serif"
                      fontSize="14px"
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
