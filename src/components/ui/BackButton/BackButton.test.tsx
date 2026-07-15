import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BackButton } from "./BackButton";
import { appSystem } from "@/styles/theme";

describe("BackButton", () => {
  it("アクセシブルネーム付きで表示する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <BackButton aria-label="検索結果に戻る" onClick={vi.fn()} />
      </ChakraProvider>,
    );
    expect(
      screen.getByRole("button", { name: "検索結果に戻る" }),
    ).toBeInTheDocument();
  });

  it("クリックで onClick を呼ぶ", async () => {
    const onClick = vi.fn();
    render(
      <ChakraProvider value={appSystem}>
        <BackButton aria-label="前の画面に戻る" onClick={onClick} />
      </ChakraProvider>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "前の画面に戻る" }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });
});
