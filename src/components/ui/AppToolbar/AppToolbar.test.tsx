import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppToolbar } from "./AppToolbar";
import { appSystem } from "@/styles/theme";

function renderToolbar(props: React.ComponentProps<typeof AppToolbar>) {
  render(
    <ChakraProvider value={appSystem}>
      <AppToolbar {...props} />
    </ChakraProvider>,
  );
}

describe("AppToolbar", () => {
  it("header ロールで描画される", () => {
    renderToolbar({});
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("leftSlot に渡したコンテンツが表示される", () => {
    renderToolbar({ leftSlot: <button>左ボタン</button> });
    expect(screen.getByRole("button", { name: "左ボタン" })).toBeInTheDocument();
  });

  it("rightSlot に渡したコンテンツが表示される", () => {
    renderToolbar({ rightSlot: <button>右ボタン</button> });
    expect(screen.getByRole("button", { name: "右ボタン" })).toBeInTheDocument();
  });

  it("leftSlot と rightSlot を両方渡すと両方表示される", () => {
    renderToolbar({
      leftSlot: <button>左</button>,
      rightSlot: <button>右</button>,
    });
    expect(screen.getByRole("button", { name: "左" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "右" })).toBeInTheDocument();
  });

  it("スロットを渡さなくてもクラッシュしない", () => {
    expect(() => renderToolbar({})).not.toThrow();
  });
});
