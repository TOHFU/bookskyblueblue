"use client";

import {
  Button,
  Dialog,
  Flex,
  Portal,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

type AppDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * DeleteDialog / ErrorDialog 共通のダイアログシェル。
 * 見た目・閉じる操作・ポータル配置を一箇所に集約する。
 */
export function AppDialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: AppDialogProps) {
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

            <Dialog.Header px="6" pt="6" pb="4">
              <Dialog.Title
                fontSize="md"
                fontWeight="400"
                lineHeight="7"
                color="fg"
              >
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body px="6" pt="2" pb="4">
              {children}
            </Dialog.Body>

            <Dialog.Footer px="6" pt="2" pb="4">
              <Flex justify="flex-end" align="center" gap="3" w="full">
                {footer}
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
