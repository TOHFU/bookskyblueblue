"use client";

import {
  Button,
  Dialog,
  Flex,
  Text,
  Portal,
} from "@chakra-ui/react";

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
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            borderRadius="0"
            boxShadow="0px 8px 16px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)"
            w="327px"
            position="relative"
          >
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
              <Button variant="ghost" size="md" p="0" minW="10" h="10">
                ✕
              </Button>
            </Dialog.CloseTrigger>

            {/* ヘッダー */}
            <Dialog.Header px="6" pt="6" pb="4">
              <Dialog.Title
                fontSize="md"
                fontWeight="400"
                lineHeight="7"
                color="fg"
              >
                エラーが発生しました
              </Dialog.Title>
            </Dialog.Header>

            {/* ボディ */}
            <Dialog.Body px="6" pt="2" pb="4">
              <Text
                fontSize="xs"
                fontWeight="600"
                lineHeight="5"
                color="fg.muted"
              >
                {message}
              </Text>
            </Dialog.Body>

            {/* フッター */}
            <Dialog.Footer px="6" pt="2" pb="4">
              <Flex justify="flex-end" align="center" w="full">
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
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
