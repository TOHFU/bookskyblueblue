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
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              aria-label="ダイアログを閉じる"
              asChild
            >
              <Button variant="ghost" size="md" p="0" minW="40px" h="40px">
                ✕
              </Button>
            </Dialog.CloseTrigger>

            {/* ヘッダー */}
            <Dialog.Header px="24px" pt="24px" pb="16px">
              <Dialog.Title
                fontFamily="'Noto Sans JP', sans-serif"
                fontSize="18px"
                fontWeight="400"
                lineHeight="28px"
                color="#012639"
              >
                エラーが発生しました
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
                {message}
              </Text>
            </Dialog.Body>

            {/* フッター */}
            <Dialog.Footer px="24px" pt="8px" pb="16px">
              <Flex justify="flex-end" align="center" w="full">
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
