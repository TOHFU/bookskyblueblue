import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToolbarCloseButton } from "./ToolbarCloseButton";
import { appSystem } from "@/styles/theme";

describe("ToolbarCloseButton", () => {
  it("TOPに戻るボタンを表示する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <ToolbarCloseButton onClick={vi.fn()} />
      </ChakraProvider>,
    );
    expect(screen.getByRole("button", { name: "TOPに戻る" })).toBeInTheDocument();
  });

  it("クリックで onClick を呼ぶ", async () => {
    const onClick = vi.fn();
    render(
      <ChakraProvider value={appSystem}>
        <ToolbarCloseButton onClick={onClick} />
      </ChakraProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "TOPに戻る" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
