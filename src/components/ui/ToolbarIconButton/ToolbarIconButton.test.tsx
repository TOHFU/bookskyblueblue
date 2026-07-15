import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToolbarIconButton } from "./ToolbarIconButton";
import { appSystem } from "@/styles/theme";

describe("ToolbarIconButton", () => {
  it("ラベル付きボタンとして描画する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <ToolbarIconButton aria-label="ヘルプを開く" onClick={vi.fn()}>
          ?
        </ToolbarIconButton>
      </ChakraProvider>,
    );
    expect(
      screen.getByRole("button", { name: "ヘルプを開く" }),
    ).toBeInTheDocument();
  });

  it("クリックで onClick を呼ぶ", async () => {
    const onClick = vi.fn();
    render(
      <ChakraProvider value={appSystem}>
        <ToolbarIconButton aria-label="検索画面へ移動" onClick={onClick}>
          S
        </ToolbarIconButton>
      </ChakraProvider>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "検索画面へ移動" }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });
});
