import { ChakraProvider, Button, Text } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppDialog } from "./AppDialog";
import { appSystem } from "@/styles/theme";

function renderDialog({
  isOpen = true,
  onClose = vi.fn(),
}: {
  isOpen?: boolean;
  onClose?: () => void;
} = {}) {
  render(
    <ChakraProvider value={appSystem}>
      <AppDialog
        isOpen={isOpen}
        onClose={onClose}
        title="共通ダイアログ"
        footer={<Button onClick={onClose}>閉じる</Button>}
      >
        <Text>本文</Text>
      </AppDialog>
    </ChakraProvider>,
  );
  return { onClose };
}

describe("AppDialog", () => {
  it("タイトルと本文を表示する", () => {
    renderDialog();
    expect(screen.getByText("共通ダイアログ")).toBeInTheDocument();
    expect(screen.getByText("本文")).toBeInTheDocument();
  });

  it("閉じるトリガーにアクセシブルな名前がある", () => {
    renderDialog();
    expect(
      screen.getByRole("button", { name: "ダイアログを閉じる" }),
    ).toBeInTheDocument();
  });

  it("フッター操作で onClose が呼ばれる", async () => {
    const { onClose } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("isOpen=false のときコンテンツが表示されない", () => {
    renderDialog({ isOpen: false });
    expect(screen.queryByText("共通ダイアログ")).not.toBeInTheDocument();
  });
});
