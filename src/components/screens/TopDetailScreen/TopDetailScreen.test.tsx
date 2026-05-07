import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopDetailScreen } from "./TopDetailScreen";
import { appSystem } from "@/styles/theme";
import type { Bookmark, Work } from "@/domain/entities/work";

const mockHandleBack = vi.fn();
const mockHandleClose = vi.fn();
const mockHandleRead = vi.fn();
const mockHandleOpenBookmark = vi.fn();

const mockWork: Work = {
  id: "36785",
  title: "走れメロス",
  subtitle: "サブタイトル",
  originalTitle: "HASIRE MEROS",
  author: "太宰治",
  firstPublishedYear: "1988（昭和63）年10月25日",
  writingStyle: "新字新仮名",
  publisher: "筑摩書房",
  sourceBookName: "太宰治全集3",
};

const mockBookmarks: Bookmark[] = [
  {
    page: 24,
    excerpt: "メロスは、それゆえ、花嫁の衣裳やら祝宴の御馳走やらを買いに、はしった。",
  },
  {
    page: 40,
    excerpt: "セリヌンティウスは、縄打たれたまま、微笑していた。",
  },
];

vi.mock("@/hooks/screens/useTopDetailScreen", () => ({
  useTopDetailScreen: vi.fn(() => ({
    work: mockWork,
    progress: { page: 24, totalPages: 80 },
    bookmarks: mockBookmarks,
    isLoading: false,
    handleBack: mockHandleBack,
    handleClose: mockHandleClose,
    handleRead: mockHandleRead,
    handleOpenBookmark: mockHandleOpenBookmark,
  })),
}));

function renderScreen() {
  render(
    <ChakraProvider value={appSystem}>
      <TopDetailScreen identifier="36785" />
    </ChakraProvider>
  );
}

describe("TopDetailScreen", () => {
  beforeEach(() => {
    mockHandleBack.mockClear();
    mockHandleClose.mockClear();
    mockHandleRead.mockClear();
    mockHandleOpenBookmark.mockClear();
  });

  it("BACKボタンが表示される", () => {
    renderScreen();
    expect(screen.getByRole("button", { name: "前の画面に戻る" })).toBeInTheDocument();
  });

  it("作品詳細と進行ページ数が表示される", () => {
    renderScreen();
    expect(screen.getByText("走れメロス")).toBeInTheDocument();
    expect(screen.getAllByText("25ページ")).toHaveLength(2);
  });

  it("ブックマークリストが表示される", () => {
    renderScreen();
    expect(screen.getByText("メロスは、それゆえ、花嫁の衣裳やら祝宴の御馳走やらを買いに、はしった。")).toBeInTheDocument();
    expect(screen.getByText("セリヌンティウスは、縄打たれたまま、微笑していた。")).toBeInTheDocument();
  });

  it("BACKボタン押下でTOPへ戻る処理が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "前の画面に戻る" }));
    expect(mockHandleBack).toHaveBeenCalled();
  });

  it("Closeボタン押下でTOPへ戻る処理が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("READボタン押下で本文表示処理が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "本文を読む" }));
    expect(mockHandleRead).toHaveBeenCalled();
  });

  it("ブックマークリスト押下で該当ページを開く処理が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "25ページのブックマークを開く" }));
    expect(mockHandleOpenBookmark).toHaveBeenCalledWith(24);
  });
});