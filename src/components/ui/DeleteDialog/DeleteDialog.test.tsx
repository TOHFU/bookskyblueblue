import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteDialog } from "./DeleteDialog";
import { appSystem } from "@/styles/theme";
import type { Work } from "@/domain/entities/work";

const mockWork: Work = {
  id: "456",
  title: "吾輩は猫である",
  author: "夏目漱石",
};

function renderDialog({
  work = mockWork,
  isOpen = true,
  onClose = vi.fn(),
  onConfirm = vi.fn(),
} = {}) {
  render(
    <ChakraProvider value={appSystem}>
      <DeleteDialog work={work} isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} />
    </ChakraProvider>,
  );
  return { onClose, onConfirm };
}

describe("DeleteDialog", () => {
  it("isOpen=true のとき「作品の削除」タイトルが表示される", () => {
    renderDialog();
    expect(screen.getByText("作品の削除")).toBeInTheDocument();
  });

  it("作品名を含む確認メッセージが表示される", () => {
    renderDialog();
    expect(screen.getByText("吾輩は猫である を削除してもよろしいですか？")).toBeInTheDocument();
  });

  it("キャンセルボタンが表示される", () => {
    renderDialog();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });

  it("削除ボタンが表示される", () => {
    renderDialog();
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("キャンセルボタンクリックで onClose が呼ばれる", async () => {
    const { onClose } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("削除ボタンクリックで onConfirm が作品オブジェクトと共に呼ばれる", async () => {
    const { onConfirm } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "削除" }));
    expect(onConfirm).toHaveBeenCalledWith(mockWork);
  });

  it("isOpen=false のときコンテンツが表示されない", () => {
    renderDialog({ isOpen: false });
    expect(screen.queryByText("作品の削除")).not.toBeInTheDocument();
  });
});
