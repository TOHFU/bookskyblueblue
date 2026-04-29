import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookCardActionButtons } from "./BookCardActionButtons";
import { appSystem } from "@/styles/theme";
import type { Work } from "@/domain/entities/work";

const work: Work = { id: "1", title: "テスト作品" };

function renderButtons(props: Partial<React.ComponentProps<typeof BookCardActionButtons>> = {}) {
  render(
    <ChakraProvider value={appSystem}>
      <BookCardActionButtons
        work={work}
        showDeleteButton={false}
        showDetailButton={true}
        {...props}
      />
    </ChakraProvider>,
  );
}

describe("BookCardActionButtons", () => {
  it("showDetailButton=true のとき詳細ボタンが表示される", () => {
    renderButtons({ showDetailButton: true });
    expect(screen.getByRole("button", { name: "詳細を見る" })).toBeInTheDocument();
  });

  it("showDetailButton=false のとき詳細ボタンが非表示", () => {
    renderButtons({ showDetailButton: false });
    expect(screen.queryByRole("button", { name: "詳細を見る" })).not.toBeInTheDocument();
  });

  it("showDeleteButton=true のとき削除ボタンが表示される", () => {
    renderButtons({ showDeleteButton: true });
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("showDeleteButton=false のとき削除ボタンが非表示", () => {
    renderButtons({ showDeleteButton: false });
    expect(screen.queryByRole("button", { name: "削除" })).not.toBeInTheDocument();
  });

  it("詳細ボタンクリックで onDetail が呼ばれる", async () => {
    const onDetail = vi.fn();
    renderButtons({ showDetailButton: true, onDetail });
    await userEvent.click(screen.getByRole("button", { name: "詳細を見る" }));
    expect(onDetail).toHaveBeenCalledWith(work);
  });

  it("削除ボタンクリックで onDelete が呼ばれる", async () => {
    const onDelete = vi.fn();
    renderButtons({ showDeleteButton: true, onDelete });
    await userEvent.click(screen.getByRole("button", { name: "削除" }));
    expect(onDelete).toHaveBeenCalledWith(work);
  });
});
