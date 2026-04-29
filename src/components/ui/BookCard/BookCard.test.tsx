import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookCard } from "./BookCard";
import { appSystem } from "@/styles/theme";
import type { Work } from "@/domain/entities/work";

const work: Work = {
  id: "work-1",
  title: "テスト作品",
  author: "著者",
};

function renderBookCard(overrides?: { readingPage?: number; totalPages?: number }) {
  const onDetail = vi.fn();

  render(
    <ChakraProvider value={appSystem}>
      <BookCard work={work} onDetail={onDetail} {...overrides} />
    </ChakraProvider>,
  );

  return {
    article: screen.getByLabelText("作品: テスト作品"),
    onDetail,
  };
}

describe("BookCard", () => {
  it("touchstartで右下に移動しtouchendで元に戻る", () => {
    const { article } = renderBookCard();

    expect(article).toHaveStyle({ transform: "translate(0, 0)" });

    fireEvent.touchStart(article);
    expect(article).toHaveStyle({ transform: "translate(4px, 4px)" });

    fireEvent.touchEnd(article);
    expect(article).toHaveStyle({ transform: "translate(0, 0)" });
  });

  it("mousedownで右下に移動しmouseupで元に戻る", () => {
    const { article } = renderBookCard();

    fireEvent.mouseDown(article);
    expect(article).toHaveStyle({ transform: "translate(4px, 4px)" });

    fireEvent.mouseUp(article);
    expect(article).toHaveStyle({ transform: "translate(0, 0)" });
  });

  it("readingPageが未定義のとき進行ページ数テキストを表示しない", () => {
    renderBookCard();
    expect(screen.queryByText("未読")).not.toBeInTheDocument();
    expect(screen.queryByText("読了")).not.toBeInTheDocument();
  });

  it("readingPage=0のとき「未読」と表示する", () => {
    renderBookCard({ readingPage: 0, totalPages: 10 });
    expect(screen.getByText("未読")).toBeInTheDocument();
  });

  it("readingPageが最終ページのとき「読了」と表示する", () => {
    renderBookCard({ readingPage: 9, totalPages: 10 });
    expect(screen.getByText("読了")).toBeInTheDocument();
  });

  it("途中ページのとき「Xページ」と表示する", () => {
    renderBookCard({ readingPage: 4, totalPages: 10 });
    expect(screen.getByText("5ページ")).toBeInTheDocument();
  });
});
