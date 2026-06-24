import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cancelPendingSplitHtmlTasks,
  resetSplitHtmlIdleStateForTests,
  splitHtmlIntoBlocksAsync,
} from "./splitHtmlIntoBlocksAsync";
import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

describe("splitHtmlIntoBlocksImpl", () => {
  it("トップレベルの要素をブロックに分割する", () => {
    const html = "<p>あ</p><p>い</p>";
    expect(splitHtmlIntoBlocksImpl(html)).toEqual(["<p>あ</p>", "<p>い</p>"]);
  });
});

describe("splitHtmlIntoBlocksAsync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestIdleCallback",
      (callback: (deadline: IdleDeadline) => void) =>
        window.setTimeout(
          () =>
            callback({
              didTimeout: false,
              timeRemaining: () => 50,
            }),
          0
        )
    );
    vi.stubGlobal("cancelIdleCallback", (id: number) => {
      window.clearTimeout(id);
    });
  });

  afterEach(() => {
    resetSplitHtmlIdleStateForTests();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("テスト環境では同期分割にフォールバックする", async () => {
    const html = "<p>あ</p><p>い</p>";
    await expect(splitHtmlIntoBlocksAsync(html)).resolves.toEqual([
      "<p>あ</p>",
      "<p>い</p>",
    ]);
  });

  it("本番相当では requestIdleCallback 後に分割する", async () => {
    vi.stubEnv("VITEST", "");

    const html = "<p>あ</p><p>い</p>";
    const resultPromise = splitHtmlIntoBlocksAsync(html);

    await vi.runAllTimersAsync();

    await expect(resultPromise).resolves.toEqual(["<p>あ</p>", "<p>い</p>"]);
  });

  it("cancelPendingSplitHtmlTasks で保留中の分割をキャンセルできる", async () => {
    vi.stubEnv("VITEST", "");

    const html = "<p>あ</p>";
    const resultPromise = splitHtmlIntoBlocksAsync(html);
    cancelPendingSplitHtmlTasks();

    const settled = await Promise.race([
      resultPromise.then(() => "resolved"),
      Promise.resolve("pending"),
    ]);

    expect(settled).toBe("pending");
  });
});
