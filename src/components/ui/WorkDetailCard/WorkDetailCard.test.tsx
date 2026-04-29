import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkDetailCard } from "./WorkDetailCard";
import { appSystem } from "@/styles/theme";
import type { Work } from "@/domain/entities/work";

const mockWork: Work = {
  id: "123",
  title: "坊っちゃん",
  subtitle: "サブタイトル",
  author: "夏目漱石",
  firstPublishedYear: "1906年",
  writingStyle: "新字新仮名",
  publisher: "岩波書店",
  sourceBookName: "坊っちゃん 底本名",
};

function renderCard(work = mockWork, onDownload = vi.fn()) {
  render(
    <ChakraProvider value={appSystem}>
      <WorkDetailCard work={work} onDownload={onDownload} />
    </ChakraProvider>,
  );
  return { onDownload };
}

describe("WorkDetailCard", () => {
  it("作品IDが表示される", () => {
    renderCard();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("タイトルが表示される", () => {
    renderCard();
    expect(screen.getByText("坊っちゃん")).toBeInTheDocument();
  });

  it("著者名が表示される", () => {
    renderCard();
    expect(screen.getByText("夏目漱石")).toBeInTheDocument();
  });

  it("文字遣いバッジが表示される", () => {
    renderCard();
    expect(screen.getByText("新字新仮名")).toBeInTheDocument();
  });

  it("出版社バッジが表示される", () => {
    renderCard();
    expect(screen.getByText("岩波書店")).toBeInTheDocument();
  });

  it("ダウンロードボタンが表示される", () => {
    renderCard();
    expect(screen.getByRole("button", { name: "この作品をダウンロードする" })).toBeInTheDocument();
  });

  it("ダウンロードボタンクリックで onDownload が作品オブジェクトと共に呼ばれる", async () => {
    const { onDownload } = renderCard();
    await userEvent.click(screen.getByRole("button", { name: "この作品をダウンロードする" }));
    expect(onDownload).toHaveBeenCalledWith(mockWork);
  });
});
