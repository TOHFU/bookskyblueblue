import { describe, expect, it } from "vitest";
import { splitHtmlIntoBlocksAsync } from "./splitHtmlIntoBlocksAsync";
import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

describe("splitHtmlIntoBlocksImpl", () => {
  it("トップレベルの要素をブロックに分割する", () => {
    const html = "<p>あ</p><p>い</p>";
    expect(splitHtmlIntoBlocksImpl(html)).toEqual(["<p>あ</p>", "<p>い</p>"]);
  });
});

describe("splitHtmlIntoBlocksAsync", () => {
  it("テスト環境では同期分割にフォールバックする", async () => {
    const html = "<p>あ</p><p>い</p>";
    await expect(splitHtmlIntoBlocksAsync(html)).resolves.toEqual([
      "<p>あ</p>",
      "<p>い</p>",
    ]);
  });
});
