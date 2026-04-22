"use client";

import { Button, Dialog, Portal, Text } from "@chakra-ui/react";

type ErrorDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function ErrorDialog({
  open,
  title = "エラーが発生しました",
  message,
  onClose,
}: ErrorDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(event) => !event.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{message}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={onClose}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
