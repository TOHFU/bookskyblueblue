import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorDialog } from "./ErrorDialog";
import { appSystem } from "@/styles/theme";

function renderDialog({
  message,
  isOpen = true,
  onClose = vi.fn(),
}: {
  message?: string;
  isOpen?: boolean;
  onClose?: () => void;
} = {}) {
  render(
    <ChakraProvider value={appSystem}>
      <ErrorDialog message={message} isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>,
  );
  return { onClose };
}

describe("ErrorDialog", () => {
  it("isOpen=true のとき「エラーが発生しました」タイトルが表示される", () => {
    renderDialog();
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });

  it("デフォルトのエラーメッセージが表示される", () => {
    renderDialog();
    expect(screen.getByText("時間を置いて、再度実行してください。")).toBeInTheDocument();
  });

  it("カスタムメッセージが表示される", () => {
    renderDialog({ message: "カスタムエラーメッセージ" });
    expect(screen.getByText("カスタムエラーメッセージ")).toBeInTheDocument();
  });

  it("閉じるボタンが表示される", () => {
    renderDialog();
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });

  it("閉じるボタンクリックで onClose が呼ばれる", async () => {
    const { onClose } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("isOpen=false のときコンテンツが表示されない", () => {
    renderDialog({ isOpen: false });
    expect(screen.queryByText("エラーが発生しました")).not.toBeInTheDocument();
  });
});
