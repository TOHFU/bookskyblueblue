import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchDetailScreen } from "./SearchDetailScreen";
import { appSystem } from "@/styles/theme";
import type { Work } from "@/domain/entities/work";

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: vi.fn(),
  }),
}));

const mockWork: Work = {
  id: "789",
  title: "羅生門",
  author: "芥川龍之介",
};

function renderScreen(work = mockWork) {
  render(
    <ChakraProvider value={appSystem}>
      <SearchDetailScreen work={work} />
    </ChakraProvider>,
  );
}

describe("SearchDetailScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it("BACKボタンが表示される", () => {
    renderScreen();
    expect(screen.getByRole("button", { name: "検索結果に戻る" })).toBeInTheDocument();
  });

  it("TOPに戻るボタンが表示される", () => {
    renderScreen();
    expect(screen.getByRole("button", { name: "TOPに戻る" })).toBeInTheDocument();
  });

  it("作品タイトルが表示される", () => {
    renderScreen();
    expect(screen.getByText("羅生門")).toBeInTheDocument();
  });

  it("BACKボタンクリックで router.back() が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "検索結果に戻る" }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("TOPに戻るボタンクリックで router.push('/') が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("ダウンロードボタンクリックで router.push('/download/:id') が呼ばれる", async () => {
    renderScreen();
    await userEvent.click(screen.getByRole("button", { name: "この作品をダウンロードする" }));
    expect(mockPush).toHaveBeenCalledWith("/download/789");
  });
});
