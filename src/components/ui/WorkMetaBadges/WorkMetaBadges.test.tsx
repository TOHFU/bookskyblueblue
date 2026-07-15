import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkMetaBadges } from "./WorkMetaBadges";
import { appSystem } from "@/styles/theme";

function renderBadges(props: { writingStyle?: string; publisher?: string }) {
  render(
    <ChakraProvider value={appSystem}>
      <WorkMetaBadges {...props} />
    </ChakraProvider>,
  );
}

describe("WorkMetaBadges", () => {
  it("文字遣い種別と出版社を表示する", () => {
    renderBadges({ writingStyle: "新字新仮名", publisher: "新潮社" });
    expect(screen.getByText("新字新仮名")).toBeInTheDocument();
    expect(screen.getByText("新潮社")).toBeInTheDocument();
  });

  it("6文字を超えるラベルを省略する", () => {
    renderBadges({ writingStyle: "あいうえおかき" });
    expect(screen.getByText("あいうえおか…")).toBeInTheDocument();
  });

  it("両方未指定のときバッジを描画しない", () => {
    renderBadges({});
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
